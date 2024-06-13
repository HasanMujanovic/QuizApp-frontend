import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserToSave } from '../Interface/user-to-save';
import { User } from '../Interface/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  constructor(private http: HttpClient) {}

  getUser(email: string): Observable<User> {
    const searchUrl = `${environment.url}/user/getByEmail/${email}`;
    return this.http.get<User>(searchUrl);
  }

  getUserById(userId: number): Observable<User> {
    const searchUrl = `${environment.url}/user/getById/${userId}`;
    return this.http.get<User>(searchUrl);
  }

  saveUser(user: UserToSave): Observable<any> {
    const saveUrl = `${environment.url}/user/save`;
    return this.http.post<UserToSave>(saveUrl, user);
  }
  getUserToVerify(email: string): Observable<boolean> {
    const searchUrl = `${environment.url}/user/exists?email=${email}`;
    return this.http.get<boolean>(searchUrl);
  }

  checkIfUserExistsLogIn(email: string, password: string): Observable<boolean> {
    const url = `${environment.url}/user/checkUserLogIn`;
    return this.http.post<boolean>(url, { email, password });
  }

  editStatus(status: string, email: string): Observable<any> {
    const url = `${environment.url}/user/save-status/${status}/${email}`;

    return this.http.post<any>(url, null);
  }
}
