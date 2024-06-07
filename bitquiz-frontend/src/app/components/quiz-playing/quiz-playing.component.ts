import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizPlayingService } from '../../services/quiz-playing.service';
import { Kviz } from '../../common/kviz';
import { KvizService } from '../../services/kviz.service';
import { KvizPitanja } from '../../common/kviz-pitanja';
import { KvizOdgovori } from '../../common/kviz-odgovori';
import { ZavrsenKvizService } from '../../services/zavrsen-kviz.service';
import { User } from '../../common/user';
import { AuthenticateService } from '../../services/authenticate.service';
import { SacuvajZavrsenKviz } from '../../common/sacuvaj-zavrsen-kviz';
import { ZavrsenKviz } from '../../common/zavrsen-kviz';
import { SacuvajKvizProgres } from '../../common/sacuvaj-kviz-progres';
import { KvizProgres } from '../../common/kviz-progres';
import { SaveQuizService } from '../../services/save-quiz.service';

@Component({
  selector: 'app-quiz-playing',
  templateUrl: './quiz-playing.component.html',
  styleUrl: './quiz-playing.component.css',
})
export class QuizPlayingComponent implements OnInit, OnDestroy {
  kviz: Kviz;
  pitanja: KvizPitanja[] = [];
  activePitanje: KvizPitanja;
  activeOdgovori: KvizOdgovori[] = [];
  flag: number = 0;
  bodovi: number = 0;
  krajKviza: boolean = false;

  preostaloVreme: number;
  timerInterval: any;

  storage: Storage = sessionStorage;
  email: string = JSON.parse(this.storage.getItem('user'));
  user: User = new User();

  constructor(
    private route: ActivatedRoute,
    private kvizPlayService: QuizPlayingService,
    private kvizService: KvizService,
    private zavrsenKvizService: ZavrsenKvizService,
    private authService: AuthenticateService,
    private sacuvProgresService: SaveQuizService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const kvizId: number = +params.get('id');
      this.getKviz(kvizId);
      this.getPitanja(kvizId);
    });
    this.timer();
    this.getUser();
  }

  getKviz(id: number) {
    this.kvizService.getSingleKviz(id).subscribe((data) => {
      this.kviz = data;
      this.preostaloVreme = data.vreme * 60;
      console.log(this.preostaloVreme);
    });
  }
  getPitanja(id: number) {
    this.kvizPlayService.getPitanja(id).subscribe((data) => {
      this.pitanja = data;
      this.activePitanje = this.pitanja[0];
      this.pocetnoPitanje(+this.activePitanje.id);
    });
  }
  getUser() {
    this.authService
      .getUser(this.email)
      .subscribe((data) => (this.user = data));
  }

  pocetnoPitanje(pitanjeId: number) {
    this.kvizPlayService
      .getOdgovori(pitanjeId)
      .subscribe((data) => (this.activeOdgovori = data));
  }

  onSledecePitanje() {
    if (this.flag < this.pitanja.length - 1) {
      this.flag++;
      this.activePitanje = this.pitanja[this.flag];
      this.pocetnoPitanje(+this.activePitanje.id);
    } else {
      this.krajKviza = true;
      console.log('Kviz je završen');
      // Ovde možete dodati logiku za završetak kviza
    }
  }

  proveriOdgovor(odgovor: KvizOdgovori) {
    if (odgovor.odgovorTacan) {
      this.bodovi += this.kviz.bodovi; // ili kako god računate bodove po pitanju
    }
    this.onSledecePitanje();
  }

  fiftyFifty() {
    console.log('click');

    // Provera da li ima više od dva tačna odgovora
    const tacniOdgovori = this.activeOdgovori.filter(
      (odgovor) => odgovor.odgovorTacan
    );
    if (tacniOdgovori.length > 2) {
      // Ako ima više od dva tačna odgovora, ne radi ništa
      return;
    }

    // Izaberi jedan tačan odgovor
    const tacanOdgovor = this.activeOdgovori.find(
      (odgovor) => odgovor.odgovorTacan
    );

    // Izaberi tri netacna odgovora
    const netacniOdgovori = this.activeOdgovori
      .filter((odgovor) => !odgovor.odgovorTacan)
      .slice(0, Math.ceil((this.activeOdgovori.length - 1) / 2));

    // Spoji tačan odgovor i tri netacna odgovora
    this.activeOdgovori = [tacanOdgovor, ...netacniOdgovori];
  }
  isFiftyFiftyDisabled(): boolean {
    const tacniOdgovori = this.activeOdgovori.filter(
      (odgovor) => odgovor.odgovorTacan
    );
    if (tacniOdgovori.length > 2 || this.activeOdgovori.length <= 2) {
      return true;
    }
    return false;
  }

  timer() {
    const interval = 1000;

    this.timerInterval = setInterval(() => {
      if (this.preostaloVreme > 0 && !this.krajKviza) {
        this.preostaloVreme--;
        console.log(this.preostaloVreme);
      } else {
        clearInterval(this.timerInterval);
        this.krajKviza = true;
        console.log('Vreme je isteklo!');
      }
    }, interval);
  }

  formatirajVreme(sekunde: number): string {
    const minuti = Math.floor(sekunde / 60);
    const sekundeRest = sekunde % 60;
    const formatiraniMinuti = minuti < 10 ? '0' + minuti : minuti;
    const formatiraneSekunde =
      sekundeRest < 10 ? '0' + sekundeRest : sekundeRest;
    return `${formatiraniMinuti}:${formatiraneSekunde}`;
  }

  sacuvajKviz() {
    let sacuvajZavKviz = new SacuvajZavrsenKviz();
    let zavKviz = new ZavrsenKviz();

    sacuvajZavKviz.user = this.user;
    sacuvajZavKviz.kviz = this.kviz;

    zavKviz.osvojeniBodovi = this.bodovi;
    zavKviz.preostaloVreme = this.preostaloVreme;

    sacuvajZavKviz.zavrsenKviz = zavKviz;

    this.zavrsenKvizService
      .sacuvajKviz(sacuvajZavKviz)
      .subscribe(() => console.log('sacuvalo se'));
  }

  sacuvajProgres() {
    let sacuvajProgres = new SacuvajKvizProgres();
    let progresKviz = new KvizProgres();

    sacuvajProgres.user = this.user;
    sacuvajProgres.kviz = this.kviz;

    progresKviz.vreme = this.preostaloVreme;
    progresKviz.bodovi = this.bodovi;
    progresKviz.odgovorenihPitanja = this.flag;

    sacuvajProgres.kvizProgres = progresKviz;

    this.sacuvProgresService
      .sacuvajProgres(sacuvajProgres)
      .subscribe(() => console.log('Progres sacuvan'));
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }
}
