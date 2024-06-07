import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
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
  role: string = 'igrac';
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
        sifra: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
      }),
    });
  }
  onSubmit() {
    let email = this.loginForm.get('login.email').value;
    let sifra = this.loginForm.get('login.sifra').value;

    this.authService.getUser(email).subscribe({
      next: (res) => {
        console.log('nastavak');
        console.log();

        if (
          res.roles === this.role &&
          sifra === res.sifra &&
          email === res.email
        ) {
          this.storage.setItem('user', JSON.stringify(res.email));
          this.storage.setItem('role', JSON.stringify(res.roles));
          this.router.navigate(['/quizes']);
          console.log('Login successful:', res);
        } else {
          console.log('Login failed:', res);
          this.flag = true;
        }
      },
      error: () => (this.flag = true),
    });
  }
  setRoleIgrac() {
    this.role = 'igrac';
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
