import { Injectable } from '@angular/core';
import { SaveDoneQuiz } from '../common/save-done-quiz';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DoneQuizService {
  constructor(private http: HttpClient) {}

  saveQuiz(quiz: SaveDoneQuiz) {
    const makeUrl = `${environment.url}/done-quizes/make`;
    return this.http.post<SaveDoneQuiz>(makeUrl, quiz);
  }
}
