import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, retry } from 'rxjs';
import { handleError } from '../constant';
import { DetectedUnit } from '../models/detectedUnit';

@Injectable({
  providedIn: 'root',
})
export class NcgService {
  constructor(private _http: HttpClient) {}
  getDetectedUnits(): Observable<DetectedUnit[]> {
    return this._http
      .get(`${process.env['SERVER_URL']}/ncg/detectedUnits`)
      .pipe(
        map((res) => {
          return res as DetectedUnit[];
        }),
        retry(2),
        catchError(handleError)
      );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addFiles(formData: FormData): Observable<any> {
    return this._http
      .post('http://localhost:3000/ncg/upload', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(handleError));
  }
}
