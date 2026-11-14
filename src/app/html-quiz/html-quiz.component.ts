import { Component } from '@angular/core';
import { QuizRunnerComponent } from '../quiz-runner/quiz-runner.component';

@Component({
  selector: 'app-html-quiz',
  standalone: true,
  imports: [QuizRunnerComponent],
  template: '<app-quiz-runner defaultTrackId="html" />',
})
export class HtmlQuizComponent {}
