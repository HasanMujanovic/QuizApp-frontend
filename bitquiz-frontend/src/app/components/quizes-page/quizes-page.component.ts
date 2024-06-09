import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from '../../common/quiz';
import { DoneQuiz } from '../../common/done-quiz';
import { AuthenticateService } from '../../services/authenticate.service';
import { concatMap } from 'rxjs';
import { DoneQuizService } from '../../services/done-quiz.service';

@Component({
  selector: 'app-quizes-page',
  templateUrl: './quizes-page.component.html',
  styleUrl: './quizes-page.component.css',
})
export class QuizesPageComponent implements OnInit {
  quizes: Quiz[] = [];
  doneQuizes: DoneQuiz[] = [];

  quizIdsFromDoneQuizes: number[] = [];

  storage: Storage = sessionStorage;
  email = JSON.parse(this.storage.getItem('user'));
  constructor(
    private quizService: QuizService,
    private authService: AuthenticateService,
    private doneQuizService: DoneQuizService
  ) {}

  ngOnInit(): void {
    this.getQuizes();
    this.getDoneQuizes();
  }
  getDoneQuizes() {
    this.authService
      .getUser(this.email)
      .pipe(concatMap((data) => this.doneQuizService.getDoneQuizes(+data.id)))
      .subscribe((data) => {
        this.doneQuizes = data;
        this.quizIdsFromDoneQuizes = data.map((quiz) => quiz.quizIdForSearch);

        console.log(this.quizIdsFromDoneQuizes);
      });
  }

  getQuizes() {
    this.quizService.getQuizes().subscribe((data) => {
      this.quizes = data;

      console.log(this.quizes);
    });
  }
}
