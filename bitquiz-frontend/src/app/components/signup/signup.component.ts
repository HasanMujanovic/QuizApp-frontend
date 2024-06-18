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
import { User } from '../../Interface/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  role: string = 'player';
  userDTO: User = {} as User;
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
    console.log(this.storage.getItem('user'));
  }

  setRoleAdmin() {
    this.role = 'admin';
    console.log(this.role);
  }
  setRolePlayer() {
    this.role = 'player';
    console.log(this.role);
  }

  onSubmit() {
    let userName = this.signupForm.get('signup.ime').value;
    let password = this.signupForm.get('signup.sifra').value;
    let email2 = this.signupForm.get('signup.email').value;

    this.userDTO = {
      email: email2,
      name: userName,
      roles: this.role,
      status: 'Public',
    };

    this.authService.register(this.userDTO, password).subscribe({
      next: (data) => {
        console.log(data);

        this.storage.setItem('user', JSON.stringify(this.userDTO.email));
        this.storage.setItem('role', JSON.stringify(this.userDTO.roles));
        this.router.navigate(['/quizes']);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 5);
      },
      error: (error) => {
        this.flag = true;
        console.log(error);
      },
    });
  }

  refreshPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/signup']);
    });
  }
}
