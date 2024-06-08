import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaveQuizProgress } from '../common/save-quiz-progress';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SaveQuizService {
  constructor(private http: HttpClient) {}

  saveProgress(quiz: SaveQuizProgress) {
    const searchUrl = environment.url + `/quiz-progress/make`;
    return this.http.post<SaveQuizProgress>(searchUrl, quiz);
  }
}
