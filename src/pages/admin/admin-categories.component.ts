import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContentService, Category } from '../../services/content.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Categorias</h1>
      <button (click)="isCreating.set(true)" class="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90">
        + Nova Categoria
      </button>
    </div>

    <!-- Create Form -->
    @if (isCreating()) {
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-fade-in">
        <h3 class="font-bold text-lg mb-4">Nova Categoria</h3>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Título</label>
              <input formControlName="title" type="text" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Cor (Tailwind Class)</label>
              <input formControlName="color" type="text" placeholder="bg-blue-600" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900">
            </div>
            <div class="md:col-span-2">
               <label class="block text-sm font-medium text-gray-700">URL Imagem</label>
               <input formControlName="image" type="text" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900">
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" (click)="isCreating.set(false)" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" [disabled]="form.invalid" class="px-4 py-2 bg-cta text-white rounded-lg hover:bg-ctaHover disabled:opacity-50">Salvar</button>
          </div>
        </form>
      </div>
    }

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aulas</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          @for (cat of db.categories(); track cat.id) {
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div [class]="cat.color + ' h-8 w-8 rounded flex-shrink-0 mr-3'"></div>
                  <div class="text-sm font-medium text-gray-900">{{ cat.title }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ db.getLessonsByCategory(cat.id).length }} aulas
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button (click)="delete(cat.id)" class="text-red-600 hover:text-red-900">Excluir</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminCategoriesComponent {
  db = inject(ContentService);
  fb = inject(FormBuilder);
  isCreating = signal(false);

  form = this.fb.group({
    title: ['', Validators.required],
    color: ['bg-gray-600', Validators.required],
    image: ['https://picsum.photos/200/300', Validators.required]
  });

  async submit() {
    if (this.form.valid) {
      await this.db.createCategory(this.form.value as any);
      this.isCreating.set(false);
      this.form.reset({ color: 'bg-gray-600', image: 'https://picsum.photos/200/300' });
    }
  }

  async delete(id: string) {
    if (confirm('Tem certeza? Isso pode afetar aulas vinculadas.')) {
      await this.db.deleteCategory(id);
    }
  }
}
