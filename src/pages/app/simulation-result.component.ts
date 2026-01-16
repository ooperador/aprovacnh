import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { NgClass, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-simulation-result',
  standalone: true,
  imports: [RouterLink, NgClass, DecimalPipe],
  template: `
    @if (result(); as r) {
      <div class="min-h-screen bg-bgMain p-6 pb-24">
        <div class="max-w-md mx-auto">
          
          <!-- Score Card -->
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 text-center p-8">
            <h1 class="text-gray-500 font-medium mb-4">Resultado do Simulado</h1>
            
            <div class="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" stroke-width="8" />
                <circle cx="50" cy="50" r="45" fill="none" 
                  [attr.stroke]="isPassed() ? '#10B981' : '#EF4444'" 
                  stroke-width="8" 
                  stroke-dasharray="283" 
                  [attr.stroke-dashoffset]="283 - (283 * percentage() / 100)"
                  stroke-linecap="round" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-bold text-gray-900">{{ percentage() | number:'1.0-0' }}%</span>
                <span class="text-xs text-gray-500 uppercase font-bold">{{ isPassed() ? 'Aprovado' : 'Reprovado' }}</span>
              </div>
            </div>

            <p class="text-gray-600 mb-6">
              Você acertou <strong class="text-gray-900">{{ r.score }}</strong> de {{ r.total }} questões.
              @if (isPassed()) {
                Parabéns! Você está indo muito bem.
              } @else {
                Continue estudando para melhorar sua pontuação.
              }
            </p>

            <div class="grid grid-cols-2 gap-4">
              <a routerLink="/app/simulados" class="block w-full py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 text-sm">
                Sair
              </a>
              <a routerLink="/app/simulado/fazer" class="block w-full py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/30 text-sm">
                Novo Teste
              </a>
            </div>
          </div>

          <!-- Weak Points Mock -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Pontos de Atenção
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Direção Defensiva</span>
                <span class="text-red-500 font-medium">2 erros</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div class="bg-red-500 h-2 rounded-full" style="width: 40%"></div>
              </div>
              
              <div class="flex items-center justify-between text-sm pt-2">
                <span class="text-gray-600">Mecânica Básica</span>
                <span class="text-orange-500 font-medium">1 erro</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div class="bg-orange-400 h-2 rounded-full" style="width: 60%"></div>
              </div>
            </div>
            <button class="w-full mt-6 text-primary text-sm font-bold hover:underline">
              Revisar questões erradas
            </button>
          </div>
        </div>
      </div>
    } @else {
      <div class="p-10 text-center">
        <p>Resultado não encontrado.</p>
        <a routerLink="/app/simulados" class="text-primary underline">Voltar</a>
      </div>
    }
  `
})
export class SimulationResultComponent {
  db = inject(ContentService);
  result = this.db.lastSimulationResult;

  percentage = computed(() => {
    const r = this.result();
    return r ? (r.score / r.total) * 100 : 0;
  });

  isPassed = computed(() => this.percentage() >= 70);
}
