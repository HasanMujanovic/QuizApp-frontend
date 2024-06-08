import { Component, OnInit } from '@angular/core';
import { Quiz } from '../../common/quiz';
import { QuizService } from '../../services/quiz.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrl: './quiz-details.component.css',
})
export class QuizDetailsComponent implements OnInit {
  quiz: Quiz = new Quiz();

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getQuiz();
    });
  }

  getQuiz() {
    const quizId: number = +this.route.snapshot.paramMap.get('id');

    this.quizService.getOneQuiz(quizId).subscribe((data) => (this.quiz = data));
  }
}
