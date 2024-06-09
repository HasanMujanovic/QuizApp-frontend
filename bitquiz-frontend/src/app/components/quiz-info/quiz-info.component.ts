import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Quiz } from '../../common/quiz';
import { QuizService } from '../../services/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quiz-info',
  templateUrl: './quiz-info.component.html',
  styleUrl: './quiz-info.component.css',
})
export class QuizInfoComponent implements OnInit {
  kvizInfoForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private kvizService: QuizService
  ) {}

  ngOnInit(): void {
    this.kvizInfoForm = this.formBuilder.group({
      info: this.formBuilder.group({
        category: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        status: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        difficulty: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),

        time: new FormControl('', [Validators.required, Validators.min(1)]),
      }),
    });
  }

  onSubmit() {
    let quiz = new Quiz();
    quiz = this.kvizInfoForm.controls['info'].value;

    this.kvizService.quizInfo = quiz;

    if (this.kvizInfoForm.valid) {
      console.log(this.kvizInfoForm.value);
      // Dalja obrada forme
      this.router.navigate(['/create-quiz']);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields requierd',
      });
    }
  }
}
