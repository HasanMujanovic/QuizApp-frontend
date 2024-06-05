import { Component, OnInit } from '@angular/core';
import { Kviz } from '../../common/kviz';
import { KvizService } from '../../services/kviz.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrl: './quiz-details.component.css',
})
export class QuizDetailsComponent implements OnInit {
  kviz: Kviz = new Kviz();

  constructor(
    private kvizService: KvizService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getKviz();
    });
  }

  getKviz() {
    const kvizId: number = +this.route.snapshot.paramMap.get('id');

    this.kvizService
      .getSingleKviz(kvizId)
      .subscribe((data) => (this.kviz = data));
  }
}
