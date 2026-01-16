import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Olá, Aluno!</h1>
      
      <!-- Stats / Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
             <div class="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Continuar estudando</div>
             <h3 class="text-lg font-medium text-gray-900">Legislação de Trânsito</h3>
             <p class="text-sm text-gray-500 mt-1">Aula 3: Infrações e Penalidades</p>
          </div>
          <button class="mt-4 w-full py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition">Continuar</button>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
           <div>
             <div class="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Simulado Rápido</div>
             <h3 class="text-lg font-medium text-gray-900">Teste seus conhecimentos</h3>
             <p class="text-sm text-gray-500 mt-1">30 questões aleatórias</p>
           </div>
           <button class="mt-4 w-full py-2 bg-cta text-white rounded-lg font-medium hover:bg-ctaHover transition">Iniciar Simulado</button>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
           <div>
             <div class="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">Seu Progresso</div>
             <div class="flex items-end gap-2 mt-2">
               <span class="text-4xl font-bold text-gray-900">24%</span>
               <span class="text-sm text-gray-500 mb-1">concluído</span>
             </div>
           </div>
           <div class="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
             <div class="h-full bg-purple-500 w-[24%]"></div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}
