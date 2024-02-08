import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

const qsaMenu = [
  {
    link: '/qsa/internal-user',
    icon: 'home',
    menu: 'Internal User',
  },
  {
    link: '/qsa/internal-user',
    icon: 'layout',
    menu: 'In development',
  },
  {
    link: '/qsa/internal-user',
    icon: 'info',
    menu: 'In development',
  },
];
const ncgMenu = [
  {
    link: '/ncg/create-ncr',
    icon: 'home',
    menu: 'Create NC',
  },
  {
    link: '/ncg/ticket',
    icon: 'layout',
    menu: 'MY NCs',
  },
  {
    link: '/ncg/non-conformities',
    icon: 'info',
    menu: 'Help',
  },
];

const handleError = (err: HttpErrorResponse) => {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [];
};

const handleSimpleError = (err: HttpErrorResponse) => {
  return throwError(() => new Error(err.message));
};

export { qsaMenu, ncgMenu, handleError, handleSimpleError };
