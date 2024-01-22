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
}
