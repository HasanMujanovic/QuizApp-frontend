import { Injectable } from '@angular/core';
import { KvizPitanja } from '../common/kviz-pitanja';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { KvizOdgovori } from '../common/kviz-odgovori';

@Injectable({
  providedIn: 'root',
})
export class QuizPlayingService {
  baseUrl = 'http://localhost:8080/bit';
  constructor(private http: HttpClient) {}

  getPitanja(id: number): Observable<KvizPitanja[]> {
    const pitanjaUrl = `http://localhost:8080/bit/kvizovi/${id}/pitanja`;

    return this.http
      .get<getPitanje>(pitanjaUrl)
      .pipe(map((res) => res._embedded.kvizPitanjas));
  }
  getOdgovori(id: number) {
    const odgovoriUrl = `http://localhost:8080/bit/kviz-pitanja/${id}/odgovori`;

    return this.http
      .get<getOdgovori>(odgovoriUrl)
      .pipe(map((res) => res._embedded.kvizOdgovoris));
  }
}

interface getPitanje {
  _embedded: {
    kvizPitanjas: KvizPitanja[];
  };
}

interface getOdgovori {
  _embedded: {
    kvizOdgovoris: KvizOdgovori[];
  };
}
