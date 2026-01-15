import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-admin-lessons',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Aulas</h1>
      <button (click)="isCreating.set(true)" class="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90">
        + Nova Aula
      </button>
    </div>

    @if (isCreating()) {
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 class="font-bold text-lg mb-4">Nova Aula</h3>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Título</label>
              <input formControlName="title" type="text" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
            </div>
            <div>
               <label class="block text-sm font-medium text-gray-700">Categoria</label>
               <select formControlName="categoryId" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                 @for (cat of db.categories(); track cat.id) {
                   <option [value]="cat.id">{{ cat.title }}</option>
                 }
               </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Duração (ex: 15 min)</label>
              <input formControlName="duration" type="text" class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Thumbnail (Upload)</label>
              <input type="file" (change)="onFileSelected($event)" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20">
              @if (uploading()) { <span class="text-xs text-blue-600">Enviando...</span> }
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" (click)="isCreating.set(false)" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" [disabled]="form.invalid || uploading()" class="px-4 py-2 bg-cta text-white rounded-lg hover:bg-ctaHover disabled:opacity-50">Salvar</button>
          </div>
        </form>
      </div>
    }

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aula</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duração</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          @for (lesson of db.lessons(); track lesson.id) {
            <tr>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img [src]="lesson.thumbnail" class="h-10 w-16 object-cover rounded mr-3 bg-gray-100">
                  <div class="text-sm font-medium text-gray-900">{{ lesson.title }}</div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ db.getCategoryById(lesson.categoryId)?.title }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ lesson.duration }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <button (click)="delete(lesson.id)" class="text-red-600 hover:text-red-900">Excluir</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminLessonsComponent {
  db = inject(ContentService);
  fb = inject(FormBuilder);
  isCreating = signal(false);
  uploading = signal(false);

  form = this.fb.group({
    title: ['', Validators.required],
    categoryId: ['', Validators.required],
    duration: ['10 min', Validators.required],
    thumbnail: [''] // Stores URL
  });

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploading.set(true);
      try {
        const url = await this.db.uploadFile(file, 'lesson-covers');
        this.form.patchValue({ thumbnail: url });
      } catch (e) {
        alert('Erro no upload');
      } finally {
        this.uploading.set(false);
      }
    }
  }

  async submit() {
    if (this.form.valid) {
      // If no thumbnail uploaded, use generic placeholder
      if (!this.form.value.thumbnail) {
        this.form.patchValue({ thumbnail: 'https://picsum.photos/300/200' });
      }
      
      await this.db.createLesson(this.form.value as any);
      this.isCreating.set(false);
      this.form.reset({ duration: '10 min' });
    }
  }

  async delete(id: string) {
    if (confirm('Excluir esta aula?')) {
      await this.db.deleteLesson(id);
    }
  }
}
