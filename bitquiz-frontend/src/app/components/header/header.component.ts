import { Component, OnInit } from '@angular/core';
import { User } from '../../Interface/user';
import { AuthenticateService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { Route, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  storage: Storage = sessionStorage;
  email = JSON.parse(this.storage.getItem('user'));
  user: User;

  constructor(
    private authService: AuthenticateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authService.getUser(this.email).subscribe((data) => {
      this.user = data;
    });
  }

  onLogout() {
    const confirmation = window.confirm('Are you sure you want to logout');

    if (confirmation) {
      this.storage.removeItem('user');
      this.storage.removeItem('role');
      this.router.navigate(['']);
    }
  }
}
