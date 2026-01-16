import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-bgMain flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-primary">Crie sua conta</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Comece a estudar hoje mesmo
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nome completo</label>
              <div class="mt-1">
                <input formControlName="name" id="name" type="text" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-900">
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <div class="mt-1">
                <input formControlName="email" id="email" type="email" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-900">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
              <div class="mt-1">
                <input formControlName="password" id="password" type="password" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-white text-gray-900">
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="registerForm.invalid" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cta hover:bg-ctaHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cta disabled:opacity-50">
                Cadastrar
              </button>
            </div>
          </form>

          <div class="mt-6">
             <div class="text-center text-sm">
               <span class="text-gray-500">Já tem uma conta? </span>
               <a routerLink="/login" class="font-medium text-primary hover:text-primary/80">Fazer login</a>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  auth = inject(AuthService);
  fb = inject(FormBuilder);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.auth.register(name!, email!, password!);
    }
  }
}
