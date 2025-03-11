import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-css-quiz',
  standalone: true,
  imports: [CommonModule, ButtonModule,ToastModule, Dialog,RouterLink],
  templateUrl: './css-quiz.component.html',
  styleUrl: './css-quiz.component.css'
})
export class CssQuizComponent implements OnInit {
  selectedAnswer: string = "";
  currentQuestion: number = 0;
  isQuizCompleted: boolean = false;
  isCorrectAnswer: boolean | null = null;
  countdown: number = 3; //Timer ke liye variable
  countdownInterval: any;
  totalQuestions: number = 10;
  countRightAnswers: number = 0;
  countWrongAnswers: number = 0;
  answered: boolean = false;
  displayResult: boolean = false;
  isPassed: boolean = false;
  resultMessage : string ="";
  doQuestion : boolean = false;


  ngOnInit(): void {
    this.startCountdown();
    

  }

  questionsList = [
    {
      question: 'What does CSS stand for?',
      options: [
        'Creative Style Sheets',
        'Cascading Style Sheets',
        'Computer Style Sheets',
        'Colorful Style Sheets'
      ],
      correctAnswer: 'Cascading Style Sheets'
    }, {
      question: 'Which property is used to change text color in CSS?',
      options: [
        'font-color',
        'color',
        'text-color',
        'background-color'
      ],
      correctAnswer: 'color'
    }, {
      question: 'Which property is used to set the background color?',
      options: [
        'background',
        'bgcolor',
        'background-color',
        'color-bg'
      ],
      correctAnswer: 'background-color'
    }, {
      question: 'Which unit is NOT relative in CSS?',
      options: [
        'em',
        'px',
        'rem',
        '%'
      ],
      correctAnswer: 'px'
    }, {
      question: 'What is the correct syntax to make all paragraphs center-aligned?',
      options: [
        'p { align: center; }',
        'p { text-align: center; }',
        'p { center: text; }',
        'p { text-center: true; }'
      ],
      correctAnswer: 'p { text-align: center; }'
    }, {
      question: 'Which property is used to make text bold in CSS?',
      options: [
        'bold-text',
        'font-bold',
        'font-weight',
        'bold-style'
      ],
      correctAnswer: 'font-weight'
    }, {
      question: 'Which CSS property controls the spacing between elements?',
      options: [
        'spacing',
        'margin',
        'padding',
        'border-spacing'
      ],
      correctAnswer: 'margin'
    }, {
      question: 'Which CSS property is used to make an element flex container?',
      options: [
        'display: block;',
        'display: flex;',
        'flex-container: true;',
        'layout: flex;'
      ],
      correctAnswer: 'display: flex;'
    }, {
      question: 'Which value of position makes an element stay in place while scrolling?',
      options: [
        'relative',
        'absolute',
        'fixed',
        'sticky'
      ],
      correctAnswer: 'fixed'
    }, {
      question: 'Which pseudo-class is used to style an element when hovered?',
      options: [
        ':click',
        ':hover',
        ':active',
        ':selected'
      ],
      correctAnswer: ':hover'
    }
  ];

  // Answer select karne ke liye function
  selectAnswer(option: string) {
    if (!this.answered) {
      this.selectedAnswer = option;
    }
  };

  submit() {
  //   if (this.countRightAnswers === 0 && this.countWrongAnswers === 0) {
  //     // this.resultMessage = "Time Over! You didn't attempt any question.";
  //     console.log('a=',this.countRightAnswers);
  //     console.log('b=',this.countWrongAnswers);
      
  //     this.doQuestion = true;
  // } 

    if (this.selectedAnswer) {
      this.isCorrectAnswer = this.selectedAnswer === this.questionsList[this.currentQuestion].correctAnswer;
      if(this.isCorrectAnswer){
        this.countRightAnswers++; // Correct answer hone par count increase hoga

      }else{
        this.countWrongAnswers++; // Wrong answer hone par count decrease hoga
      }
      this.answered = true;
    }
  };


  // To go to the next question.
  nextQuestion() {
    if (this.currentQuestion < this.questionsList.length - 1) {
      this.currentQuestion++;
      this.selectedAnswer = "";
      this.isCorrectAnswer = null;
      this.answered = false // New question ke liye answer unlock
      this.startCountdown(); // Restart countdown.

    } else {
      this.isQuizCompleted = true;
      clearInterval(this.countdownInterval); // Stop timer when quiz ends
      this.isPassed = this.countRightAnswers >= 7; // Pass if score is 7 or more

    // else {
    //     this.resultMessage = `Your Score: ${this.countRightAnswers}/${this.totalQuestions}`;
    // }
  
      this.displayResult = true;// Show result popup
    }
  };



  startCountdown() {
    clearInterval(this.countdownInterval); // Pehle existing timer ko stop karo
    this.countdown = 3; // Restart countdown from 30 seconds
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
  
      } else {
        clearInterval(this.countdownInterval);
        if (!this.answered)
          this.countWrongAnswers++; // Agar user answer na de to wrong count kare
          this.nextQuestion();  // Go to next question when timer ends
      }
    
    }, 3000);
  };


  getAnswerClass(option: string) {
    if (!this.answered) {
      return '';
    }
    if (option === this.selectedAnswer && this.selectedAnswer === this.questionsList[this.currentQuestion].correctAnswer) {
      return 'correct-answer'; // Green color for correct answer
    } else if (option === this.selectedAnswer && this.selectedAnswer !== this.questionsList[this.currentQuestion].correctAnswer) {
      return 'wrong-answer '; // Red color for wrong answer
    }
    

    return '';
    
  };

  closePopup() {
    this.displayResult = false; // Close the result popup
  };

  restartQuiz() {
    this.selectedAnswer = "";
    this.currentQuestion = 0;
    this.isQuizCompleted = false;
    this.isCorrectAnswer = null;
    this.countRightAnswers = 0; // Right answers ko reset karna
    this.countWrongAnswers = 0;  // Wrong answers ko reset karna
    this.answered = false;
    this.displayResult = false;
    this.isPassed = false;
    this.startCountdown(); // Restart countdown

  };

}
