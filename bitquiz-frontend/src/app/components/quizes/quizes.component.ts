import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/user.service';
import { User } from '../../Interface/user';

@Component({
  selector: 'app-quizes',
  templateUrl: './quizes.component.html',
  styleUrl: './quizes.component.css',
})
export class QuizesComponent implements OnInit {
  users: User[] = [];
  constructor(private authService: AuthenticateService) {}

  ngOnInit(): void {
    this.getLeaderboard();
  }

  getLeaderboard() {
    this.authService.getUserLeaderboard().subscribe((data) => {
      this.users = data;
    });
  }
}
