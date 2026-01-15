import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-bgMain flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-primary">Recuperar senha</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enviaremos um link para você redefinir sua senha.
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          @if (sent) {
            <div class="rounded-md bg-green-50 p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Email enviado com sucesso!</h3>
                </div>
              </div>
            </div>
            <a routerLink="/login" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">
              Voltar para Login
            </a>
          } @else {
            <div class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <div class="mt-1">
                  <input [formControl]="emailControl" id="email" type="email" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm">
                </div>
              </div>

              <div>
                <button (click)="onSubmit()" [disabled]="emailControl.invalid" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none disabled:opacity-50">
                  Enviar link de recuperação
                </button>
              </div>
              
              <div class="text-center">
                <a routerLink="/login" class="font-medium text-gray-500 hover:text-gray-900 text-sm">
                  Cancelar
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class RecoverComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  sent = false;

  onSubmit() {
    if (this.emailControl.valid) {
      this.sent = true;
    }
  }
}
