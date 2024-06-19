import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/user.service';
import { DoneQuizService } from '../../services/done-quiz.service';
import { concatMap, forkJoin, of, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from '../../Interface/quiz';

@Component({
  selector: 'app-done-quizes',
  templateUrl: './done-quizes.component.html',
  styleUrl: './done-quizes.component.css',
})
export class DoneQuizesComponent implements OnInit {
  storage: Storage = sessionStorage;
  doneQuizes: Quiz[] = [];
  quizIdsFromDoneQuizes: number[] = [];

  selectedCategory: string = 'All';
  selectedDifficulty: string = 'All';

  constructor(
    private authService: AuthenticateService,
    private doneQuizService: DoneQuizService,
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getDoneQuizes();
    });
  }

  getDoneQuizes() {
    const email = JSON.parse(this.storage.getItem('user'));

    this.authService
      .getUser(email)
      .pipe(
        concatMap((userData) => {
          const userId = userData.id;
          console.log(userData);

          return this.doneQuizService.getDoneQuizes(+userId);
        }),
        concatMap((doneQuizes) => {
          const quizIds = doneQuizes.map((quiz) => quiz.quizIdForSearch);
          const observables = quizIds.map((quizId) =>
            this.quizService.getQuizById(quizId)
          );
          return forkJoin(observables);
        })
      )
      .subscribe((doneQuizesData) => {
        this.doneQuizes = doneQuizesData;
        console.log(this.doneQuizes);
      });
  }

  // onFilter() {
  //   let categoryUrl =
  //     this.selectedCategory === 'All' ? null : this.selectedCategory;
  //   let difficultyUrl =
  //     this.selectedDifficulty === 'All' ? null : this.selectedDifficulty;

  //   console.log(categoryUrl);
  //   console.log(difficultyUrl);

  //   this.quizService
  //     .filterQuizes(categoryUrl, difficultyUrl)
  //     .subscribe((data) => {
  //       this.quizes = data;
  //       console.log(this.quizes);
  //       console.log(data);

  //       console.log('filtered');
  //     });
  // }
}
