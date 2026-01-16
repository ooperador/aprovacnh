import { Injectable, signal, inject, effect } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

export interface Category {
  id: string;
  title: string;
  color: string;
  image: string;
}

export interface Lesson {
  id: string;
  categoryId: string;
  title: string;
  duration: string;
  thumbnail: string;
  completed?: boolean;
}

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  options: string[]; // [A, B, C, D]
  correctIndex: number; // 0-3
  explanation: string;
}

export interface SimulationResult {
  id: string;
  date: Date;
  score: number;
  total: number;
  answers: { questionId: string; correct: boolean }[];
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  // State Signals
  categories = signal<Category[]>([]);
  lessons = signal<Lesson[]>([]);
  questions = signal<Question[]>([]); 
  
  userProgress = signal<Set<string>>(new Set());
  simulationHistory = signal<SimulationResult[]>([]);
  lastSimulationResult = signal<SimulationResult | null>(null);

  // Mock Data (Fallback)
  private readonly MOCK_CATEGORIES: Category[] = [
    { id: 'leg', title: 'Legislação de Trânsito', color: 'bg-blue-600', image: 'https://picsum.photos/id/1/200/120' },
    { id: 'dir', title: 'Direção Defensiva', color: 'bg-green-600', image: 'https://picsum.photos/id/2/200/120' },
    { id: 'pri', title: 'Primeiros Socorros', color: 'bg-red-600', image: 'https://picsum.photos/id/3/200/120' },
    { id: 'amb', title: 'Meio Ambiente', color: 'bg-yellow-600', image: 'https://picsum.photos/id/4/200/120' },
    { id: 'mec', title: 'Mecânica Básica', color: 'bg-gray-600', image: 'https://picsum.photos/id/5/200/120' },
  ];

  private readonly MOCK_LESSONS: Lesson[] = [
    { id: 'l1', categoryId: 'leg', title: 'Processo de Habilitação', duration: '12 min', thumbnail: 'https://picsum.photos/id/10/300/180' },
    { id: 'l2', categoryId: 'leg', title: 'Infrações e Penalidades', duration: '15 min', thumbnail: 'https://picsum.photos/id/11/300/180' },
    { id: 'l3', categoryId: 'leg', title: 'Sinalização Viária', duration: '20 min', thumbnail: 'https://picsum.photos/id/12/300/180' },
    { id: 'l4', categoryId: 'dir', title: 'Elementos da Direção Defensiva', duration: '10 min', thumbnail: 'https://picsum.photos/id/13/300/180' },
  ];

  private readonly MOCK_QUESTIONS: Question[] = [
    { id: 'q1', categoryId: 'leg', text: 'A CNH tem validade de quantos anos para condutores com menos de 50 anos?', options: ['5 anos', '10 anos', '3 anos', 'Indeterminada'], correctIndex: 1, explanation: 'Para condutores com menos de 50 anos, a validade da CNH é de 10 anos.' },
    { id: 'q2', categoryId: 'dir', text: 'O que é direção defensiva?', options: ['Dirigir devagar', 'Dirigir com medo', 'Dirigir de modo a evitar acidentes', 'Dirigir apenas em dias de sol'], correctIndex: 2, explanation: 'Direção defensiva é o conjunto de medidas para prevenir acidentes.' }
  ];

  constructor() {
    // Reactive data loading
    effect(() => {
      if (this.supabase.isConfigured()) {
        // Trigger load when authenticated or when initialized
        // Even if not authenticated, we can load public categories
        this.loadRealData(); 
      } else {
        this.loadMockData();
      }
    });
  }

  // --- Data Loading ---

  private loadMockData() {
    const localCats = localStorage.getItem('demo_categories');
    const localLessons = localStorage.getItem('demo_lessons');
    const localQuestions = localStorage.getItem('demo_questions');

    this.categories.set(localCats ? JSON.parse(localCats) : this.MOCK_CATEGORIES);
    this.questions.set(localQuestions ? JSON.parse(localQuestions) : this.MOCK_QUESTIONS);
    
    const baseLessons = localLessons ? JSON.parse(localLessons) : this.MOCK_LESSONS;
    const progress = localStorage.getItem('aprovacnh_progress');
    const completedSet = progress ? new Set<string>(JSON.parse(progress)) : new Set<string>();
    this.userProgress.set(completedSet);

    this.lessons.set(baseLessons.map((l: Lesson) => ({
      ...l,
      completed: completedSet.has(l.id)
    })));
  }

  private async loadRealData() {
    try {
      // 1. Load Public Data
      const { data: cats } = await this.supabase.client!.from('categories').select('*');
      if (cats) this.categories.set(cats);

      const { data: less } = await this.supabase.client!.from('lessons').select('*').order('created_at');
      
      const { data: qs } = await this.supabase.client!.from('questions').select('*');
      if (qs) {
        this.questions.set(qs.map(q => ({
          id: q.id,
          categoryId: q.category_id,
          text: q.statement,
          options: [q.option_a, q.option_b, q.option_c, q.option_d],
          correctIndex: ['A','B','C','D'].indexOf(q.correct_option),
          explanation: q.explanation
        })));
      }

      // 2. Load User Specific Data (only if authenticated)
      const user = this.auth.currentUser();
      const completedSet = new Set<string>();
      
      if (user) {
        const { data: prog } = await this.supabase.client!
          .from('user_progress')
          .select('lesson_id')
          .eq('user_id', user.id);
        
        prog?.forEach(p => completedSet.add(p.lesson_id));

        // Load History
        const { data: sims } = await this.supabase.client!
         .from('simulation_results')
         .select('*')
         .eq('user_id', user.id)
         .order('created_at', { ascending: false });
         
         if (sims) {
           this.simulationHistory.set(sims.map(s => ({
              id: s.id,
              date: new Date(s.created_at),
              score: s.score,
              total: s.total,
              answers: s.details
           })));
         }
      }

      // Update lessons with completion status
      this.userProgress.set(completedSet);
      if (less) {
        this.lessons.set(less.map(l => ({ ...l, completed: completedSet.has(l.id) })));
      }
    } catch (err) {
      console.error('Error loading real data', err);
    }
  }

  // --- Getters ---
  
  getCategoryById(id: string) { return this.categories().find(c => c.id === id); }
  getLessonsByCategory(catId: string) { return this.lessons().filter(l => l.categoryId === catId); }
  getLessonById(id: string) { return this.lessons().find(l => l.id === id); }

  async getRandomQuestions(count: number, categoryId?: string) {
    let pool = this.questions();
    if (categoryId) {
      pool = pool.filter(q => q.categoryId === categoryId);
    }
    // Simple Shuffle
    pool = JSON.parse(JSON.stringify(pool));
    return pool.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  isLessonCompleted(lessonId: string) { return this.userProgress().has(lessonId); }


  // --- CRUD Operations (Admin) ---

  async createCategory(cat: Omit<Category, 'id'>) {
    if (this.supabase.isConfigured()) {
      await this.supabase.client!.from('categories').insert(cat);
      await this.loadRealData();
    } else {
      const newCat = { ...cat, id: crypto.randomUUID() };
      this.categories.update(c => [...c, newCat]);
      localStorage.setItem('demo_categories', JSON.stringify(this.categories()));
    }
  }

  async deleteCategory(id: string) {
    if (this.supabase.isConfigured()) {
      await this.supabase.client!.from('categories').delete().eq('id', id);
      await this.loadRealData();
    } else {
      this.categories.update(c => c.filter(x => x.id !== id));
      localStorage.setItem('demo_categories', JSON.stringify(this.categories()));
    }
  }

  async createLesson(lesson: Omit<Lesson, 'id' | 'completed'>) {
    if (this.supabase.isConfigured()) {
      await this.supabase.client!.from('lessons').insert(lesson);
      await this.loadRealData();
    } else {
      const newLesson = { ...lesson, id: crypto.randomUUID(), completed: false };
      this.lessons.update(l => [...l, newLesson]);
      localStorage.setItem('demo_lessons', JSON.stringify(this.lessons()));
    }
  }

  async deleteLesson(id: string) {
    if (this.supabase.isConfigured()) {
      await this.supabase.client!.from('lessons').delete().eq('id', id);
      await this.loadRealData();
    } else {
      this.lessons.update(l => l.filter(x => x.id !== id));
      localStorage.setItem('demo_lessons', JSON.stringify(this.lessons()));
    }
  }

  async createQuestion(q: Omit<Question, 'id'>) {
    if (this.supabase.isConfigured()) {
      await this.supabase.client!.from('questions').insert({
        category_id: q.categoryId,
        statement: q.text,
        option_a: q.options[0],
        option_b: q.options[1],
        option_c: q.options[2],
        option_d: q.options[3],
        correct_option: ['A','B','C','D'][q.correctIndex],
        explanation: q.explanation
      });
      await this.loadRealData();
    } else {
      const newQ = { ...q, id: crypto.randomUUID() };
      this.questions.update(qs => [...qs, newQ]);
      localStorage.setItem('demo_questions', JSON.stringify(this.questions()));
    }
  }

  async deleteQuestion(id: string) {
    if (this.supabase.isConfigured()) {
      await this.supabase.client!.from('questions').delete().eq('id', id);
      await this.loadRealData();
    } else {
      this.questions.update(qs => qs.filter(x => x.id !== id));
      localStorage.setItem('demo_questions', JSON.stringify(this.questions()));
    }
  }

  async uploadFile(file: File, path: string): Promise<string> {
    if (this.supabase.isConfigured()) {
      const ext = file.name.split('.').pop();
      const fileName = `${path}/${crypto.randomUUID()}.${ext}`;
      const { data, error } = await this.supabase.client!.storage
        .from('content')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = this.supabase.client!.storage
        .from('content')
        .getPublicUrl(fileName);
        
      return publicUrl;
    } else {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(`https://picsum.photos/seed/${file.name}/400/300`);
        }, 800);
      });
    }
  }

  // --- Actions ---

  async toggleLessonCompletion(lessonId: string) {
    const current = new Set(this.userProgress());
    const isCompleted = current.has(lessonId);
    
    // Optimistic Update
    if (isCompleted) current.delete(lessonId);
    else current.add(lessonId);
    this.userProgress.set(new Set(current));
    
    this.lessons.update(ls => ls.map(l => l.id === lessonId ? { ...l, completed: !isCompleted } : l));

    if (this.supabase.isConfigured() && this.supabase.client) {
      const user = this.auth.currentUser();
      if (user) {
        if (!isCompleted) {
          await this.supabase.client.from('user_progress').insert({ user_id: user.id, lesson_id: lessonId });
        } else {
          await this.supabase.client.from('user_progress').delete().eq('user_id', user.id).eq('lesson_id', lessonId);
        }
      }
    } else {
      localStorage.setItem('aprovacnh_progress', JSON.stringify(Array.from(current)));
    }
  }

  async saveSimulation(result: SimulationResult) {
    this.simulationHistory.update(h => [result, ...h]);
    this.lastSimulationResult.set(result);

    if (this.supabase.isConfigured() && this.supabase.client) {
      const user = this.auth.currentUser();
      if (user) {
        await this.supabase.client.from('simulation_results').insert({
          user_id: user.id,
          score: result.score,
          total: result.total,
          details: result.answers,
          created_at: result.date.toISOString()
        });
      }
    } else {
      localStorage.setItem('aprovacnh_history', JSON.stringify(this.simulationHistory()));
    }
  }
}
