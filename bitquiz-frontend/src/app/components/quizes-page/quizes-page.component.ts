import { Component, OnInit } from '@angular/core';
import { KvizService } from '../../services/kviz.service';
import { Kviz } from '../../common/kviz';

@Component({
  selector: 'app-quizes-page',
  templateUrl: './quizes-page.component.html',
  styleUrl: './quizes-page.component.css',
})
export class QuizesPageComponent implements OnInit {
  kvizovi: Kviz[] = [];
  constructor(private kvizService: KvizService) {}

  ngOnInit(): void {
    this.getKvizove();
  }

  getKvizove() {
    this.kvizService.getKvizove().subscribe((data) => {
      this.kvizovi = data;
      console.log(this.kvizovi);
    });
  }
}
