import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Quiz } from '../../Interface/quiz';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrl: './edit-quiz.component.css',
})
export class EditQuizComponent implements OnInit {
  quiz: Quiz = new Quiz();
  kvizInfoForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getQuiz();
    });

    this.kvizInfoForm = this.formBuilder.group({
      info: this.formBuilder.group({
        category: ['', Validators.required],
        status: ['', Validators.required],
        difficulty: ['', Validators.required],
        name: ['', Validators.required],
      }),
    });
  }

  getQuiz() {
    const quizId: number = +this.route.snapshot.paramMap.get('id');
    this.quizService.getQuizById(quizId).subscribe((data) => {
      this.quiz = data;
      this.kvizInfoForm.patchValue({
        info: {
          category: this.quiz.category,
          status: this.quiz.status,
          difficulty: this.quiz.difficulty,
          name: this.quiz.name,
        },
      });
    });
  }

  isFormChanged(): boolean {
    return (
      this.kvizInfoForm.get('info.category')?.value !== this.quiz.category ||
      this.kvizInfoForm.get('info.status')?.value !== this.quiz.status ||
      this.kvizInfoForm.get('info.difficulty')?.value !==
        this.quiz.difficulty ||
      this.kvizInfoForm.get('info.name')?.value !== this.quiz.name
    );
  }

  onSubmit() {
    if (this.isFormChanged() && this.kvizInfoForm.valid) {
      let newQuizData: Quiz = this.quiz;
      newQuizData.difficulty = this.kvizInfoForm.get('info.difficulty').value;
      newQuizData.status = this.kvizInfoForm.get('info.status').value;
      newQuizData.name = this.kvizInfoForm.get('info.name').value;
      newQuizData.category = this.kvizInfoForm.get('info.category').value;

      this.quizService.editQuiz(newQuizData).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'You have edited the quiz!',
          timer: 1000,
          timerProgressBar: true,
          willClose: () => {
            window.location.href = '/made-quizes';
          },
        });
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'error!',
        text: 'You Didnt Change any values',
      });
    }
  }
}
