import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuizCategoryComponent } from './quiz-category/quiz-category.component';
import { HtmlQuizComponent } from './html-quiz/html-quiz.component';
import { QuizInstructionComponent } from './quiz-instruction/quiz-instruction.component';
import { CssQuizComponent } from './css-quiz/css-quiz.component';
import { JavaScriptQuizComponent } from './java-script-quiz/java-script-quiz.component';

export const routes: Routes = [
    {
        path:'',
        component:HomeComponent
    },
    {
        path:'home',
        component:HomeComponent
    },
    {
        path:'quiz/category',
        component:QuizCategoryComponent
    },
    {
        path:'quiz/instructions',
        component:QuizInstructionComponent
    },
    {
        path:'html/quiz/questions',
        component:HtmlQuizComponent
    },
    {
        path:'css/quiz/questions',
        component:CssQuizComponent
    },
    {
        path:'java-script/quiz/questions',
        component:JavaScriptQuizComponent
    },
    {
        path:'**',
        redirectTo:'HomeComponent'
    }
];
