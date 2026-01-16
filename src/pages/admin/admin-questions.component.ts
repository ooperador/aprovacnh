import { Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContentService } from '../../services/content.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-questions',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Questões</h1>
      <button (click)="isCreating.set(true)" class="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90">
        + Nova Questão
      </button>
    </div>
    
    <!-- Filter -->
    <div class="mb-6">
      <input type="text" placeholder="Buscar por enunciado..." (input)="search.set($any($event.target).value)" class="w-full max-w-md px-4 py-2 border rounded-lg bg-white text-gray-900">
    </div>

    @if (isCreating()) {
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 class="font-bold text-lg mb-4">Nova Questão</h3>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="space-y-4 mb-4">
             <div>
               <label class="block text-sm font-medium text-gray-700">Enunciado</label>
               <textarea formControlName="text" rows="2" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900"></textarea>
             </div>
             <div>
               <label class="block text-sm font-medium text-gray-700">Categoria</label>
               <select formControlName="categoryId" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900">
                 @for (cat of db.categories(); track cat.id) {
                   <option [value]="cat.id">{{ cat.title }}</option>
                 }
               </select>
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div><input formControlName="optA" placeholder="Opção A" class="w-full border rounded p-2 bg-white text-gray-900"></div>
               <div><input formControlName="optB" placeholder="Opção B" class="w-full border rounded p-2 bg-white text-gray-900"></div>
               <div><input formControlName="optC" placeholder="Opção C" class="w-full border rounded p-2 bg-white text-gray-900"></div>
               <div><input formControlName="optD" placeholder="Opção D" class="w-full border rounded p-2 bg-white text-gray-900"></div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label class="block text-sm font-medium text-gray-700">Correta</label>
                  <select formControlName="correctIndex" class="mt-1 w-full border rounded p-2 bg-white text-gray-900">
                    <option [value]="0">A</option>
                    <option [value]="1">B</option>
                    <option [value]="2">C</option>
                    <option [value]="3">D</option>
                  </select>
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700">Explicação</label>
                 <input formControlName="explanation" class="mt-1 w-full border rounded p-2 bg-white text-gray-900">
               </div>
             </div>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" (click)="isCreating.set(false)" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" [disabled]="form.invalid" class="px-4 py-2 bg-cta text-white rounded-lg hover:bg-ctaHover disabled:opacity-50">Salvar</button>
          </div>
        </form>
      </div>
    }

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Enunciado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          @for (q of filteredQuestions(); track q.id) {
            <tr>
              <td class="px-6 py-4 text-sm text-gray-900">
                <p class="line-clamp-2">{{ q.text }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ db.getCategoryById(q.categoryId)?.title || '...' }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <button (click)="delete(q.id)" class="text-red-600 hover:text-red-900">Excluir</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
      @if (filteredQuestions().length === 0) {
        <div class="p-6 text-center text-gray-500">Nenhuma questão encontrada.</div>
      }
    </div>
  `
})
export class AdminQuestionsComponent {
  db = inject(ContentService);
  fb = inject(FormBuilder);
  isCreating = signal(false);
  search = signal('');

  form = this.fb.group({
    text: ['', Validators.required],
    categoryId: ['', Validators.required],
    optA: ['', Validators.required],
    optB: ['', Validators.required],
    optC: ['', Validators.required],
    optD: ['', Validators.required],
    correctIndex: [0, Validators.required],
    explanation: ['', Validators.required]
  });

  filteredQuestions = computed(() => {
    const s = this.search().toLowerCase();
    return this.db.questions().filter(q => q.text.toLowerCase().includes(s)).slice(0, 50); // limit render
  });

  async submit() {
    if (this.form.valid) {
      const v = this.form.value;
      const question = {
        categoryId: v.categoryId!,
        text: v.text!,
        options: [v.optA!, v.optB!, v.optC!, v.optD!],
        correctIndex: +v.correctIndex!,
        explanation: v.explanation!
      };
      await this.db.createQuestion(question);
      this.isCreating.set(false);
      this.form.reset({ correctIndex: 0 });
    }
  }

  async delete(id: string) {
    if(confirm('Excluir questão?')) {
      await this.db.deleteQuestion(id);
    }
  }
}
