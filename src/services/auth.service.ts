import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  uf?: string;
  examDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private supabase = inject(SupabaseService);

  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  currentUser = signal<UserProfile | null>(null);

  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.init();
  }

  // Allow guards to wait for auth check
  ensureInitialized() {
    return this.initPromise;
  }

  private async init() {
    if (this.supabase.isConfigured() && this.supabase.client) {
      try {
        // Real Auth Check
        const { data: { session } } = await this.supabase.client.auth.getSession();
        
        if (session) {
          await this.loadProfile(session.user.id, session.user.email!);
        } else {
          this.isAuthenticated.set(false);
          this.currentUser.set(null);
        }

        // Listen for auth changes
        this.supabase.client.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            this.isLoading.set(true);
            await this.loadProfile(session.user.id, session.user.email!);
          } else if (event === 'SIGNED_OUT') {
            this.currentUser.set(null);
            this.isAuthenticated.set(false);
            this.router.navigate(['/login']);
          }
        });

      } catch (err) {
        console.error('Auth Init Error:', err);
      } finally {
        this.isLoading.set(false);
      }
    } else {
      // Mock Auth Check (Demo Mode)
      const storedUser = localStorage.getItem('demo_user');
      if (storedUser) {
        this.currentUser.set(JSON.parse(storedUser));
        this.isAuthenticated.set(true);
      }
      this.isLoading.set(false);
    }
  }

  async loadProfile(userId: string, email: string) {
    if (this.supabase.client) {
      const { data, error } = await this.supabase.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        this.currentUser.set({
          id: userId,
          email,
          name: data.name,
          role: data.role || 'user',
          uf: data.uf,
          examDate: data.exam_date
        });
        this.isAuthenticated.set(true);
      } else {
        // Fallback/Self-heal if profile missing
        console.warn('Profile not found, using basic auth data');
        this.currentUser.set({ id: userId, email, name: email.split('@')[0], role: 'user' });
        this.isAuthenticated.set(true);
      }
    }
    this.isLoading.set(false);
  }

  async login(email: string, password?: string) {
    this.isLoading.set(true);
    
    if (this.supabase.isConfigured() && this.supabase.client) {
      const { error } = await this.supabase.client.auth.signInWithPassword({
        email,
        password: password || '123456',
      });
      if (error) {
        this.isLoading.set(false);
        throw error;
      }
      // Router navigation happens after 'SIGNED_IN' event or manually here
      this.router.navigate(['/app/dashboard']);
    } else {
      // Mock Login
      const role = email.includes('admin') ? 'admin' : 'user';
      const user: UserProfile = { 
        id: 'mock-id-' + Math.random(),
        name: role === 'admin' ? 'Administrador' : 'Aluno Demo', 
        email, 
        role 
      };
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      localStorage.setItem('demo_user', JSON.stringify(user));
      this.isLoading.set(false);
      
      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/app/dashboard']);
      }
    }
  }

  async register(name: string, email: string, password?: string) {
    this.isLoading.set(true);

    if (this.supabase.isConfigured() && this.supabase.client) {
      const { data, error } = await this.supabase.client.auth.signUp({
        email,
        password: password || '123456',
        options: { data: { name } }
      });

      if (error) {
        this.isLoading.set(false);
        throw error;
      }

      // If auto-confirm is on, user is logged in. 
      // We rely on backend triggers for profiles OR create manually here.
      if (data.user) {
        const { error: profileError } = await this.supabase.client.from('profiles').insert({
            id: data.user.id,
            name,
            role: 'user',
            email
        });
        
        if (profileError) console.error('Profile create error', profileError);

        // If session exists immediately
        if (data.session) {
           await this.loadProfile(data.user.id, email);
           this.router.navigate(['/app/onboarding']);
        } else {
           alert('Verifique seu email para confirmar o cadastro.');
           this.isLoading.set(false);
        }
      }
    } else {
      await this.login(email);
    }
  }

  async logout() {
    if (this.supabase.isConfigured() && this.supabase.client) {
      await this.supabase.client.auth.signOut();
    } else {
      localStorage.removeItem('demo_user');
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.router.navigate(['/login']);
    }
  }

  async updateProfile(data: Partial<UserProfile>) {
    const current = this.currentUser();
    if (!current) return;

    if (this.supabase.isConfigured() && this.supabase.client) {
      const { error } = await this.supabase.client
        .from('profiles')
        .update({
          name: data.name,
          uf: data.uf,
          exam_date: data.examDate
        })
        .eq('id', current.id);
      
      if (!error) {
        this.currentUser.update(u => u ? ({ ...u, ...data }) : null);
      } else {
        throw error;
      }
    } else {
      const updated = { ...current, ...data };
      this.currentUser.set(updated);
      localStorage.setItem('demo_user', JSON.stringify(updated));
    }
  }

  toggleAdminMode() {
    if (this.supabase.isConfigured()) return;

    const current = this.currentUser();
    if (current) {
      const newRole = current.role === 'admin' ? 'user' : 'admin';
      const updated = { ...current, role: newRole as 'user' | 'admin' };
      this.currentUser.set(updated);
      localStorage.setItem('demo_user', JSON.stringify(updated));
      
      if (newRole === 'admin') this.router.navigate(['/admin']);
      else this.router.navigate(['/app/dashboard']);
    }
  }
}
