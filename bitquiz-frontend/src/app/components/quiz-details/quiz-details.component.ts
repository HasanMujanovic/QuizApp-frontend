import { Component, OnInit } from '@angular/core';
import { Quiz } from '../../common/quiz';
import { QuizService } from '../../services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../common/user';
import { AuthenticateService } from '../../services/authenticate.service';
import { concatMap, of } from 'rxjs';
import { QuizPlayingService } from '../../services/quiz-playing.service';
import { QuizProgress } from '../../common/quiz-progress';
import { DoneQuizService } from '../../services/done-quiz.service';
import { DoneQuiz } from '../../common/done-quiz';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrl: './quiz-details.component.css',
})
export class QuizDetailsComponent implements OnInit {
  quiz: Quiz = new Quiz();
  doneQuize: DoneQuiz = new DoneQuiz();

  isQuizDone: boolean = false;

  user: User = new User();
  progressOfQuiz: QuizProgress = new QuizProgress();
  isThereProgress: boolean = false;
  storage: Storage = sessionStorage;

  email = JSON.parse(this.storage.getItem('user'));

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
      // this.lookForProgress();
      // this.getDoneQuizes();
    });
  }

  getDoneQuizesAndMaybeLookForProgress() {
    this.authService
      .getUser(this.email)
      .pipe(
        concatMap((data) => this.doneQuizService.getDoneQuizes(+data.id)),
        concatMap((doneQuizes) => {
          this.isQuizDone = doneQuizes.some(
            (quiz) => quiz.quizIdForSearch === +this.quiz.id
          );
          if (this.isQuizDone) {
            console.log('quizdone');

            this.doneQuize = doneQuizes.find(
              (quiz) => quiz.quizIdForSearch === +this.quiz.id
            );
            return of(null);
          } else {
            return this.authService
              .getUser(this.email)
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
            if (res.quizId == +this.quiz.id) {
              this.progressOfQuiz = res;
              this.isThereProgress = true;
              this.quizPlayingService.currentQuestion = res.questionsAnswered;
              this.quizPlayingService.isThereProgress = true;
              this.quizPlayingService.timeLeft = res.time;
              this.quizPlayingService.points = res.points;
              return;
            }
          }
          this.quizPlayingService.isThereProgress = false;
        }
      });
  }

  getQuiz() {
    const quizId: number = +this.route.snapshot.paramMap.get('id');
    this.quizService.getOneQuiz(quizId).subscribe((data) => {
      this.quiz = data;
    });
  }
}
