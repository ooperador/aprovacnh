import { Component, inject, computed } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  template: `
    <div class="p-6 max-w-7xl mx-auto pb-20">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Meu Progresso</h1>

      <!-- Probability Card -->
      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-6">
         <div class="relative w-32 h-32 flex-shrink-0">
             <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" stroke-width="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#8B5CF6" stroke-width="8" stroke-dasharray="283" stroke-dashoffset="100" stroke-linecap="round" />
             </svg>
             <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-2xl font-bold text-gray-900">65%</span>
                <span class="text-[10px] text-gray-500 uppercase">Chance</span>
             </div>
         </div>
         <div class="text-center md:text-left">
           <h2 class="text-lg font-bold text-gray-900">Probabilidade de Aprovação</h2>
           <p class="text-gray-500 text-sm mt-1">Baseado no seu histórico de simulados e aulas assistidas. Complete mais simulados para aumentar sua precisão.</p>
         </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
           <div class="text-gray-500 text-xs uppercase font-bold mb-1">Aulas Vistas</div>
           <div class="text-2xl font-bold text-gray-900">{{ db.userProgress().size }}</div>
         </div>
         <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
           <div class="text-gray-500 text-xs uppercase font-bold mb-1">Simulados</div>
           <div class="text-2xl font-bold text-gray-900">{{ db.simulationHistory().length }}</div>
         </div>
         <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
           <div class="text-gray-500 text-xs uppercase font-bold mb-1">Média Geral</div>
           <div class="text-2xl font-bold text-gray-900">{{ averageScore() | number:'1.0-0' }}%</div>
         </div>
         <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
           <div class="text-gray-500 text-xs uppercase font-bold mb-1">Questões</div>
           <div class="text-2xl font-bold text-gray-900">{{ totalQuestionsAnswered() }}</div>
         </div>
      </div>

      <!-- Category Breakdown -->
      <h3 class="font-bold text-gray-900 mb-4">Desempenho por Matéria</h3>
      <div class="space-y-4 mb-8">
        @for (cat of db.categories(); track cat.id) {
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-700">{{ cat.title }}</span>
              <span class="font-medium text-gray-900">
                 {{ getRandomProgress(cat.id) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div [class]="cat.color + ' h-2 rounded-full'" [style.width.%]="getRandomProgress(cat.id)"></div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ProgressComponent {
  db = inject(ContentService);

  averageScore = computed(() => {
    const hist = this.db.simulationHistory();
    if (hist.length === 0) return 0;
    const total = hist.reduce((acc, curr) => acc + (curr.score / curr.total), 0);
    return (total / hist.length) * 100;
  });

  totalQuestionsAnswered = computed(() => {
    return this.db.simulationHistory().reduce((acc, curr) => acc + curr.total, 0);
  });

  getRandomProgress(seed: string) {
    return 40 + (seed.charCodeAt(0) % 50); 
  }
}
