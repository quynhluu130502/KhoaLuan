import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}
  public getAllUsers(): Observable<User[]> { // Specify the type as User[]
    const headers: HttpHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: object = {
      headers: headers,
    };
    console.log(`${process.env['SERVER_URL']}/user`);
    return this._http.get<User[]>(`${process.env['SERVER_URL']}/user`, requestOptions); // Specify the type as User[]
  }
}
