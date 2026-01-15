import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [RouterLink, NgClass],
  template: `
    @if (lesson()) {
      <div class="min-h-screen bg-bgMain pb-10">
        <!-- Player Placeholder -->
        <div class="bg-black aspect-video w-full md:max-w-4xl md:mx-auto md:mt-6 md:rounded-xl shadow-xl flex items-center justify-center relative group">
           <img [src]="lesson()!.thumbnail" class="absolute inset-0 w-full h-full object-cover opacity-50">
           <button class="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group-hover:bg-white/30">
             <svg class="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
           </button>
        </div>

        <div class="max-w-4xl mx-auto px-4 mt-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
               <h1 class="text-2xl font-bold text-gray-900">{{ lesson()!.title }}</h1>
               <div class="flex items-center gap-2 mt-1">
                 <span class="text-sm text-gray-500">{{ lesson()!.duration }}</span>
                 <span class="text-gray-300">•</span>
                 <span class="text-sm font-medium text-primary">{{ category()?.title }}</span>
               </div>
            </div>
            <button (click)="toggleComplete()" 
              [class.bg-green-600]="isCompleted()" 
              [class.bg-gray-200]="!isCompleted()"
              [class.text-white]="isCompleted()"
              [class.text-gray-700]="!isCompleted()"
              class="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              @if (isCompleted()) {
                 <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                 <span>Concluída</span>
              } @else {
                 <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <span>Marcar como vista</span>
              }
            </button>
          </div>

          <!-- Tabs -->
          <div class="border-b border-gray-200 mb-6">
             <nav class="-mb-px flex space-x-8 overflow-x-auto">
               <button (click)="activeTab.set('resumo')" [class.border-primary]="activeTab() === 'resumo'" [class.text-primary]="activeTab() === 'resumo'" class="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors" [class.border-transparent]="activeTab() !== 'resumo'" [class.text-gray-500]="activeTab() !== 'resumo'">
                 Resumo
               </button>
               <button (click)="activeTab.set('pdf')" [class.border-primary]="activeTab() === 'pdf'" [class.text-primary]="activeTab() === 'pdf'" class="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors" [class.border-transparent]="activeTab() !== 'pdf'" [class.text-gray-500]="activeTab() !== 'pdf'">
                 Material PDF
               </button>
               <button (click)="activeTab.set('questoes')" [class.border-primary]="activeTab() === 'questoes'" [class.text-primary]="activeTab() === 'questoes'" class="whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors" [class.border-transparent]="activeTab() !== 'questoes'" [class.text-gray-500]="activeTab() !== 'questoes'">
                 Questões
               </button>
             </nav>
          </div>

          <!-- Tab Content -->
          <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[200px]">
            @if (activeTab() === 'resumo') {
              <div class="prose max-w-none text-gray-600">
                <p>Nesta aula, abordamos os conceitos fundamentais de {{ lesson()!.title }}. É crucial entender estes pontos para a prova teórica:</p>
                <ul class="list-disc pl-5 mt-4 space-y-2">
                  <li>Principais definições e normas</li>
                  <li>Casos especiais e exceções</li>
                  <li>Procedimentos de segurança</li>
                </ul>
                <p class="mt-4">Lembre-se de revisar o material de apoio para detalhes técnicos específicos.</p>
              </div>
            }

            @if (activeTab() === 'pdf') {
              <div class="flex flex-col items-center justify-center py-10 text-center">
                <div class="w-16 h-16 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
                  <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h3 class="font-medium text-gray-900">Apostila da Aula</h3>
                <p class="text-sm text-gray-500 mb-4">PDF • 2.4 MB</p>
                <button class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Baixar Material</button>
              </div>
            }

            @if (activeTab() === 'questoes') {
              <div class="text-center py-8">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Pratique o que aprendeu</h3>
                <p class="text-gray-500 mb-6">Teste seus conhecimentos sobre {{ category()?.title }} com questões de simulado.</p>
                <a routerLink="/app/simulado/fazer" [queryParams]="{mode: 'topic', cat: category()?.id}" class="inline-block px-6 py-3 bg-cta text-white font-medium rounded-lg hover:bg-ctaHover transition-colors">
                  Praticar Questões deste Tema
                </a>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class LessonComponent {
  private route = inject(ActivatedRoute);
  private db = inject(ContentService);

  activeTab = signal<'resumo' | 'pdf' | 'questoes'>('resumo');

  lesson = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    const lesson = id ? this.db.getLessonById(id) : null;
    return lesson;
  });

  category = computed(() => {
    const l = this.lesson();
    return l ? this.db.getCategoryById(l.categoryId) : null;
  });

  isCompleted = computed(() => {
    const l = this.lesson();
    return l ? this.db.isLessonCompleted(l.id) : false;
  });

  toggleComplete() {
    const l = this.lesson();
    if (l) {
      this.db.toggleLessonCompletion(l.id);
    }
  }
}
