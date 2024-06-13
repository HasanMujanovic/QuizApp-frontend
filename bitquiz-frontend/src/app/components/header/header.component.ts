import { Component, OnInit } from '@angular/core';
import { User } from '../../Interface/user';
import { AuthenticateService } from '../../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  storage: Storage = sessionStorage;
  email = JSON.parse(this.storage.getItem('user'));
  user: User = new User();

  constructor(private authService: AuthenticateService) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authService.getUser(this.email).subscribe((data) => {
      this.user = data;
    });
  }
}
