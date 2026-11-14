import { Component } from '@angular/core';
import { QuizRunnerComponent } from '../quiz-runner/quiz-runner.component';

@Component({
  selector: 'app-css-quiz',
  standalone: true,
  imports: [QuizRunnerComponent],
  template: '<app-quiz-runner defaultTrackId="css" />',
})
export class CssQuizComponent {}
