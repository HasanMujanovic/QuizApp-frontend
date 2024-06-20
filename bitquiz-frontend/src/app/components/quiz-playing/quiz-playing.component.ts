import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizPlayingService } from '../../services/quiz-playing.service';
import { QuizService } from '../../services/quiz.service';
import { DoneQuizService } from '../../services/done-quiz.service';
import { AuthenticateService } from '../../services/user.service';
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quiz-playing',
  templateUrl: './quiz-playing.component.html',
  styleUrl: './quiz-playing.component.css',
})
export class QuizPlayingComponent implements OnInit, OnDestroy {
  quiz: Quiz;
  admin: User;
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
  user: User;

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

  liked: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private quizPlayingService: QuizPlayingService,
    private quizService: QuizService,
    private doneQuizService: DoneQuizService,
    private authService: AuthenticateService,
    private saveQuizService: SaveQuizService,
    private router: Router
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

    this.quizService
      .getQuizById(id)
      .pipe(
        concatMap((data) => {
          this.quiz = data;
          this.statusOfQuiz = data.status == 'Public' ? true : false;
          this.timeLeft = this.isThereProgress ? this.timeLeft : data.time * 60;
          console.log(this.timeLeft);
          return this.quizService.getAdminOfQuiz(+data.id);
        })
      )
      .subscribe((data) => {
        this.admin = data;
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
      this.isFiftyUsed = false;
    } else {
      this.endOfQuiz = true;
      this.saveQuiz();
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
          setTimeout(() => {
            this.onNextQuestion();
          }, 1000);
        } else {
          this.points =
            this.points - this.activeQuestion.minusPoints < 0
              ? 0
              : this.points - this.activeQuestion.minusPoints;

          this.statsWrongAnsw++;
          setTimeout(() => {
            this.onNextQuestion();
          }, 1000);
        }
      }
    } else {
      if (!this.selectedAnswerTrue) {
        if (!res.correctAnswer) {
          this.selectedAnswerTrue = true;
          this.selectedAnswerId = res.id;
          this.points =
            this.points - this.activeQuestion.minusPoints < 0
              ? 0
              : this.points - this.activeQuestion.minusPoints;

          setTimeout(() => {
            this.onNextQuestion();
          }, 1000);
        } else if (!this.alredyAnswered.includes(+res.id)) {
          this.alredyAnswered.push(+res.id);
          this.whenMultipleCorrect++;
        }
        if (this.whenMultipleCorrect >= correctAnswers.length) {
          this.selectedAnswerTrue = true;
          this.selectedAnswerId = res.id;
          this.points += this.activeQuestion.points;
          setTimeout(() => {
            this.onNextQuestion();
          }, 1000);
        }
      }
    }
    this.passed = this.points > this.quiz.points / 2 ? true : false;
  }

  fiftyFifty() {
    const correctAnswer = this.activeResponse.find((res) => res.correctAnswer);

    const wrongAnswers = this.activeResponse
      .filter((res) => !res.correctAnswer)
      .slice(0, Math.ceil((this.activeResponse.length - 1) / 2) - 1);

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
    let saveDoneQuiz: SaveDoneQuiz = {
      user: this.user,
      quiz: this.quiz,
      doneQuiz: {
        pointsWon: this.points,
        timeLeft: this.timeLeft,
        quizIdForSearch: +this.quiz.id,
        userIdForSearch: +this.user.id,
        username: this.user.name,
      },
    };
    console.log(saveDoneQuiz);

    if (!this.isQuizBeaten && +this.user.id != +this.admin.id) {
      this.doneQuizService
        .saveQuiz(saveDoneQuiz)
        .subscribe(() => console.log('sacuvalo se'));
    }
  }

  saveProgress() {
    let saveQuizProgress: SaveQuizProgress = {
      user: this.user,
      quizProgress: {
        time: this.timeLeft,
        points: this.points,
        questionsAnswered: this.flag,
        quizId: +this.quiz.id,
        correctAns: this.statsCorrectAnsw,
        skippedAns: this.statsSkippedAnsw,
        wrongAns: this.statsWrongAnsw,
      },
    };

    if (!this.isQuizBeaten) {
      this.saveQuizService.saveProgress(saveQuizProgress).subscribe(() => {
        console.log('pre');
        this.router.navigate(['/quizes-page']);
        console.log('posle');
      });
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

  likeQuiz() {
    if (this.liked) {
      this.quizService.likeQuiz(+this.quiz.id).subscribe(() => {
        console.log('liked');
      });
      this.liked = false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Alredy Liked!',
      });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }
}
