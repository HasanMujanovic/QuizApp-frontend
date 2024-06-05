import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizPlayingService } from '../../services/quiz-playing.service';
import { Kviz } from '../../common/kviz';
import { KvizService } from '../../services/kviz.service';
import { KvizPitanja } from '../../common/kviz-pitanja';
import { KvizOdgovori } from '../../common/kviz-odgovori';

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

  constructor(
    private route: ActivatedRoute,
    private kvizPlayService: QuizPlayingService,
    private kvizService: KvizService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const kvizId: number = +params.get('id');
      this.getKviz(kvizId);
      this.getPitanja(kvizId);
    });
    this.timer();
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

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  formatirajVreme(sekunde: number): string {
    const minuti = Math.floor(sekunde / 60);
    const sekundeRest = sekunde % 60;
    const formatiraniMinuti = minuti < 10 ? '0' + minuti : minuti;
    const formatiraneSekunde =
      sekundeRest < 10 ? '0' + sekundeRest : sekundeRest;
    return `${formatiraniMinuti}:${formatiraneSekunde}`;
  }
}
