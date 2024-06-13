import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../Interface/user';
import { DoneQuizService } from '../../services/done-quiz.service';
import { QuizPlayingService } from '../../services/quiz-playing.service';
import { AuthenticateService } from '../../services/user.service';

@Component({
  selector: 'app-other-user-details',
  templateUrl: './other-user-details.component.html',
  styleUrl: './other-user-details.component.css',
})
export class OtherUserDetailsComponent {
  user: User = new User();
  doneQuizesNumber: number;
  inProgressQuizes: number;
  selectedStatus: any;
  userStatus: boolean;
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
    console.log(this.selectedStatus);
  }

  getUser() {
    const userId: number = +this.route.snapshot.paramMap.get('id');
    this.authService.getUserById(userId).subscribe((data) => {
      this.user = data;
      this.userStatus = data.status === 'Public' ? true : false;
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
    this.authService
      .editStatus(this.selectedStatus, this.user.email)
      .subscribe(() => {
        console.log('done');
      });
    console.log(this.user.email);
    console.log(this.selectedStatus);

    console.log('saved');
  }
}
