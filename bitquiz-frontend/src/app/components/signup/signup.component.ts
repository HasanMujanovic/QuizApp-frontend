import { Component, OnInit } from '@angular/core';
import { User } from '../../common/user';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
import { EMPTY, Observable, catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  role: string = 'igrac';
  user: User = new User();
  flag: boolean = false;

  signupForm: FormGroup;

  storage: Storage = sessionStorage;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticateService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      signup: this.formBuilder.group({
        ime: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        sifra: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
      }),
    });
  }

  setRoleAdmin() {
    this.role = 'admin';
    console.log(this.role);
  }
  setRoleIgrac() {
    this.role = 'igrac';
    console.log(this.role);
  }

  checkIfUserExists(email: string): Observable<boolean> {
    return this.authService.getUser(email).pipe(
      map((res) => res.email === email),
      catchError((error) => {
        console.error('Error checking if user exists:', error);
        return of(false); // Vraćamo false ako se dogodila greška
      })
    );
  }

  onSubmit() {
    let userName = this.signupForm.get('signup.ime').value;
    let password = this.signupForm.get('signup.sifra').value;
    let email2 = this.signupForm.get('signup.email').value;

    this.user.email = email2;
    this.user.sifra = password;
    this.user.ime = userName;
    this.user.roles = this.role;

    this.authService.getUser(email2).subscribe({
      next: () => {
        this.flag = true;
        console.log('errror');
      },
      error: () => {
        this.authService.saveUser(this.user).subscribe(() => {
          this.storage.setItem('user', JSON.stringify(this.user.email));
          this.storage.setItem('role', JSON.stringify(this.user.roles));
          this.router.navigate(['/quizes']);
          setTimeout(() => {
            window.location.reload();
          }, 5);
        });
      },
    });

    console.log('submitted');
  }

  refreshPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/signup']);
    });
  }
}
