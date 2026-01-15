import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto pb-20">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Minha Conta</h1>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
           <h2 class="text-lg font-medium text-gray-900">Dados Pessoais</h2>
           <p class="text-sm text-gray-500">Atualize suas informações para personalizar seu estudo.</p>
        </div>
        
        <form [formGroup]="form" (ngSubmit)="save()" class="p-6 space-y-6">
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label class="block text-sm font-medium text-gray-700">Nome Completo</label>
               <input formControlName="name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border">
             </div>
             
             <div>
               <label class="block text-sm font-medium text-gray-700">Email</label>
               <input formControlName="email" type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 text-gray-500 sm:text-sm px-3 py-2 border" readonly>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Estado (UF)</label>
               <select formControlName="state" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border">
                 <option value="">Selecione...</option>
                 <option value="SP">São Paulo</option>
                 <option value="RJ">Rio de Janeiro</option>
                 <option value="MG">Minas Gerais</option>
                 <option value="RS">Rio Grande do Sul</option>
                 <option value="PR">Paraná</option>
               </select>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Data Prevista da Prova</label>
               <input formControlName="examDate" type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border">
             </div>
           </div>

           @if (saved()) {
             <div class="bg-green-50 text-green-800 p-3 rounded-md text-sm">
               Dados salvos com sucesso!
             </div>
           }

           <div class="flex justify-end pt-4">
             <button type="submit" [disabled]="form.invalid || form.pristine" class="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
               Salvar Alterações
             </button>
           </div>
        </form>
      </div>

      <div class="mt-8">
        <button (click)="auth.logout()" class="text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
          Sair da conta
        </button>
      </div>
    </div>
  `
})
export class AccountComponent {
  auth = inject(AuthService);
  db = inject(ContentService); // Although not used directly, keeps DI clean for future
  fb = inject(FormBuilder);
  
  saved = signal(false);

  form = this.fb.group({
    name: [this.auth.currentUser()?.name || '', Validators.required],
    email: [this.auth.currentUser()?.email || ''],
    state: [this.auth.currentUser()?.uf || ''],
    examDate: [this.auth.currentUser()?.examDate || '']
  });

  async save() {
    if (this.form.valid) {
      await this.auth.updateProfile({
        name: this.form.value.name!,
        uf: this.form.value.state || undefined,
        examDate: this.form.value.examDate || undefined
      });
      
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 3000);
      this.form.markAsPristine();
    }
  }
}
