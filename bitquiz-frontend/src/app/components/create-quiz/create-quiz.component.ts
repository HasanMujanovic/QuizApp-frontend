import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css',
})
export class CreateQuizComponent {
  kvizForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.kvizForm = this.formBuilder.group({
      pitanja: this.formBuilder.array([this.createPitanjeGroup()]),
    });
  }

  get pitanja(): FormArray {
    return this.kvizForm.get('pitanja') as FormArray;
  }

  createPitanjeGroup(): FormGroup {
    return this.formBuilder.group({
      pitanje: ['', Validators.required],
      odgovori: this.formBuilder.array([
        this.formBuilder.control('', Validators.required),
        this.formBuilder.control('', Validators.required),
      ]),
    });
  }

  addPitanje(): void {
    this.kvizForm.reset();
  }

  addOdgovor(index: number): void {
    const odgovori = this.pitanja.at(index).get('odgovori') as FormArray;
    odgovori.push(this.formBuilder.control('', Validators.required));
  }

  onSubmit(): void {
    if (this.kvizForm.valid) {
      console.log(this.kvizForm.value);
      // Dalja obrada forme
    } else {
      console.log('Forma nije validna');
    }
  }
}
