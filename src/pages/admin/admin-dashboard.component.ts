import { Component, inject } from '@angular/core';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Visão Geral</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 uppercase">Total de Categorias</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ db.categories().length }}</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 uppercase">Aulas Cadastradas</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ db.lessons().length }}</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-sm font-medium text-gray-500 uppercase">Banco de Questões</h3>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ db.questions().length }}</p>
      </div>
    </div>

    <div class="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
      <h3 class="font-bold text-blue-900">Dica de Gestão</h3>
      <p class="text-blue-800 text-sm mt-1">
        Utilize a ferramenta de importação CSV para adicionar grandes volumes de questões de uma só vez.
        Certifique-se de que os nomes das categorias no CSV correspondam exatamente aos cadastrados.
      </p>
    </div>
  `
})
export class AdminDashboardComponent {
  db = inject(ContentService);
}
