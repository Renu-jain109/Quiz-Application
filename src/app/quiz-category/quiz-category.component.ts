import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-quiz-category',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quiz-category.component.html',
  styleUrl: './quiz-category.component.css'
})
export class QuizCategoryComponent  {

}
