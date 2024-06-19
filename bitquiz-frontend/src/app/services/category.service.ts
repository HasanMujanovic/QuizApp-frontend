import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Category } from '../Interface/category';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    const getUrl = `${environment.url}/categories`;

    return this.http.get<Category[]>(getUrl).pipe(
      catchError((error) => {
        console.error('Error while getting categories:', error);
        return of(null);
      })
    );
  }
}
