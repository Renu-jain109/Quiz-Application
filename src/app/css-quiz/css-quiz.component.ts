import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-css-quiz',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule, Dialog, RouterLink],
  templateUrl: './css-quiz.component.html',
  styleUrl: './css-quiz.component.css'
})
export class CssQuizComponent implements OnInit {
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
