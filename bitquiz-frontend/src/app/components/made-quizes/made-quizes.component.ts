import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import { QuizService } from '../../services/quiz.service';
import { concatMap } from 'rxjs';
import { User } from '../../common/user';
import { Quiz } from '../../common/quiz';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-made-quizes',
  templateUrl: './made-quizes.component.html',
  styleUrl: './made-quizes.component.css',
})
export class MadeQuizesComponent implements OnInit {
  storage: Storage = sessionStorage;

  user: User = new User();
  quizes: Quiz[] = [];
  quiz: Quiz = new Quiz();

  constructor(
    private authService: AuthenticateService,
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getMadeQuizes();
    });
  }

  getMadeQuizes() {
    const email = JSON.parse(this.storage.getItem('user'));

    this.authService
      .getUser(email)
      .pipe(
        concatMap((data) => {
          this.user = data;
          return this.quizService.getMadeQuizes(+data.id);
        })
      )
      .subscribe((data) => {
        this.quizes = data;
        console.log(this.quizes);
      });
  }
}
