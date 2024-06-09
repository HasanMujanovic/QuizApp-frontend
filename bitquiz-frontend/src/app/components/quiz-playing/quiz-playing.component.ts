import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizPlayingService } from '../../services/quiz-playing.service';
import { Quiz } from '../../common/quiz';
import { QuizService } from '../../services/quiz.service';
import { QuizQuestion } from '../../common/quiz-question';
import { QuizResponse } from '../../common/quiz-response';
import { DoneQuizService } from '../../services/done-quiz.service';
import { User } from '../../common/user';
import { AuthenticateService } from '../../services/authenticate.service';
import { SaveDoneQuiz } from '../../common/save-done-quiz';
import { DoneQuiz } from '../../common/done-quiz';
import { SaveQuizProgress } from '../../common/save-quiz-progress';
import { QuizProgress } from '../../common/quiz-progress';
import { SaveQuizService } from '../../services/save-quiz.service';
import { identifierName } from '@angular/compiler';

@Component({
  selector: 'app-quiz-playing',
  templateUrl: './quiz-playing.component.html',
  styleUrl: './quiz-playing.component.css',
})
export class QuizPlayingComponent implements OnInit, OnDestroy {
  quiz: Quiz;
  questions: QuizQuestion[] = [];
  activeQuestion: QuizQuestion;
  activeResponse: QuizResponse[] = [];
  flag: number = this.quizPlayingService.isThereProgress
    ? this.quizPlayingService.currentQuestion
    : 0;
  points: number = this.quizPlayingService.isThereProgress
    ? this.quizPlayingService.points
    : 0;
  isQuizBeaten = this.quizPlayingService.isQuizDone;
  endOfQuiz: boolean = false;

  timeLeft: number;
  timerInterval: any;

  storage: Storage = sessionStorage;
  email: string = JSON.parse(this.storage.getItem('user'));
  user: User = new User();

  selectedAnswerTrue: boolean = false;
  selectedAnswerId: string = '';
  whenMultipleCorrect: number = 0;

  isFiftyUsed: boolean = false;

  searchForMultipleCorrect: QuizResponse[] = [];

  passed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private quizPlayingService: QuizPlayingService,
    private quizService: QuizService,
    private doneQuizService: DoneQuizService,
    private authService: AuthenticateService,
    private saveQuizService: SaveQuizService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const kvizId: number = +params.get('id');
      this.getQuiz(kvizId);
      this.getPitanja(kvizId);
    });
    this.timer();
    this.getUser();
    console.log(this.isQuizBeaten);
  }

  getQuiz(id: number) {
    this.quizService.getOneQuiz(id).subscribe((data) => {
      this.quiz = data;
      this.timeLeft = this.quizPlayingService.isThereProgress
        ? this.quizPlayingService.timeLeft
        : data.time * 60;
      console.log(this.timeLeft);
    });
  }
  getPitanja(id: number) {
    this.quizPlayingService.getQuestions(id).subscribe((data) => {
      this.questions = data;
      this.activeQuestion = this.questions[this.flag];
      this.startingQuestion(+this.activeQuestion.id);
    });
  }
  getUser() {
    this.authService
      .getUser(this.email)
      .subscribe((data) => (this.user = data));
  }

  startingQuestion(questionId: number) {
    this.quizPlayingService.getResponses(questionId).subscribe((data) => {
      this.activeResponse = data;
      this.searchForMultipleCorrect = this.activeResponse.filter(
        (res) => res.correctAnswer
      );
    });
  }

  onNextQuestion() {
    if (this.flag < this.questions.length - 1) {
      this.flag++;
      this.activeQuestion = this.questions[this.flag];
      this.startingQuestion(+this.activeQuestion.id);
    } else {
      this.endOfQuiz = true;
      console.log('Kviz je završen');
    }
    this.selectedAnswerTrue = false;
  }

  checkAnswer(res: QuizResponse) {
    const correctAnswers = this.searchForMultipleCorrect;
    if (correctAnswers.length == 1) {
      if (!this.selectedAnswerTrue) {
        this.selectedAnswerId = res.id;
        this.selectedAnswerTrue = true;

        if (res.correctAnswer) {
          this.points += this.activeQuestion.points;
        }
      }
    } else {
      if (!this.selectedAnswerTrue) {
        if (!res.correctAnswer) {
          this.selectedAnswerTrue = true;
          this.selectedAnswerId = res.id;
        } else {
          this.whenMultipleCorrect++;
        }
        if (this.whenMultipleCorrect >= correctAnswers.length) {
          this.selectedAnswerTrue = true;
          this.selectedAnswerId = res.id;
          this.points += this.activeQuestion.points;
        }
      }
    }
    this.passed = this.points > this.quiz.points / 2 ? true : false;
  }

  fiftyFifty() {
    const correctAnswer = this.activeResponse.find((res) => res.correctAnswer);

    const wrongAnswers = this.activeResponse
      .filter((res) => !res.correctAnswer)
      .slice(0, Math.ceil((this.activeResponse.length - 1) / 2));

    this.activeResponse = [correctAnswer, ...wrongAnswers];
    this.isFiftyUsed = true;
  }
  isFiftyFiftyDisabled(): boolean {
    const correctAnswers = this.searchForMultipleCorrect;
    if (
      correctAnswers.length >= 2 ||
      this.activeResponse.length <= 2 ||
      this.selectedAnswerTrue ||
      this.isFiftyUsed
    ) {
      return true;
    }
    return false;
  }

  timer() {
    const interval = 1000;

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0 && !this.endOfQuiz) {
        this.timeLeft--;
        console.log(this.timeLeft);
      } else {
        clearInterval(this.timerInterval);
        this.endOfQuiz = true;
        console.log('Vreme je isteklo!');
      }
    }, interval);
  }

  saveQuiz() {
    let saveDoneQuiz = new SaveDoneQuiz();
    let doneQuiz = new DoneQuiz();

    saveDoneQuiz.user = this.user;
    saveDoneQuiz.quiz = this.quiz;

    doneQuiz.pointsWon = this.points;
    doneQuiz.timeLeft = this.timeLeft;
    doneQuiz.quizIdForSearch = +this.quiz.id;
    doneQuiz.userIdForSearch = +this.user.id;
    doneQuiz.username = this.user.name;

    saveDoneQuiz.doneQuiz = doneQuiz;

    if (!this.isQuizBeaten) {
      this.doneQuizService
        .saveQuiz(saveDoneQuiz)
        .subscribe(() => console.log('sacuvalo se'));
    }
  }

  saveProgress() {
    let saveQuizProgress = new SaveQuizProgress();
    let quizProgress = new QuizProgress();

    saveQuizProgress.user = this.user;

    quizProgress.time = this.timeLeft;
    quizProgress.points = this.points;
    quizProgress.questionsAnswered = this.flag;
    quizProgress.quizId = +this.quiz.id;

    saveQuizProgress.quizProgress = quizProgress;

    if (!this.isQuizBeaten) {
      this.saveQuizService
        .saveProgress(saveQuizProgress)
        .subscribe(() => console.log('Progres sacuvan'));
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }
}
