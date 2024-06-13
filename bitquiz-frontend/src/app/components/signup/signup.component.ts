import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../services/user.service';
import { EMPTY, Observable, catchError, map, of } from 'rxjs';
import { UserToSave } from '../../Interface/user-to-save';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  role: string = 'player';
  user: UserToSave = new UserToSave();
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
  setRolePlayer() {
    this.role = 'player';
    console.log(this.role);
  }

  // checkIfUserExists(email: string): Observable<boolean> {
  //   return this.authService.getUserToVerify(email).pipe(
  //     map((res) => res.email === email),
  //     catchError((error) => {
  //       console.error('Error checking if user exists:', error);
  //       return of(false);
  //     })
  //   );
  // }

  onSubmit() {
    let userName = this.signupForm.get('signup.ime').value;
    let password = this.signupForm.get('signup.sifra').value;
    let email2 = this.signupForm.get('signup.email').value;

    this.user.email = email2;
    this.user.name = userName;
    this.user.password = password;
    this.user.roles = this.role;
    this.user.status = 'Public';
    if (this.signupForm.valid) {
      this.authService.getUserToVerify(email2).subscribe({
        next: (exists) => {
          if (exists) {
            console.log('user exists');
            this.flag = true;
          } else {
            this.authService.saveUser(this.user).subscribe(() => {
              this.storage.setItem('user', JSON.stringify(this.user.email));
              this.storage.setItem('role', JSON.stringify(this.user.roles));
              this.router.navigate(['/quizes']);
              setTimeout(() => {
                window.location.reload();
              }, 5);
            });
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

      console.log('submitted');
    } else this.flag = true;
  }

  refreshPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/signup']);
    });
  }
}
