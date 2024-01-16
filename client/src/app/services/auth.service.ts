import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, retry } from 'rxjs';
import { User } from '../models/user.model';

interface successfulLogin {
  user: User;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn:boolean = false;
  constructor(private _http: HttpClient) {
    this.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  }

  handleError(err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', err.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${err.status}, body was: ${JSON.stringify(
          err.error
        )}`
      );
    }
    // Optionally return a default fallback value so app can continue (pick one)
    // which could be a default value
    // return Observable.of<any>({my: "default value..."});
    // or simply an empty observable
    return new Observable<successfulLogin>();
  }

  login(userInfor: object): Observable<successfulLogin> {
    return this._http
      .post<successfulLogin>(
        `${process.env['SERVER_URL']}/user/login`,
        userInfor
      )
      .pipe(
        map((res) => {
          return res as successfulLogin;
        }),
        retry(2),
        catchError(this.handleError)
      );
  }

  isAuthenticated(){
    return this.isLoggedIn;
  }
  changeAuthStatus(){
    this.isLoggedIn = !this.isLoggedIn;
  }
}
