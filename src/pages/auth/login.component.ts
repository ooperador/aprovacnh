import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-bgMain flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-primary">AprovaCNH</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Estude online. Passe de primeira.
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <div class="mt-1">
                <input formControlName="email" id="email" name="email" type="email" autocomplete="email" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
              <div class="mt-1">
                <input formControlName="password" id="password" name="password" type="password" autocomplete="current-password" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm">
                <a routerLink="/recover" class="font-medium text-primary hover:text-primary/80">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="loginForm.invalid" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                Entrar
              </button>
            </div>
            
            <div class="mt-2 text-center text-xs text-gray-400">
              * Dica: Use "admin@test.com" para testar Admin
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Novo por aqui?
                </span>
              </div>
            </div>

            <div class="mt-6">
              <a routerLink="/register" class="w-full flex justify-center py-2 px-4 border border-primary/20 rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-gray-50">
                Criar conta grátis
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['aluno@teste.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email!;
      const role = email.includes('admin') ? 'admin' : 'user';
      this.auth.login(email, role);
    }
  }
}
