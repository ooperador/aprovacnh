import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterLink, NgClass],
  template: `
    @if (category()) {
      <div class="min-h-screen bg-bgMain">
        <!-- Header -->
        <div class="relative bg-primary h-48 md:h-64 flex items-end">
          <img [src]="category()!.image" class="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay">
          <div class="relative z-10 max-w-7xl mx-auto w-full px-6 pb-8">
            <h1 class="text-3xl md:text-4xl font-bold text-white">{{ category()!.title }}</h1>
            <p class="text-blue-100 mt-2">Módulo completo</p>
          </div>
        </div>

        <!-- Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             @for (lesson of lessons(); track lesson.id) {
               <a [routerLink]="['/app/aula', lesson.id]" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 hover:border-primary/50 transition-colors group">
                  <div class="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                     <img [src]="lesson.thumbnail" class="w-full h-full object-cover">
                     @if (lesson.completed) {
                       <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                         </svg>
                       </div>
                     }
                  </div>
                  <div class="flex-1">
                     <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary leading-tight">{{ lesson.title }}</h3>
                     <p class="text-xs text-gray-500 mt-1">{{ lesson.duration }}</p>
                     @if (!lesson.completed) {
                       <div class="flex items-center gap-1 mt-2 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                         <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                         Assistir
                       </div>
                     }
                  </div>
               </a>
             }
          </div>
        </div>
      </div>
    }
  `
})
export class CategoryComponent {
  private route = inject(ActivatedRoute);
  private db = inject(ContentService);

  category = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? this.db.getCategoryById(id) : null;
  });

  lessons = computed(() => {
    const cat = this.category();
    return cat ? this.db.getLessonsByCategory(cat.id) : [];
  });
}
