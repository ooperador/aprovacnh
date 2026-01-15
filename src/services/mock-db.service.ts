import { Injectable, signal, computed } from '@angular/core';

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
  completed: boolean;
}

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  options: string[];
  correctIndex: number;
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
export class MockDbService {
  // Static Content
  categories: Category[] = [
    { id: 'leg', title: 'Legislação de Trânsito', color: 'bg-blue-600', image: 'https://picsum.photos/id/1/200/120' },
    { id: 'dir', title: 'Direção Defensiva', color: 'bg-green-600', image: 'https://picsum.photos/id/2/200/120' },
    { id: 'pri', title: 'Primeiros Socorros', color: 'bg-red-600', image: 'https://picsum.photos/id/3/200/120' },
    { id: 'amb', title: 'Meio Ambiente', color: 'bg-yellow-600', image: 'https://picsum.photos/id/4/200/120' },
    { id: 'mec', title: 'Mecânica Básica', color: 'bg-gray-600', image: 'https://picsum.photos/id/5/200/120' },
  ];

  lessons: Lesson[] = [
    { id: 'l1', categoryId: 'leg', title: 'Processo de Habilitação', duration: '12 min', thumbnail: 'https://picsum.photos/id/10/300/180', completed: false },
    { id: 'l2', categoryId: 'leg', title: 'Infrações e Penalidades', duration: '15 min', thumbnail: 'https://picsum.photos/id/11/300/180', completed: false },
    { id: 'l3', categoryId: 'leg', title: 'Sinalização Viária', duration: '20 min', thumbnail: 'https://picsum.photos/id/12/300/180', completed: false },
    { id: 'l4', categoryId: 'dir', title: 'Elementos da Direção Defensiva', duration: '10 min', thumbnail: 'https://picsum.photos/id/13/300/180', completed: false },
    { id: 'l5', categoryId: 'dir', title: 'Condições Adversas', duration: '18 min', thumbnail: 'https://picsum.photos/id/14/300/180', completed: false },
    { id: 'l6', categoryId: 'pri', title: 'Sinalização do Local', duration: '08 min', thumbnail: 'https://picsum.photos/id/15/300/180', completed: false },
    { id: 'l7', categoryId: 'amb', title: 'Poluição Veicular', duration: '14 min', thumbnail: 'https://picsum.photos/id/16/300/180', completed: false },
    { id: 'l8', categoryId: 'mec', title: 'Funcionamento do Motor', duration: '22 min', thumbnail: 'https://picsum.photos/id/17/300/180', completed: false },
  ];

  questions: Question[] = [
    { id: 'q1', categoryId: 'leg', text: 'A CNH tem validade de quantos anos para condutores com menos de 50 anos?', options: ['5 anos', '10 anos', '3 anos', 'Indeterminada'], correctIndex: 1, explanation: 'Para condutores com menos de 50 anos, a validade da CNH é de 10 anos.' },
    { id: 'q2', categoryId: 'dir', text: 'O que é direção defensiva?', options: ['Dirigir devagar', 'Dirigir com medo', 'Dirigir de modo a evitar acidentes', 'Dirigir apenas em dias de sol'], correctIndex: 2, explanation: 'Direção defensiva é o conjunto de medidas para prevenir acidentes.' },
    { id: 'q3', categoryId: 'pri', text: 'Em caso de acidente com vítima, o que NÃO fazer?', options: ['Sinalizar o local', 'Chamar o resgate', 'Movimentar a vítima', 'Manter a calma'], correctIndex: 2, explanation: 'Nunca se deve movimentar a vítima, pois isso pode agravar lesões na coluna.' },
    { id: 'q4', categoryId: 'amb', text: 'O catalisador serve para:', options: ['Aumentar a potência', 'Reduzir ruídos', 'Reduzir a emissão de gases', 'Resfriar o motor'], correctIndex: 2, explanation: 'O catalisador converte gases tóxicos em gases inofensivos.' },
    { id: 'q5', categoryId: 'leg', text: 'Qual a pontuação para suspensão da CNH no período de 12 meses (sem infrações gravíssimas)?', options: ['20 pontos', '30 pontos', '40 pontos', '50 pontos'], correctIndex: 2, explanation: 'Sem infração gravíssima, o limite é de 40 pontos.' }
  ];

  // State
  userProgress = signal<Set<string>>(new Set()); // Completed lesson IDs
  simulationHistory = signal<SimulationResult[]>([]);
  
  // Last simulation result (temp state for result page)
  lastSimulationResult = signal<SimulationResult | null>(null);

  constructor() {
    this.loadFromStorage();
  }

  getLessonsByCategory(catId: string) {
    return this.lessons.filter(l => l.categoryId === catId);
  }

  getLessonById(id: string) {
    return this.lessons.find(l => l.id === id);
  }

  getCategoryById(id: string) {
    return this.categories.find(c => c.id === id);
  }

  getRandomQuestions(count: number, categoryId?: string) {
    let pool = this.questions;
    if (categoryId) {
      pool = pool.filter(q => q.categoryId === categoryId);
    }
    // Duplicate pool to fake having enough questions for the demo if needed
    if (pool.length < count) {
      const multiplier = Math.ceil(count / pool.length);
      let newPool: Question[] = [];
      for(let i=0; i<multiplier; i++) {
        newPool = [...newPool, ...pool.map(q => ({...q, id: q.id + '_copy_' + i}))];
      }
      pool = newPool;
    }
    
    // Shuffle
    return pool.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  toggleLessonCompletion(lessonId: string) {
    const current = new Set(this.userProgress());
    if (current.has(lessonId)) {
      current.delete(lessonId);
    } else {
      current.add(lessonId);
    }
    this.userProgress.set(current);
    this.saveToStorage();
  }

  isLessonCompleted(lessonId: string) {
    return this.userProgress().has(lessonId);
  }

  saveSimulation(result: SimulationResult) {
    this.simulationHistory.update(h => [result, ...h]);
    this.lastSimulationResult.set(result);
    this.saveToStorage();
  }

  private loadFromStorage() {
    const progress = localStorage.getItem('aprovacnh_progress');
    const history = localStorage.getItem('aprovacnh_history');

    if (progress) {
      this.userProgress.set(new Set(JSON.parse(progress)));
    }
    if (history) {
      // Restore dates
      const parsed = JSON.parse(history);
      parsed.forEach((r: any) => r.date = new Date(r.date));
      this.simulationHistory.set(parsed);
    }
  }

  private saveToStorage() {
    localStorage.setItem('aprovacnh_progress', JSON.stringify(Array.from(this.userProgress())));
    localStorage.setItem('aprovacnh_history', JSON.stringify(this.simulationHistory()));
  }

  updateProfile(data: any) {
    // Persist user profile extension
    const current = JSON.parse(localStorage.getItem('demo_user') || '{}');
    const updated = { ...current, ...data };
    localStorage.setItem('demo_user', JSON.stringify(updated));
  }
}
