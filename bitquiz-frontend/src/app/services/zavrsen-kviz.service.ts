import { Injectable } from '@angular/core';
import { SacuvajZavrsenKviz } from '../common/sacuvaj-zavrsen-kviz';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ZavrsenKvizService {
  baseUrl = 'http://localhost:8080/bit';

  constructor(private http: HttpClient) {}

  sacuvajKviz(kviz: SacuvajZavrsenKviz) {
    const napraviUrl = `${this.baseUrl}/zavrseni-kviz/napravi`;
    return this.http.post<SacuvajZavrsenKviz>(napraviUrl, kviz);
  }
}
