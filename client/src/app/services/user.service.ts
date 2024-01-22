import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, retry } from 'rxjs';
import { User } from '../models/user.model';
import { handleError } from '../constant';

interface successfulResponse {
  user: User;
  message: string;
}

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
      .get<User[]>(`${process.env['SERVER_URL']}/user`, requestOptions)
      .pipe(
        map((res) => {
          return res as User[];
        }),
        retry(2),
        catchError(handleError)
      );
  }

  public getUserById(id: string): Observable<successfulResponse> {
    const requestOptions: object = {
      headers: headers,
    };
    return this._http
      .post<successfulResponse>(
        `${process.env['SERVER_URL']}/user/get`,
        {
          sso: id,
        },
        requestOptions
      )
      .pipe(
        map((res) => {
          return res as successfulResponse;
        }),
        retry(2),
        catchError(handleError)
      );
  }
}
