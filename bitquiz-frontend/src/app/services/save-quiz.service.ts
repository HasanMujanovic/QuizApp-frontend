import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SacuvajKvizProgres } from '../common/sacuvaj-kviz-progres';

@Injectable({
  providedIn: 'root',
})
export class SaveQuizService {
  baseUrl = 'http://localhost:8080/bit';

  constructor(private http: HttpClient) {}

  sacuvajProgres(kviz: SacuvajKvizProgres) {
    const searchUrl = `${this.baseUrl}/kviz-progres/napravi`;
    return this.http.post<SacuvajKvizProgres>(searchUrl, kviz);
  }
}
