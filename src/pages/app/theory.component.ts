import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-theory',
  standalone: true,
  imports: [RouterLink, NgClass],
  template: `
    <div class="pb-20 md:pb-6">
      <!-- Hero / Continue Watching -->
      <div class="bg-primary text-white p-6 md:rounded-b-2xl shadow-lg relative overflow-hidden">
        <div class="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
          <svg class="w-64 h-64" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4.0zM12 10.477v4.183c0 .41.305.758.71.784.66.042 1.302.232 1.897.536.96.49 1.954.218 2.502-.456a9.07 9.07 0 00.89-3.477l-6-1.57z" /></svg>
        </div>
        <div class="relative z-10 max-w-7xl mx-auto">
          <p class="text-blue-200 text-sm font-medium mb-2 uppercase tracking-wide">Continuar de onde parou</p>
          <h2 class="text-2xl md:text-3xl font-bold mb-4">Legislação: Infrações e Penalidades</h2>
          <a routerLink="/app/aula/l2" class="inline-flex items-center gap-2 bg-cta hover:bg-ctaHover text-white px-6 py-2 rounded-full font-semibold transition-colors shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
            Assistir Aula
          </a>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        @for (category of db.categories(); track category.id) {
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">{{ category.title }}</h3>
              <a [routerLink]="['/app/categoria', category.id]" class="text-sm text-primary font-medium hover:underline">Ver tudo</a>
            </div>
            
            <div class="flex overflow-x-auto pb-4 gap-4 snap-x hide-scrollbar">
              @for (lesson of db.getLessonsByCategory(category.id); track lesson.id) {
                <a [routerLink]="['/app/aula', lesson.id]" class="flex-none w-64 snap-start group cursor-pointer">
                  <div class="relative rounded-xl overflow-hidden shadow-sm aspect-video mb-3">
                    <img [src]="lesson.thumbnail" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div class="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary ml-1" viewBox="0 0 20 20" fill="currentColor">
                           <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                         </svg>
                      </div>
                    </div>
                    @if (lesson.completed) {
                      <div class="absolute bottom-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        CONCLUÍDO
                      </div>
                    }
                  </div>
                  <h4 class="font-medium text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">{{ lesson.title }}</h4>
                  <p class="text-xs text-gray-500 mt-1">{{ lesson.duration }}</p>
                </a>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class TheoryComponent {
  db = inject(ContentService);
}
