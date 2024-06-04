import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Kviz } from '../common/kviz';
import { Observable, map } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { NapraviKviz } from '../common/napravi-kviz';

@Injectable({
  providedIn: 'root',
})
export class KvizService {
  baseUrl = 'http://localhost:8080/bit';
  searchUrl = this.baseUrl + '/kvizovi';
  kvizInfo: Kviz;

  constructor(private http: HttpClient) {}

  getKvizove(): Observable<Kviz[]> {
    return this.http
      .get<getKviz>(this.searchUrl)
      .pipe(map((res) => res._embedded.kvizes));
  }

  getSingleKviz(id: number): Observable<Kviz> {
    const kvizById = this.searchUrl + `/${id}`;
    return this.http.get<Kviz>(this.searchUrl);
  }

  napraviKviz(napraviKviz: NapraviKviz) {
    const napraviUrl = 'http://localhost:8080/bit/napravi-kviz/napravi';
    return this.http.post<NapraviKviz>(napraviUrl, napraviKviz);
  }
}
interface getKviz {
  _embedded: {
    kvizes: Kviz[];
  };
}
