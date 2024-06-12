import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizPlayingService } from '../../services/quiz-playing.service';
import { QuizService } from '../../services/quiz.service';
import { DoneQuizService } from '../../services/done-quiz.service';
import { AuthenticateService } from '../../services/authenticate.service';
import { SaveQuizService } from '../../services/save-quiz.service';
import { identifierName } from '@angular/compiler';
import { concatMap, of } from 'rxjs';
import { Quiz } from '../../Interface/quiz';
import { QuizQuestion } from '../../Interface/quiz-question';
import { QuizResponse } from '../../Interface/quiz-response';
import { SaveDoneQuiz } from '../../Interface/save-done-quiz';
import { DoneQuiz } from '../../Interface/done-quiz';
import { SaveQuizProgress } from '../../Interface/save-quiz-progress';
import { QuizProgress } from '../../Interface/quiz-progress';
import { User } from '../../Interface/user';

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
  flag: number = 0;
  points: number = 0;
  isQuizBeaten: boolean = false;
  isThereProgress: boolean = false;
  endOfQuiz: boolean = false;
  statusOfQuiz: boolean = false;

  timeLeft: number;
  timerInterval: any;

  storage: Storage = sessionStorage;
  email: string = JSON.parse(this.storage.getItem('user'));
  user: User = new User();

  selectedAnswerTrue: boolean = false;
  selectedAnswerId: string = '';
  whenMultipleCorrect: number = 0;
  alredyAnswered: number[] = [];

  isFiftyUsed: boolean = false;

  searchForMultipleCorrect: QuizResponse[] = [];

  passed: boolean = false;

  statsCorrectAnsw: number = 0;
  statsWrongAnsw: number = 0;
  statsSkippedAnsw: number = 0;

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
    this.getDoneQuizesAndMaybeLookForProgress();
    this.timer();
    this.getUser();
    console.log(this.isQuizBeaten);
  }

  getQuiz(id: number) {
    console.log('getkviz');

    this.quizService.getQuizById(id).subscribe((data) => {
      this.quiz = data;
      this.statusOfQuiz = data.status == 'Public' ? true : false;
      this.timeLeft = this.isThereProgress ? this.timeLeft : data.time * 60;
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

  onSkipQuestion() {
    this.statsSkippedAnsw++;
    this.onNextQuestion();
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
          this.statsCorrectAnsw++;
        } else {
          this.points =
            this.points - this.activeQuestion.minusPoints < 0
              ? 0
              : this.points - this.activeQuestion.minusPoints;

          this.statsWrongAnsw++;
        }
      }
    } else {
      if (!this.selectedAnswerTrue) {
        if (!res.correctAnswer) {
          this.selectedAnswerTrue = true;
          this.selectedAnswerId = res.id;
        }
        if (!this.alredyAnswered.includes(+res.id)) {
          this.alredyAnswered.push(+res.id);
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
    quizProgress.correctAns = this.statsCorrectAnsw;
    quizProgress.skippedAns = this.statsSkippedAnsw;
    quizProgress.wrongAns = this.statsWrongAnsw;

    saveQuizProgress.quizProgress = quizProgress;

    if (!this.isQuizBeaten) {
      this.saveQuizService
        .saveProgress(saveQuizProgress)
        .subscribe(() => console.log('Progres sacuvan'));
    }
  }

  getDoneQuizesAndMaybeLookForProgress() {
    const email = JSON.parse(this.storage.getItem('user'));
    const quizId: number = +this.route.snapshot.paramMap.get('id');

    this.authService
      .getUser(email)
      .pipe(
        concatMap((data) => this.doneQuizService.getDoneQuizes(+data.id)),
        concatMap((doneQuizes) => {
          this.isQuizBeaten = doneQuizes.some(
            (quiz) => quiz.quizIdForSearch === quizId
          );
          if (this.isQuizBeaten) {
            return of(null);
          } else {
            return this.authService
              .getUser(email)
              .pipe(
                concatMap((data) =>
                  this.quizPlayingService.searchForProgressWUserId(+data.id)
                )
              );
          }
        })
      )
      .subscribe((data) => {
        if (data) {
          console.log('progres');

          for (let res of data) {
            if (res.quizId == quizId) {
              this.points = res.points;
              this.isThereProgress = true;
              this.statsCorrectAnsw = res.correctAns;
              this.statsWrongAnsw = res.wrongAns;
              this.statsSkippedAnsw = res.skippedAns;
              this.flag = res.questionsAnswered;
              this.timeLeft = res.time;
              return;
            }
          }
        }
      });
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }
}
