import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { KvizService } from '../../services/kviz.service';
import { KvizPitanja } from '../../common/kviz-pitanja';
import { KvizOdgovori } from '../../common/kviz-odgovori';
import { Kviz } from '../../common/kviz';
import { NapraviKviz } from '../../common/napravi-kviz';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css',
})
export class CreateQuizComponent {
  kvizForm: FormGroup;
  svaPitanja: any[] = [];
  sviOdgovori: any[] = [];
  kvizPitanja: KvizPitanja[] = [];
  kvizOdgovori: KvizOdgovori[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private kvizService: KvizService
  ) {}

  ngOnInit(): void {
    this.kvizForm = this.formBuilder.group({
      pitanja: this.formBuilder.array([this.createPitanjeGroup()]),
    });
    console.log(this.kvizService.kvizInfo.ime);
  }

  get pitanja(): FormArray {
    return this.kvizForm.get('pitanja') as FormArray;
  }

  createPitanjeGroup(): FormGroup {
    return this.formBuilder.group({
      pitanje: ['', Validators.required],
      odgovori: this.formBuilder.array([
        this.formBuilder.group({
          tekst: ['', Validators.required],
          tacno: false,
        }),
        this.formBuilder.group({
          tekst: ['', Validators.required],
          tacno: false,
        }),
      ]),
    });
  }

  addPitanje(): void {
    const novoPitanje = this.kvizForm.value.pitanja[0];
    this.svaPitanja.push(novoPitanje.pitanje);
    this.sviOdgovori.push(novoPitanje.odgovori);
    console.log('Pitanja:', this.svaPitanja);
    console.log('Odgovori:', this.sviOdgovori);
    this.kvizForm.reset();
  }

  addOdgovor(index: number): void {
    const odgovori = this.pitanja.at(index).get('odgovori') as FormArray;
    odgovori.push(this.formBuilder.control('', Validators.required));
  }

  onSubmit(): void {
    let kviz = new Kviz();
    kviz = this.kvizService.kvizInfo;
    for (let i = 0; i < this.svaPitanja.length; i++) {
      let tempKvizPitanja = new KvizPitanja();
      tempKvizPitanja.tekst = this.svaPitanja[i];
      this.kvizPitanja.push(tempKvizPitanja);
    }
    for (let odg of this.sviOdgovori) {
      for (let i = 0; i < odg.length; i++) {
        let tempKvizOdg = new KvizOdgovori();
        tempKvizOdg.tekst = odg[i].tekst;
        tempKvizOdg.odgovorTacan = odg[i].tacno;
        odg[i] = tempKvizOdg;
      }

      this.kvizOdgovori.push(odg);
    }
    let napraviKviz = new NapraviKviz();
    napraviKviz.kviz = kviz;
    napraviKviz.kvizOdgovori = this.kvizOdgovori;
    napraviKviz.kvizPitanja = this.kvizPitanja;
    console.log(this.kvizOdgovori);

    this.kvizService
      .napraviKviz(napraviKviz)
      .subscribe(() => console.log('radi'));

    if (this.kvizForm.valid) {
      console.log(this.kvizForm.value);
      // Dalja obrada forme
    } else {
      console.log('Forma nije validna');
    }
  }
}
