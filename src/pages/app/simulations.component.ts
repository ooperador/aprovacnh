import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-simulations',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="p-6 max-w-7xl mx-auto pb-24">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Simulados</h1>

      <!-- Main Action -->
      <div class="bg-gradient-to-r from-primary to-blue-800 rounded-2xl p-6 md:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div class="absolute right-0 top-0 opacity-10 w-64 h-64 transform translate-x-16 -translate-y-16">
           <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
        </div>
        <div class="relative z-10">
          <h2 class="text-3xl font-bold mb-2">Simulado Completo</h2>
          <p class="text-blue-100 mb-6 max-w-lg">30 questões • 40 minutos • Igual à prova do DETRAN. Teste seus conhecimentos gerais.</p>
          <a routerLink="/app/simulado/fazer" [queryParams]="{mode: 'full'}" class="inline-block bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
            Iniciar Prova
          </a>
        </div>
      </div>

      <h2 class="text-lg font-semibold text-gray-900 mb-4">Treinar por Matéria</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        @for (cat of db.categories(); track cat.id) {
          <div class="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary/40 transition-colors shadow-sm flex items-center gap-4">
             <div [class]="cat.color + ' w-12 h-12 rounded-lg flex items-center justify-center text-white shrink-0'">
               <span class="text-lg font-bold">{{ cat.title.charAt(0) }}</span>
             </div>
             <div class="flex-1">
               <h3 class="font-medium text-gray-900">{{ cat.title }}</h3>
               <p class="text-xs text-gray-500">Questões aleatórias</p>
             </div>
             <a [routerLink]="['/app/simulado/fazer']" [queryParams]="{mode: 'topic', cat: cat.id}" class="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </a>
          </div>
        }
      </div>

      <h2 class="text-lg font-semibold text-gray-900 mb-4">Histórico Recente</h2>
      <div class="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        @if (db.simulationHistory().length === 0) {
          <div class="p-6 text-center text-gray-500 text-sm">Nenhum simulado realizado ainda.</div>
        }
        @for (result of db.simulationHistory().slice(0, 5); track result.id) {
          <div class="p-4 flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900">Simulado {{ result.total === 30 ? 'Geral' : 'Rápido' }}</div>
              <div class="text-xs text-gray-500">{{ result.date | date:'dd/MM/yyyy HH:mm' }}</div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-bold" [class.text-green-600]="result.score >= result.total * 0.7" [class.text-red-600]="result.score < result.total * 0.7">
                {{ result.score }}/{{ result.total }}
              </span>
              <div class="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full" [style.width.%]="(result.score / result.total) * 100" [class.bg-green-500]="result.score >= result.total * 0.7" [class.bg-red-500]="result.score < result.total * 0.7"></div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class SimulationsComponent {
  db = inject(ContentService);
}
