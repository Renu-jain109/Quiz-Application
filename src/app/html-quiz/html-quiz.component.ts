import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-html-quiz',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, Dialog, RouterLink],
  templateUrl: './html-quiz.component.html',
  styleUrl: './html-quiz.component.css'
})
export class HtmlQuizComponent implements OnInit {
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
      question: 'What does HTML stand for?',
      options: [
        'Hyper Trainer Marking Language',
        'Hyper Text Markup Language',
        'Hyperlinks and Text Markup Language',
        'Home Tool Markup Language'
      ],
      correctAnswer: 'Hyper Text Markup Language'
    }, {
      question: 'Which tag is used to create a hyperlink in HTML?',
      options: [
        '<link>',
        '<a>',
        '<href>',
        '<hlink>'
      ],
      correctAnswer: '<a>'
    }, {
      question: 'Which HTML tag is used to define an unordered list?',
      options: [
        '<ol>',
        '<ul>',
        '<li>',
        '<list>'
      ],
      correctAnswer: '<ul>'
    }, {
      question: 'What is the correct way to insert a background color in HTML?',
      options: [
        '<background color="blue">',
        '<body bg-color="blue">',
        '<body style="background-color:blue;">',
        '<bgcolor="blue">'
      ],
      correctAnswer: '<body style="background-color:blue;">'
    }, {
      question: 'Which attribute is used to open a link in a new tab?',
      options: [
        'target="_blank"',
        'new-window="true"',
        'open="new"',
        'window="new"'
      ],
      correctAnswer: 'target="_blank"'
    }, {
      question: 'Which of the following is the correct way to comment in HTML?',
      options: [
        '// This is a comment',
        '/* This is a comment */',
        '<!-- This is a comment -->',
        '** This is a comment **'
      ],
      correctAnswer: '<!-- This is a comment -->'
    }, {
      question: 'Which tag is used to embed an image in HTML?',
      options: [
        '<img>',
        '<image>',
        '<pic>',
        '<src>'
      ],
      correctAnswer: '<img>'
    }, {
      question: 'Which of the following is NOT a semantic HTML tag?',
      options: [
        '<article>',
        '<section>',
        '<div>',
        '<header>'
      ],
      correctAnswer: '<div>'
    }, {
      question: 'What is the default display property of a <div> element?',
      options: [
        'inline',
        'block',
        'inline-block',
        'flex'
      ],
      correctAnswer: 'block'
    }, {
      question: 'Which tag is used to define a table in HTML?',
      options: [
        '<table>',
        '<tbl>',
        '<tabel>',
        '<tab>'
      ],
      correctAnswer: '<table>'
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
