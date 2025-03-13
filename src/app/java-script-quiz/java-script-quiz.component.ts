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
  selectedAnswer: string = ""; // Stores the selected answer by the user
  currentQuestion: number = 0; // Keeps track of the current question index
  isQuizCompleted: boolean = false; // Indicates if the quiz is completed
  isCorrectAnswer: boolean | null = null; // Stores whether the selected answer is correct or not
  countdown: number = 30; // Timer for each question
  countdownInterval: any; // Stores the interval reference for countdown
  totalQuestions: number = 10; // Total number of questions in the quiz
  countRightAnswers: number = 0; // Counts the number of correct answers
  countWrongAnswers: number = 0; // Counts the number of incorrect answers
  answered: boolean = false; // Checks if the current question has been answered
  displayResult: boolean = false; // To show the result popup
  isPassed: boolean = false; // To track pass/fail
  resultMessage: string = ""; // Stores the result message
  showNextQuestion: boolean = false; // Flag to show the next question


  ngOnInit(): void {
    this.startCountdown(); // Starts the countdown timer when the quiz start

  }

  // questions list
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

  //Function to select the answer
  selectAnswer(option: string) {
    if (!this.answered) {
      this.selectedAnswer = option; // Stores the selected answer only if the user hasn't answered yet
    }
  };


  checkAnswer() {
    if (this.selectedAnswer) {
      //It check whether the answer is correct or not
      this.isCorrectAnswer = this.selectedAnswer === this.questionsList[this.currentQuestion].correctAnswer;
      if (this.isCorrectAnswer) {
        this.countRightAnswers++; // Increases correct answer count
      } else {
        this.countWrongAnswers++; // Increases wrong answer count
      }
      this.answered = true; // Marks the question as answered
    }
  };


  // To go to the next question.
  goToNextQuestion() {
    if (this.currentQuestion < this.questionsList.length - 1) {
      this.currentQuestion++; // Move to the next question
      this.selectedAnswer = ""; // Reset selected answer
      this.isCorrectAnswer = null; // Reset correctness status
      this.answered = false; // Unlock the question for a new attempt
      this.startCountdown(); // Restart countdown for the next question
    } else {
      this.isQuizCompleted = true; // Marks quiz as completed
      clearInterval(this.countdownInterval); // Stops the countdown timer
      this.isPassed = this.countRightAnswers >= 7; // Checks if the user passed (minimum 7 correct answers)
      this.displayResult = true; // Shows the result popup
    }
  };


  startCountdown() {
    clearInterval(this.countdownInterval); // Stops any existing countdown
    this.countdown = 30; // Resets countdown to 30 seconds
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--; // Decrease timer every second
      } else {
        clearInterval(this.countdownInterval); // Stop countdown 
        if (!this.answered)
          this.countWrongAnswers++; // Increase incorrect answer count if user did not answer
        this.showNextQuestion = true; // Show "Next Question" button
      }
    }, 1000);
  };

  continueQuiz() {
    this.goToNextQuestion(); // Move to the next question
    this.showNextQuestion = false; // Hide the "Next Question" button
  }


  getAnswerClass(option: string) {
    if (!this.answered) {
      return ''; // No styling if the question is not answered yet
    }
    if (option === this.selectedAnswer && this.selectedAnswer === this.questionsList[this.currentQuestion].correctAnswer) {
      return 'correct-answer'; // Green color for correct answer
    } else if (option === this.selectedAnswer && this.selectedAnswer !== this.questionsList[this.currentQuestion].correctAnswer) {
      return 'wrong-answer '; // Red color for wrong answer
    }
    return ''; // Default (no styling)
  };


  closePopup() {
    this.displayResult = false; // Close the result popup
  };


  restartQuiz() {
    this.selectedAnswer = "";
    this.currentQuestion = 0;
    this.isQuizCompleted = false;
    this.isCorrectAnswer = null;
    this.countRightAnswers = 0; // Reset correct answers count
    this.countWrongAnswers = 0; // Reset wrong answers count
    this.answered = false;
    this.displayResult = false;
    this.isPassed = false;
    this.startCountdown(); // Restart countdown
  };
}
