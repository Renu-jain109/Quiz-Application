import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'quiz/category',
    loadComponent: () =>
      import('./quiz-category/quiz-category.component').then(
        (m) => m.QuizCategoryComponent
      ),
  },
  {
    path: 'quiz/instructions',
    loadComponent: () =>
      import('./quiz-instruction/quiz-instruction.component').then(
        (m) => m.QuizInstructionComponent
      ),
  },
  {
    path: 'quiz/drill',
    loadComponent: () =>
      import('./quiz-runner/quiz-runner.component').then(
        (m) => m.QuizRunnerComponent
      ),
    data: { drillMode: true },
  },
  {
    path: 'quiz/run/:trackId',
    loadComponent: () =>
      import('./quiz-runner/quiz-runner.component').then(
        (m) => m.QuizRunnerComponent
      ),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./history/history.component').then((m) => m.HistoryComponent),
  },
  {
    path: 'html/quiz/questions',
    loadComponent: () =>
      import('./html-quiz/html-quiz.component').then((m) => m.HtmlQuizComponent),
  },
  {
    path: 'css/quiz/questions',
    loadComponent: () =>
      import('./css-quiz/css-quiz.component').then((m) => m.CssQuizComponent),
  },
  {
    path: 'java-script/quiz/questions',
    loadComponent: () =>
      import('./java-script-quiz/java-script-quiz.component').then(
        (m) => m.JavaScriptQuizComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
