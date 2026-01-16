import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-bgMain flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
           <h2 class="text-2xl font-bold text-gray-900">Bem-vindo, {{ auth.currentUser()?.name }}!</h2>
           <p class="text-gray-500 mt-2">Para personalizarmos seu estudo, precisamos de alguns detalhes.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Seu Estado (UF)</label>
             <select formControlName="uf" class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-3 px-4 bg-white text-gray-900">
               <option value="">Selecione...</option>
               <option value="SP">São Paulo</option>
               <option value="RJ">Rio de Janeiro</option>
               <option value="MG">Minas Gerais</option>
               <option value="RS">Rio Grande do Sul</option>
               <option value="PR">Paraná</option>
               <!-- Add others -->
             </select>
           </div>

           <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Data Prevista da Prova (Opcional)</label>
             <input type="date" formControlName="examDate" class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-3 px-4 bg-white text-gray-900">
           </div>

           <button type="submit" [disabled]="form.invalid" class="w-full bg-cta text-white font-bold py-3 rounded-xl hover:bg-ctaHover transition-colors disabled:opacity-50">
             Começar a Estudar
           </button>
        </form>
      </div>
    </div>
  `
})
export class OnboardingComponent {
  auth = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  form = this.fb.group({
    uf: ['', Validators.required],
    examDate: ['']
  });

  async submit() {
    if (this.form.valid) {
      await this.auth.updateProfile({
        uf: this.form.value.uf!,
        examDate: this.form.value.examDate || undefined
      });
      this.router.navigate(['/app/dashboard']);
    }
  }
}
