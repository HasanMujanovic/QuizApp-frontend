import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from '../../common/quiz';

@Component({
  selector: 'app-quizes-page',
  templateUrl: './quizes-page.component.html',
  styleUrl: './quizes-page.component.css',
})
export class QuizesPageComponent implements OnInit {
  quizes: Quiz[] = [];
  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.getQuizes();
  }

  getQuizes() {
    this.quizService.getQuizes().subscribe((data) => {
      this.quizes = data;
      console.log(this.quizes);
    });
  }
}
