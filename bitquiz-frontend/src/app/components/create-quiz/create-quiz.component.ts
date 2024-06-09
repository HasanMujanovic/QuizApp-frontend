import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { QuizQuestion } from '../../common/quiz-question';
import { QuizResponse } from '../../common/quiz-response';
import { Quiz } from '../../common/quiz';
import { MakeQuiz } from '../../common/make-quiz';
import { User } from '../../common/user';
import { AuthenticateService } from '../../services/authenticate.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css',
})
export class CreateQuizComponent {
  quizForm: FormGroup;
  allQuestions: any[] = [];
  allResponses: any[] = [];
  allScores: any[] = [];
  allHelps: any[] = [];
  quizQuestions: QuizQuestion[] = [];
  quizResponese: QuizResponse[] = [];

  storage: Storage = sessionStorage;
  userEmail: string = JSON.parse(this.storage.getItem('user'));
  user: User = new User();

  errors = [];

  constructor(
    private formBuilder: FormBuilder,
    private quizService: QuizService,
    private authService: AuthenticateService
  ) {
    this.getUser(this.userEmail);
  }

  ngOnInit(): void {
    this.quizForm = this.formBuilder.group({
      questions: this.formBuilder.array([this.createQuestionGroup()]),
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  createQuestionGroup(): FormGroup {
    const responseGroup = this.createResponseGroup();
    const responseGroup2 = this.createResponseGroup();
    responseGroup.get('isNew').setValue(false);
    responseGroup2.get('isNew').setValue(false);
    return this.formBuilder.group({
      question: ['', Validators.required],
      points: ['', [Validators.required, Validators.min(1)]],
      helpAllowed: false,
      responses: this.formBuilder.array([responseGroup, responseGroup2]),
    });
  }

  createResponseGroup(): FormGroup {
    return this.formBuilder.group({
      text: ['', Validators.required],
      bool: false,
      isNew: true,
    });
  }

  removeResponse(questionIndex: number, responseIndex: number): void {
    const question = this.questions.at(questionIndex) as FormGroup;
    const responses = question.get('responses') as FormArray;
    responses.removeAt(responseIndex);
    console.log('Pitanja:', this.allQuestions);
    console.log('responses:', this.allResponses);
  }

  checkCorrectAnswers(): boolean {
    const question = (this.quizForm.get('questions') as FormArray)
      .controls[0] as FormGroup;

    const responses = question.get('responses') as FormArray;
    return responses.controls.some(
      (response: FormGroup) => response.get('bool').value
    );
  }

  displayAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: this.errors.join('\n'),
    });
  }

  errorMessages(): boolean {
    let tempErr = [];
    if (!this.quizForm.valid || !this.checkCorrectAnswers()) {
      if (!this.checkCorrectAnswers()) {
        tempErr.push('At least one correct answer is required.');
      }
      if (this.quizForm.get('questions').invalid) {
        tempErr.push('All Fields are required.');
      }
      this.errors = tempErr;

      return true;
    }
    return false;
  }

  addQuestion(): void {
    if (this.errorMessages()) {
      this.displayAlert();
      return;
    }
    console.log(this.quizForm.valid);

    const newQuestion = this.quizForm.value.questions[0];
    this.allQuestions.push(newQuestion.question);
    this.allResponses.push(newQuestion.responses);
    this.allScores.push(newQuestion.points);
    this.allHelps.push(newQuestion.helpAllowed);
    console.log('Pitanja:', this.allQuestions);
    console.log('responses:', this.allResponses);
    console.log('----' + this.allScores);
    console.log('----' + newQuestion.helpAllowed);
    console.log(newQuestion.responses + 'asdafsa-------------');

    this.quizForm.setControl(
      'questions',
      this.formBuilder.array([this.createQuestionGroup()])
    );
  }

  addResponse(index: number): void {
    const response = this.questions.at(index).get('responses') as FormArray;

    response.push(this.createResponseGroup());

    const questionGroup = this.questions.at(index) as FormGroup;
    if (response.length > 2 && !questionGroup.get('helpAllowed')) {
      questionGroup.addControl('helpAllowed', new FormControl(false));
    }
  }

  getUser(email: string) {
    this.authService.getUser(email).subscribe((data) => {
      this.user = data;
    });
  }

  onSubmit(): void {
    if (this.errorMessages()) {
      this.displayAlert();
      return;
    }

    let quiz = new Quiz();
    quiz = this.quizService.quizInfo;
    quiz.points = 0;
    for (let i = 0; i < this.allQuestions.length; i++) {
      let tempQuizQuestion = new QuizQuestion();
      tempQuizQuestion.text = this.allQuestions[i];
      tempQuizQuestion.points = this.allScores[i];
      tempQuizQuestion.helpAllowed = this.allHelps[i];
      this.quizQuestions.push(tempQuizQuestion);
      quiz.points += this.allScores[i];
    }
    console.log(this.quizQuestions);

    for (let res of this.allResponses) {
      for (let i = 0; i < res.length; i++) {
        let tempQuizResponse = new QuizResponse();
        tempQuizResponse.text = res[i].text;
        tempQuizResponse.correctAnswer = res[i].bool;
        res[i] = tempQuizResponse;
      }

      this.quizResponese.push(res);
    }
    let makeQuiz = new MakeQuiz();
    makeQuiz.quiz = quiz;
    makeQuiz.quizResponse = this.quizResponese;
    makeQuiz.quizQuestions = this.quizQuestions;
    makeQuiz.user = this.user;

    this.quizService.makeQuiz(makeQuiz).subscribe(() => console.log('radi'));

    if (this.quizForm.valid) {
      console.log(this.quizForm.value);
    } else {
      console.log('Forma nije validna');
    }
  }
}
