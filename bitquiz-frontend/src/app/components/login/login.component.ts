import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthenticateService } from '../../services/user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EMPTY, catchError, empty, of } from 'rxjs';
import { trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  role: string = 'player';
  loginForm: FormGroup;
  flag = false;

  storage: Storage = sessionStorage;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthenticateService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: this.formBuilder.group({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
      }),
    });
  }
  onSubmit() {
    let email = this.loginForm.get('login.email').value;
    let password = this.loginForm.get('login.password').value;

    this.authService.checkIfUserExistsLogIn(email, password).subscribe({
      next: (res) => {
        if (res) {
          this.storage.setItem('user', JSON.stringify(email));
          this.storage.setItem('role', JSON.stringify(this.role));
          this.router.navigate(['/quizes']);
        } else {
          this.flag = true;
        }
      },
      error: () => (this.flag = true),
    });
  }
  setRolePlayer() {
    this.role = 'player';
  }
  setRoleAdmin() {
    this.role = 'admin';
  }
  refreshPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/login']);
    });
  }
}
