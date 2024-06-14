import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { AuthenticateService } from '../../services/user.service';
import { Observable, concatMap } from 'rxjs';
import { DoneQuizService } from '../../services/done-quiz.service';
import { DoneQuiz } from '../../Interface/done-quiz';
import { Quiz } from '../../Interface/quiz';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../Interface/category';

@Component({
  selector: 'app-quizes-page',
  templateUrl: './quizes-page.component.html',
  styleUrl: './quizes-page.component.css',
})
export class QuizesPageComponent implements OnInit {
  quizes: Quiz[] = [];
  stringSet: Set<string> = new Set<string>();

  categories: Category[] = [];

  selectedCategory: string = 'All';
  selectedDifficulty: string = 'All';

  doneQuizes: DoneQuiz[] = [];

  quizIdsFromDoneQuizes: number[] = [];

  storage: Storage = sessionStorage;
  email = JSON.parse(this.storage.getItem('user'));
  constructor(
    private quizService: QuizService,
    private authService: AuthenticateService,
    private doneQuizService: DoneQuizService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.getQuizes();
    this.getDoneQuizes();
    this.getCategories();
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

  onFilter() {
    let categoryUrl =
      this.selectedCategory === 'All' ? null : this.selectedCategory;
    let difficultyUrl =
      this.selectedDifficulty === 'All' ? null : this.selectedDifficulty;

    console.log(categoryUrl);
    console.log(difficultyUrl);

    this.quizService
      .filterQuizes(categoryUrl, difficultyUrl)
      .subscribe((data) => {
        this.quizes = data;
        console.log(this.quizes);
        console.log(data);

        console.log('filtered');
      });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      console.log(this.categories);
    });
  }

  getQuizes() {
    this.quizService.getQuizes().subscribe((data) => {
      this.quizes = data;
      console.log(this.quizes);
    });
  }
}
