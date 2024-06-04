import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Kviz } from '../../common/kviz';

@Component({
  selector: 'app-quiz-info',
  templateUrl: './quiz-info.component.html',
  styleUrl: './quiz-info.component.css',
})
export class QuizInfoComponent implements OnInit {
  kvizInfoForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.kvizInfoForm = this.formBuilder.group({
      info: this.formBuilder.group({
        kategorija: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        status: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        tezina: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        ime: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
      }),
    });
  }

  onSubmit() {
    let kviz = new Kviz();
    kviz = this.kvizInfoForm.controls['info'].value;

    if (this.kvizInfoForm.valid) {
      console.log(this.kvizInfoForm.value);
      // Dalja obrada forme
      this.router.navigate(['/create-quiz']);
    } else {
      console.log('Forma nije validna');
    }
  }
}
