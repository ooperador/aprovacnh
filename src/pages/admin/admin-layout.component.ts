import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div class="h-16 flex items-center px-6 border-b border-gray-100">
          <span class="text-xl font-bold text-gray-900">Admin Panel</span>
          @if (!supabase.isConfigured()) {
            <span class="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">DEMO</span>
          }
        </div>
        
        <nav class="p-4 space-y-1">
          <a routerLink="./dashboard" routerLinkActive="bg-gray-100 text-primary" class="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </a>
          <a routerLink="./categorias" routerLinkActive="bg-gray-100 text-primary" class="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            Categorias
          </a>
          <a routerLink="./aulas" routerLinkActive="bg-gray-100 text-primary" class="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Aulas
          </a>
          <a routerLink="./questoes" routerLinkActive="bg-gray-100 text-primary" class="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Questões
          </a>
          <a routerLink="./importar" routerLinkActive="bg-gray-100 text-primary" class="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Importar CSV
          </a>
        </nav>

        <div class="p-4 border-t border-gray-200 mt-auto">
          <div class="flex items-center gap-2 mb-4 px-4">
             <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
               AD
             </div>
             <div class="text-sm">
               <p class="font-medium text-gray-900">Admin</p>
               <p class="text-xs text-gray-500">Super User</p>
             </div>
          </div>
          <button (click)="exit()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
            Sair do Admin
          </button>
        </div>
      </aside>

      <!-- Content -->
      <main class="flex-1 p-6 md:p-8 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  supabase = inject(SupabaseService);

  exit() {
    this.auth.router.navigate(['/app/dashboard']);
  }
}
