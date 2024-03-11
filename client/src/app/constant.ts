import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export {
  qsaMenu,
  ncgMenu,
  STAGE,
  handleError,
  handleSimpleError,
  columnChartOptions,
  pieChartOptions,
};

const qsaMenu = [
  {
    link: '/qsa/internal-user',
    icon: 'home',
    menu: 'Home',
  },
  {
    link: '/qsa/dashboard',
    icon: 'layout',
    menu: 'Dashboard',
  },
  {
    link: '/qsa/help',
    icon: 'package',
    menu: 'Contact',
  },
];

const ncgMenu = [
  {
    link: '/ncg/dashboard',
    icon: 'home',
    menu: 'Home',
  },
  {
    link: '/ncg/create-ncr',
    icon: 'package',
    menu: 'Create NC',
  },
  {
    link: '/ncg/ticket',
    icon: 'layout',
    menu: 'MY NCs',
  },
  {
    link: '/ncg/help',
    icon: 'info',
    menu: 'Help',
  },
];

const STAGE: { [key: string]: string } = {
  '0': 'Created',
  '1': 'Accepted',
  '2': 'Solved',
  '3': 'Closed',
  '-1': 'Cancelled',
};

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

const columnChartOptions: Highcharts.Options = {
  accessibility: {
    enabled: false,
  },
  chart: {
    type: 'column',
    backgroundColor: '#FFFFFF',
    // width: 400,
    // height: 200,
    plotBackgroundColor: undefined,
    plotBorderWidth: undefined,
    plotShadow: false,
  },
  legend: {
    floating: false,
    align: 'center',
    layout: 'horizontal',
    verticalAlign: 'bottom',
    width: 300,
    x: 0,
    y: 0,
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
  },
  credits: {
    enabled: false,
  },
};

const pieChartOptions: Highcharts.Options = {
  accessibility: {
    enabled: false,
  },
  chart: {
    type: 'pie',
    backgroundColor: '#FFFFFF',
    plotBackgroundColor: undefined,
    plotBorderWidth: undefined,
    plotShadow: false,
  },
  legend: {
    floating: false,
    align: 'center',
    layout: 'horizontal',
    verticalAlign: 'bottom',
    width: 300,
    x: 0,
    y: 0,
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        style: {
          color: 'black',
        },
      },
      showInLegend: true,
    },
  },
  credits: {
    enabled: false,
  },
};
