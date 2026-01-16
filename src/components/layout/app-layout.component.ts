import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col md:flex-row bg-bgMain">
      
      <!-- Demo Banner -->
      @if (!supabase.isConfigured()) {
        <div class="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 text-xs flex justify-center items-center gap-4 py-1 z-[60] font-medium">
           <span>Modo Demo — Supabase não configurado</span>
           <button (click)="auth.toggleAdminMode()" class="bg-white/20 px-2 py-0.5 rounded hover:bg-white/40 text-[10px] uppercase font-bold border border-white/30">
             {{ auth.currentUser()?.role === 'admin' ? 'Desativar Admin' : 'Testar Admin' }}
           </button>
        </div>
      }

      <!-- Desktop Sidebar -->
      <aside class="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0" [class.pt-6]="!supabase.isConfigured()">
        <div class="p-6 border-b border-gray-100">
          <h1 class="text-2xl font-bold text-primary">AprovaCNH</h1>
          <p class="text-xs text-gray-500 mt-1">Estude online. Passe de primeira.</p>
        </div>
        
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <a routerLink="/app/dashboard" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>
          <a routerLink="/app/teoria" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Teoria
          </a>
          <a routerLink="/app/simulados" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Simulados
          </a>
          <a routerLink="/app/progresso" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Progresso
          </a>
          <a routerLink="/app/conta" routerLinkActive="bg-primary/10 text-primary" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Conta
          </a>
          
          <!-- Admin Link -->
          @if (auth.currentUser()?.role === 'admin') {
            <a routerLink="/admin" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin Panel
            </a>
          }
        </nav>

        <div class="p-4 border-t border-gray-200">
           <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {{ auth.currentUser()?.name?.charAt(0) }}
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-sm font-medium truncate">{{ auth.currentUser()?.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ auth.currentUser()?.email }}</p>
              </div>
           </div>
           <button (click)="auth.logout()" class="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
             Sair
           </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 pb-20 md:pb-0 overflow-x-hidden" [class.pt-6]="!supabase.isConfigured()">
        <router-outlet></router-outlet>
      </main>

      <!-- Mobile Bottom Nav -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center z-50">
          <a routerLink="/app/dashboard" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 text-gray-500 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="text-[10px]">Home</span>
          </a>
          <a routerLink="/app/teoria" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 text-gray-500 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span class="text-[10px]">Teoria</span>
          </a>
          <a routerLink="/app/simulados" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 text-gray-500 p-2">
             <div class="bg-primary text-white p-2 rounded-full -mt-6 border-4 border-bgMain">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
               </svg>
             </div>
             <span class="text-[10px] font-medium text-primary">Simular</span>
          </a>
          <a routerLink="/app/progresso" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 text-gray-500 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="text-[10px]">Progresso</span>
          </a>
          <a routerLink="/app/conta" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 text-gray-500 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-[10px]">Conta</span>
          </a>
      </nav>
    </div>
  `
})
export class AppLayoutComponent {
  auth = inject(AuthService);
  supabase = inject(SupabaseService);
}
