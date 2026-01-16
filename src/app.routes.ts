import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { RecoverComponent } from './pages/auth/recover.component';
import { AppLayoutComponent } from './components/layout/app-layout.component';
import { DashboardComponent } from './pages/app/dashboard.component';
import { TheoryComponent } from './pages/app/theory.component';
import { CategoryComponent } from './pages/app/category.component';
import { LessonComponent } from './pages/app/lesson.component';
import { SimulationsComponent } from './pages/app/simulations.component';
import { SimulationRunnerComponent } from './pages/app/simulation-runner.component';
import { SimulationResultComponent } from './pages/app/simulation-result.component';
import { ProgressComponent } from './pages/app/progress.component';
import { AccountComponent } from './pages/app/account.component';
import { OnboardingComponent } from './pages/auth/onboarding.component';
import { authGuard, adminGuard } from './guards/auth.guard';

// Admin
import { AdminLayoutComponent } from './pages/admin/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminCategoriesComponent } from './pages/admin/admin-categories.component';
import { AdminLessonsComponent } from './pages/admin/admin-lessons.component';
import { AdminQuestionsComponent } from './pages/admin/admin-questions.component';
import { AdminImportComponent } from './pages/admin/admin-import.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recover', component: RecoverComponent },
  { 
    path: 'app', 
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'onboarding', component: OnboardingComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'teoria', component: TheoryComponent },
      { path: 'categoria/:id', component: CategoryComponent },
      { path: 'aula/:id', component: LessonComponent },
      { path: 'simulados', component: SimulationsComponent },
      { path: 'simulado/fazer', component: SimulationRunnerComponent },
      { path: 'simulado/resultado', component: SimulationResultComponent },
      { path: 'progresso', component: ProgressComponent },
      { path: 'conta', component: AccountComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { 
    path: 'admin', 
    component: AdminLayoutComponent, 
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'categorias', component: AdminCategoriesComponent },
      { path: 'aulas', component: AdminLessonsComponent },
      { path: 'questoes', component: AdminQuestionsComponent },
      { path: 'importar', component: AdminImportComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
