import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, retry } from 'rxjs';
import { User } from '../models/user.model';
import { handleError } from '../constant';
import { environment } from 'src/environments/environment';

const headers: HttpHeaders = new HttpHeaders().set(
  'Content-Type',
  'application/json;charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}

  public getAllUsers(): Observable<User[]> {
    const requestOptions: object = {
      headers: headers,
    };
    return this._http
      .get<User[]>(`${environment.serverUrl}/user`, requestOptions)
      .pipe(
        map((res) => {
          return res as User[];
        }),
        retry(2),
        catchError(handleError)
      );
  }

  public getUserById(id: string): Observable<any> {
    const requestOptions: object = {
      headers: headers,
    };
    return this._http
      .post<any>(
        `${environment.serverUrl}/user/get`,
        {
          sso: id,
        },
        requestOptions
      )
      .pipe(
        map((res) => {
          return res as any;
        }),
        retry(2),
        catchError(handleError)
      );
  }

  public getNameOfUser(): Observable<string> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    const requestOptions: object = {
      headers: headers,
    };
    return this._http
      .get<string>(`${environment.serverUrl}/user/name`, requestOptions)
      .pipe(
        map((res) => {
          return res as string;
        }),
        retry(2),
        catchError(handleError)
      );
  }
}
