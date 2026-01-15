import { Component, inject, signal } from '@angular/core';
import { ContentService, Category } from '../../services/content.service';
import { parseCSV, generateCSV } from '../../utils/csv-parser';

@Component({
  selector: 'app-admin-import',
  standalone: true,
  template: `
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Importar Questões (CSV)</h1>

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
      <h3 class="font-bold mb-2">Instruções</h3>
      <p class="text-sm text-gray-600 mb-4">
        O arquivo CSV deve conter cabeçalho. Colunas esperadas:<br>
        <code class="bg-gray-100 px-1 rounded">category, statement, option_a, option_b, option_c, option_d, correct_option, explanation</code>
        <br>
        * 'category' pode ser o nome da categoria. Se não existir, será criada.
        * 'correct_option' deve ser A, B, C ou D.
      </p>

      <div class="flex items-center gap-4">
         <input type="file" (change)="onFileSelect($event)" accept=".csv" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20">
      </div>
    </div>

    @if (status()) {
      <div class="bg-blue-50 p-4 rounded-lg mb-6 flex items-center gap-2 text-blue-800">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ status() }}
      </div>
    }

    @if (report()) {
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 class="font-bold text-lg mb-4">Relatório de Importação</h3>
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-700">{{ report()!.success }}</div>
            <div class="text-xs uppercase font-bold text-green-600">Importadas</div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-yellow-700">{{ report()!.duplicates }}</div>
            <div class="text-xs uppercase font-bold text-yellow-600">Duplicadas</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-red-700">{{ report()!.errors.length }}</div>
            <div class="text-xs uppercase font-bold text-red-600">Falhas</div>
          </div>
        </div>

        @if (report()!.errors.length > 0) {
          <div class="mb-4">
             <button (click)="downloadErrors()" class="text-sm text-red-600 font-bold hover:underline">
               Baixar CSV de erros
             </button>
          </div>
          <div class="max-h-60 overflow-y-auto bg-gray-50 p-4 rounded text-xs font-mono">
            @for (err of report()!.errors; track $index) {
              <div class="text-red-600 mb-1">Linha {{ err.row }}: {{ err.reason }}</div>
            }
          </div>
        }
      </div>
    }
  `
})
export class AdminImportComponent {
  db = inject(ContentService);
  
  status = signal<string | null>(null);
  report = signal<{success: number, duplicates: number, errors: any[]} | null>(null);

  async onFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.status.set('Lendo arquivo...');
    this.report.set(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      await this.processCSV(text);
    };
    reader.readAsText(file);
  }

  async processCSV(text: string) {
    this.status.set('Processando dados...');
    const rows = parseCSV(text);
    
    // Header check (naive)
    const header = rows[0].map(h => h.toLowerCase().trim());
    const expected = ['category', 'statement', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option', 'explanation'];
    
    // Map indices
    const idx: any = {};
    expected.forEach(key => idx[key] = header.indexOf(key));
    
    if (idx.statement === -1 || idx.correct_option === -1) {
      this.status.set(null);
      alert('CSV inválido. Colunas obrigatórias não encontradas.');
      return;
    }

    let success = 0;
    let duplicates = 0;
    let errors = [];

    // Pre-fetch categories for matching
    const cats = this.db.categories();
    
    // Batch processing
    const batchSize = 10;
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 2) continue; // Empty row

      try {
        const statement = row[idx.statement];
        const correctOpt = row[idx.correct_option]?.toUpperCase().trim();
        const catName = idx.category > -1 ? row[idx.category] : 'Geral';
        
        // Basic Validation
        if (!statement || !correctOpt) throw new Error('Dados incompletos');
        if (!['A','B','C','D'].includes(correctOpt)) throw new Error(`Opção correta inválida: ${correctOpt}`);

        // Deduplication Check
        const exists = this.db.questions().some(q => q.text === statement);
        if (exists) {
          duplicates++;
          continue;
        }

        // Category Logic
        let catId = cats.find(c => c.title.toLowerCase() === catName.toLowerCase())?.id;
        if (!catId) {
          // Auto create category
          const newCat = { 
            title: catName, 
            color: 'bg-gray-500', 
            image: 'https://picsum.photos/200/150' 
          };
          await this.db.createCategory(newCat);
          // Refresh local list
          catId = this.db.categories().find(c => c.title === catName)!.id;
        }

        // Create Question
        const q = {
          categoryId: catId,
          text: statement,
          options: [
            row[idx.option_a] || '', 
            row[idx.option_b] || '', 
            row[idx.option_c] || '', 
            row[idx.option_d] || ''
          ],
          correctIndex: ['A','B','C','D'].indexOf(correctOpt),
          explanation: row[idx.explanation] || ''
        };

        await this.db.createQuestion(q);
        success++;
        
        if (i % 5 === 0) this.status.set(`Importando linha ${i} de ${rows.length}...`);

      } catch (err: any) {
        errors.push({ row: i + 1, reason: err.message, data: row });
      }
    }

    this.status.set(null);
    this.report.set({ success, duplicates, errors });
  }

  downloadErrors() {
    const r = this.report();
    if (!r || r.errors.length === 0) return;

    const header = ['Linha', 'Motivo', 'Dados Originais'];
    const rows = [header, ...r.errors.map(e => [e.row.toString(), e.reason, e.data.join('|')])];
    const csvContent = generateCSV(rows);
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'erros_importacao.csv';
    a.click();
  }
}
