import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticateService } from '../../services/user.service';
import { User } from '../../Interface/user';
import { DoneQuizService } from '../../services/done-quiz.service';
import { QuizPlayingService } from '../../services/quiz-playing.service';
import { Observable, map } from 'rxjs';
import { SaveDoneQuiz } from '../../Interface/save-done-quiz';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  user: User;
  doneQuizesNumber: number;
  inProgressQuizes: number;
  selectedStatus: any;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticateService,
    private doneQuizService: DoneQuizService,
    private quizPLayingService: QuizPlayingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getUser();
      this.getUserDoneQuizes();
      this.getUserProgressQuizes();
    });
  }

  getUser() {
    const userId: number = +this.route.snapshot.paramMap.get('id');
    this.authService.getUserById(userId).subscribe((data) => {
      this.user = data;
      this.selectedStatus = data.status;
      console.log(this.user);
    });
  }
  getUserDoneQuizes() {
    const userId: number = +this.route.snapshot.paramMap.get('id');
    this.doneQuizService
      .getDoneQuizes(userId)
      .subscribe((data) => (this.doneQuizesNumber = data.length));
  }
  getUserProgressQuizes() {
    const userId: number = +this.route.snapshot.paramMap.get('id');
    this.quizPLayingService
      .searchForProgressWUserId(userId)
      .subscribe((data) => (this.inProgressQuizes = data.length));
  }
  saveStatus() {
    console.log('klik');

    this.authService
      .editStatus(this.selectedStatus, this.user.email)
      .subscribe(() => {
        console.log('done');
      });
    console.log(this.user.email);
    console.log(this.selectedStatus);
    console.log('saved');

    window.location.reload();
  }
}
