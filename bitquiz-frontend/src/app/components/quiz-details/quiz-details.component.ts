import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticateService } from '../../services/user.service';
import { concatMap, of } from 'rxjs';
import { QuizPlayingService } from '../../services/quiz-playing.service';
import { DoneQuizService } from '../../services/done-quiz.service';
import { Quiz } from '../../Interface/quiz';
import { DoneQuiz } from '../../Interface/done-quiz';
import { QuizProgress } from '../../Interface/quiz-progress';
import { User } from '../../Interface/user';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrl: './quiz-details.component.css',
})
export class QuizDetailsComponent implements OnInit {
  quiz: Quiz;
  doneQuize: DoneQuiz;
  leaderboard: DoneQuiz[] = [];

  statusOfQuiz: boolean = false;

  isQuizDone: boolean = false;

  user: User;
  progressOfQuiz: QuizProgress;
  isThereProgress: boolean = false;
  storage: Storage = sessionStorage;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private authService: AuthenticateService,
    private quizPlayingService: QuizPlayingService,
    private doneQuizService: DoneQuizService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getQuiz();
      this.getDoneQuizesAndMaybeLookForProgress();
      this.getLeaderboard();
    });
  }

  getDoneQuizesAndMaybeLookForProgress() {
    const email = JSON.parse(this.storage.getItem('user'));
    const quizId: number = +this.route.snapshot.paramMap.get('id');

    this.authService
      .getUser(email)
      .pipe(
        concatMap((data) => this.doneQuizService.getDoneQuizes(+data.id)),
        concatMap((doneQuizes) => {
          this.isQuizDone = doneQuizes.some(
            (quiz) => quiz.quizIdForSearch === quizId
          );

          if (this.isQuizDone) {
            console.log('quizdone');

            this.doneQuize = doneQuizes.find(
              (quiz) => quiz.quizIdForSearch === quizId
            );
            console.log(this.doneQuize);

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
              this.progressOfQuiz = res;
              this.isThereProgress = true;

              return;
            }
          }
        }
      });
  }

  getLeaderboard() {
    const quizId: number = +this.route.snapshot.paramMap.get('id');
    const email = JSON.parse(this.storage.getItem('user'));

    this.doneQuizService
      .getLeaderboardForQuiz(quizId)
      .subscribe((data) => (this.leaderboard = data));
  }

  getQuiz() {
    const quizId: number = +this.route.snapshot.paramMap.get('id');
    this.quizService
      .getQuizById(quizId)
      .pipe(
        concatMap((data) => {
          this.quiz = data;
          console.log(this.quiz.name + '-------------');

          this.statusOfQuiz = data.status == 'Public' ? true : false;
          return this.quizService.getAdminOfQuiz(+data.id);
        })
      )
      .subscribe((data) => {
        this.user = data;
      });
  }
}
