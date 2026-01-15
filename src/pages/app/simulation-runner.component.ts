import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService, Question } from '../../services/content.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-simulation-runner',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="min-h-screen bg-bgMain flex flex-col">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button (click)="quit()" class="text-gray-500 hover:text-red-600 text-sm font-medium">
          ✕ Sair
        </button>
        <div class="text-sm font-bold text-gray-700">
          Questão {{ currentIdx() + 1 }} <span class="text-gray-400 font-normal">de {{ questions().length }}</span>
        </div>
        <div class="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
          --:--
        </div>
      </div>

      <!-- Question Area -->
      <div class="flex-1 max-w-3xl w-full mx-auto px-4 py-6 md:py-10 flex flex-col">
        @if (currentQuestion(); as q) {
           <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
             <span class="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">
               {{ getCategoryTitle(q.categoryId) }}
             </span>
             <h2 class="text-lg md:text-xl font-medium text-gray-900 leading-relaxed mb-6">
               {{ q.text }}
             </h2>

             <div class="space-y-3">
               @for (option of q.options; track $index) {
                 <button 
                   (click)="selectOption($index)" 
                   [disabled]="selectedOption() !== null"
                   class="w-full text-left p-4 rounded-xl border-2 transition-all relative"
                   [ngClass]="getOptionClass($index)"
                 >
                   <div class="flex items-start gap-3">
                     <span class="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-sm font-bold">
                       {{ ['A', 'B', 'C', 'D'][$index] }}
                     </span>
                     <span class="text-sm md:text-base">{{ option }}</span>
                   </div>
                   
                   <!-- Feedback Icons -->
                   @if (selectedOption() !== null) {
                     @if ($index === q.correctIndex) {
                       <div class="absolute right-4 top-1/2 -translate-y-1/2 text-green-600">
                         <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                       </div>
                     }
                     @if (selectedOption() === $index && $index !== q.correctIndex) {
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 text-red-600">
                          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                     }
                   }
                 </button>
               }
             </div>
           </div>

           <!-- Feedback / Actions -->
           @if (selectedOption() !== null) {
             <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-24 md:mb-6 animate-fade-in">
               <h3 class="font-bold text-blue-900 mb-1">Explicação:</h3>
               <p class="text-blue-800 text-sm">{{ q.explanation }}</p>
             </div>
           }

           <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:relative md:bg-transparent md:border-0 md:p-0 flex justify-end z-10">
             <button 
               (click)="next()" 
               [disabled]="selectedOption() === null"
               class="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-transform active:scale-95">
               {{ isLast() ? 'Finalizar' : 'Próxima' }}
             </button>
           </div>
        }
      </div>
    </div>
  `
})
export class SimulationRunnerComponent implements OnInit {
  db = inject(ContentService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  questions = signal<Question[]>([]);
  currentIdx = signal(0);
  selectedOption = signal<number | null>(null);
  
  answers = signal<{questionId: string, correct: boolean}[]>([]);

  currentQuestion = computed(() => this.questions()[this.currentIdx()]);
  isLast = computed(() => this.currentIdx() === this.questions().length - 1);

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const mode = params['mode'] || 'full';
      const catId = params['cat'];
      
      const count = mode === 'full' ? 30 : 5;
      const questions = await this.db.getRandomQuestions(count, catId);
      this.questions.set(questions);
    });
  }

  getCategoryTitle(id: string) {
    return this.db.getCategoryById(id)?.title || 'Geral';
  }

  selectOption(index: number) {
    if (this.selectedOption() !== null) return;
    this.selectedOption.set(index);
    
    const q = this.currentQuestion();
    const isCorrect = index === q.correctIndex;
    
    this.answers.update(curr => [...curr, { questionId: q.id, correct: isCorrect }]);
  }

  getOptionClass(index: number) {
    const selected = this.selectedOption();
    const correct = this.currentQuestion()?.correctIndex;

    if (selected === null) {
      return 'border-gray-200 hover:border-primary/50 text-gray-700 bg-white';
    }

    if (index === correct) {
      return 'border-green-500 bg-green-50 text-green-900 font-medium';
    }

    if (selected === index && index !== correct) {
      return 'border-red-500 bg-red-50 text-red-900';
    }

    return 'border-gray-100 text-gray-400 opacity-60';
  }

  next() {
    if (this.isLast()) {
      this.finish();
    } else {
      this.currentIdx.update(i => i + 1);
      this.selectedOption.set(null);
      window.scrollTo(0,0);
    }
  }

  async finish() {
    const total = this.questions().length;
    const score = this.answers().filter(a => a.correct).length;
    
    const result = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      score,
      total,
      answers: this.answers()
    };
    
    await this.db.saveSimulation(result);
    this.router.navigate(['/app/simulado/resultado']);
  }

  quit() {
    if(confirm('Tem certeza que deseja sair? Seu progresso será perdido.')) {
      this.router.navigate(['/app/simulados']);
    }
  }
}
