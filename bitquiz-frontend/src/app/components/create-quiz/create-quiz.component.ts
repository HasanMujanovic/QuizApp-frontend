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
import { User } from '../../common/user';
import { AuthenticateService } from '../../services/authenticate.service';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css',
})
export class CreateQuizComponent {
  kvizForm: FormGroup;
  svaPitanja: any[] = [];
  sviOdgovori: any[] = [];
  sviBodovi: any[] = [];
  svePomocoi: any[] = [];
  kvizPitanja: KvizPitanja[] = [];
  kvizOdgovori: KvizOdgovori[] = [];

  storage: Storage = sessionStorage;
  userEmail: string = JSON.parse(this.storage.getItem('user'));
  user: User = new User();

  constructor(
    private formBuilder: FormBuilder,
    private kvizService: KvizService,
    private authService: AuthenticateService
  ) {
    this.getUser(this.userEmail);
  }

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
      bodovi: ['', [Validators.required, Validators.min(1)]],
      dozvoljenaPomoc: false,
      odgovori: this.formBuilder.array([
        this.createOdgovorGroup(),
        this.createOdgovorGroup(),
      ]),
    });
  }

  createOdgovorGroup(): FormGroup {
    return this.formBuilder.group({
      tekst: ['', Validators.required],
      tacno: false,
    });
  }

  addPitanje(): void {
    const novoPitanje = this.kvizForm.value.pitanja[0];
    this.svaPitanja.push(novoPitanje.pitanje);
    this.sviOdgovori.push(novoPitanje.odgovori);
    this.sviBodovi.push(novoPitanje.bodovi);
    this.svePomocoi.push(novoPitanje.dozvoljenaPomoc);
    console.log('Pitanja:', this.svaPitanja);
    console.log('Odgovori:', this.sviOdgovori);
    console.log('----' + this.sviBodovi);
    console.log('----' + novoPitanje.dozvoljenaPomoc);

    this.kvizForm.setControl(
      'pitanja',
      this.formBuilder.array([this.createPitanjeGroup()])
    );
  }

  addOdgovor(index: number): void {
    const odgovori = this.pitanja.at(index).get('odgovori') as FormArray;
    odgovori.push(this.createOdgovorGroup());
    // Update pomoc (50:50) option visibility
    const pitanjaGroup = this.pitanja.at(index) as FormGroup;
    if (odgovori.length > 2 && !pitanjaGroup.get('dozvoljenaPomoc')) {
      pitanjaGroup.addControl('dozvoljenaPomoc', new FormControl(false));
    }
  }

  getUser(email: string) {
    this.authService.getUser(email).subscribe((data) => {
      this.user = data;
    });
  }
  onSubmit(): void {
    console.log('USER');

    let kviz = new Kviz();
    kviz = this.kvizService.kvizInfo;
    kviz.bodovi = 0;
    for (let i = 0; i < this.svaPitanja.length; i++) {
      let tempKvizPitanja = new KvizPitanja();
      tempKvizPitanja.tekst = this.svaPitanja[i];
      tempKvizPitanja.bodovi = this.sviBodovi[i];
      tempKvizPitanja.pomoc = this.svePomocoi[i];
      this.kvizPitanja.push(tempKvizPitanja);
      kviz.bodovi += this.sviBodovi[i];
    }
    console.log(this.kvizPitanja);

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
    napraviKviz.user = this.user;

    this.kvizService
      .napraviKviz(napraviKviz)
      .subscribe(() => console.log('radi'));

    if (this.kvizForm.valid) {
      console.log(this.kvizForm.value);
    } else {
      console.log('Forma nije validna');
    }
  }
}
