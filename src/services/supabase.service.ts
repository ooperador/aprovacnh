import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  client: SupabaseClient | null = null;
  isConfigured = signal<boolean>(false);

  constructor() {
    try {
      // Check for env vars safely
      const env = (import.meta as any).env || {};
      const url = env.VITE_SUPABASE_URL;
      const key = env.VITE_SUPABASE_ANON_KEY;

      if (url && key) {
        this.client = createClient(url, key);
        this.isConfigured.set(true);
        console.log('Supabase configured successfully');
      } else {
        console.warn('Supabase env vars missing. Running in Demo Mode.');
      }
    } catch (e) {
      console.warn('Error initializing Supabase. Running in Demo Mode.', e);
    }
  }
}
