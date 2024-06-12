import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SaveQuizProgress } from '../Interface/save-quiz-progress';

@Injectable({
  providedIn: 'root',
})
export class SaveQuizService {
  constructor(private http: HttpClient) {}

  saveProgress(quiz: SaveQuizProgress): Observable<any> {
    const searchUrl = environment.url + `/quiz-progress/make`;
    return this.http.post<SaveQuizProgress>(searchUrl, quiz);
  }
}
