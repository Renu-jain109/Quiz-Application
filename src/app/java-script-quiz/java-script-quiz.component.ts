import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-java-script-quiz',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, Dialog, RouterLink],
  templateUrl: './java-script-quiz.component.html',
  styleUrl: './java-script-quiz.component.css'
})
export class JavaScriptQuizComponent implements OnInit {
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
      question: 'Which of the following is used to declare a variable in JavaScript?',
      options: [
        'let',
        'const',
        'var',
        'All of the above'
      ],
      correctAnswer: 'All of the above'
    }, {
      question: 'What is the correct way to check if a variable x is null in JavaScript?',
      options: [
        'if (x == null)',
        'if (x === null)',
        'if (typeof x === "null")',
        'if (x = null)'
      ],
      correctAnswer: 'if (x === null)'
    }, {
      question: 'Which event is fired when a user presses a key on the keyboard?',
      options: [
        'onpress',
        'onkeydown',
        'onclick',
        'onkeypress'
      ],
      correctAnswer: 'onkeydown'
    }, {
      question: 'Which JavaScript function is used to convert a string into an integer?',
      options: [
        'parseInt()',
        'toInteger()',
        'parseFloat()',
        'NumberInt()'
      ],
      correctAnswer: 'parseInt()'
    }, {
      question: 'Which method is used to remove the last element from an array?',
      options: [
        'array.pop()',
        'array.shift()',
        'array.splice(-1)',
        'array.deleteLast()'
      ],
      correctAnswer: 'array.pop()'
    }, {
      question: 'What will console.log(2 + "2") output?',
      options: [
        '4',
        '"22"',
        'NaN',
        'Error'
      ],
      correctAnswer: '"22"'
    }, {
      question: 'How do you check if a key exists in a JavaScript object?',
      options: [
        'obj.includes("key")',
        '"key" in obj',
        'obj.has("key")',
        'obj.contains("key")'
      ],
      correctAnswer: '"key" in obj'
    }, {
      question: 'Which of the following is NOT a valid way to define an arrow function in JavaScript?',
      options: [
        'const myFunc = () => {};',
        'const myFunc = (a, b) => a + b;',
        'const myFunc = function => {};',
        'const myFunc = () => { return 5; }'
      ],
      correctAnswer: 'const myFunc = function => {};'
    }, {
      question: 'Which function is used to execute a function after a specified time in JavaScript?',
      options: [
        'setTimeout()',
        'setInterval()',
        'delay()',
        'setTime()'
      ],
      correctAnswer: 'setTimeout()'
    }, {
      question: 'What will console.log(1 == "1") and console.log(1 === "1") output?',
      options: [
        'true false',
        'false true',
        'true true',
        'false false'
      ],
      correctAnswer: 'true false'
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



