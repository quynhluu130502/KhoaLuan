import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NcgService } from '../services/ncg.service';
import { Platform } from '@angular/cdk/platform';
import { columnChartOptions } from '../constant';
import * as Highcharts from 'highcharts';
// import IndicatorsCore from 'highcharts/indicators/indicators';
// import IndicatorZigzag from 'highcharts/indicators/zigzag';
// import Boost from 'highcharts/modules/boost';
// import noData from 'highcharts/modules/no-data-to-display';
// import More from 'highcharts/highcharts-more';
// import highchartsAccessibility from 'highcharts/modules/accessibility';
import { Observable, firstValueFrom, forkJoin, map } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Boost(Highcharts);
// More(Highcharts);
// noData(Highcharts);
// IndicatorsCore(Highcharts);
// IndicatorZigzag(Highcharts);
// highchartsAccessibility(Highcharts);

interface ChartSeries {
  type: string;
  name: string;
  data: number[];
}

@Component({
  selector: 'app-qsa-dashboard',
  templateUrl: './qsa-dashboard.component.html',
  styleUrl: './qsa-dashboard.component.scss',
})
export class QsaDashboardComponent implements OnInit, AfterViewInit {
  constructor(
    private _ncgService: NcgService,
    private _liveAnnouncer: LiveAnnouncer,
    public platform: Platform
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'creatorName',
    'id',
    'stage',
    'activity',
    'agingDate',
  ];

  numberOfCharts: number = 3;
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;
  detectionPhaseChartOptions: Highcharts.Options = columnChartOptions;
  productTypeChartOptions: Highcharts.Options = columnChartOptions;
  symptomCodeL0ChartOptions: Highcharts.Options = columnChartOptions;

  ngOnInit(): void {
    this.fetchChartsData();
    this.fetchTableData();
  }

  fetchChartsData(): void {
    const detectionPhaseCount$: Observable<ChartSeries[]> = this._ncgService
      .getCountOfEachDetectionPhase()
      .pipe(
        map((res: any) => {
          return Object.entries(res).map(([key, value]) => ({
            type: 'column',
            name: key,
            data: [value] as number[],
          }));
        })
      );

    const productTypeCount$: Observable<ChartSeries[]> = this._ncgService
      .getCountOfProductType()
      .pipe(
        map((res: any) => {
          return Object.entries(res).map(([key, value]) => ({
            type: 'column',
            name: key,
            data: [value] as number[],
          }));
        })
      );
    const symptomCodeL0Count$: Observable<ChartSeries[]> = this._ncgService
      .getCountOfSymptomCodeL0()
      .pipe(
        map((res: any) => {
          return Object.entries(res).map(([key, value]) => ({
            type: 'column',
            name: key,
            data: [value] as number[],
          }));
        })
      );

    forkJoin([
      detectionPhaseCount$,
      productTypeCount$,
      symptomCodeL0Count$,
    ]).subscribe((res: ChartSeries[][]) => {
      this.detectionPhaseChartOptions = {
        ...this.detectionPhaseChartOptions,
        title: {
          useHTML: true,
          text: 'Detection Phase in NCs',
          align: 'center',
        },
        subtitle: {
          text: 'Source: TrustMeBro Inc.',
          align: 'center',
        },
        xAxis: {
          categories: ['Phase Detection'],
          crosshair: true,
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Number of NCs',
          },
        },
        series: res[0] as Highcharts.SeriesOptionsType[],
      };

      this.productTypeChartOptions = {
        ...this.productTypeChartOptions,
        title: {
          text: 'Product Types in NCs',
        },
        xAxis: {
          categories: ['Product Types'],
          crosshair: true,
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Number of NCs',
          },
        },
        series: res[1] as Highcharts.SeriesOptionsType[],
      };

      this.symptomCodeL0ChartOptions = {
        ...this.symptomCodeL0ChartOptions,
        title: {
          useHTML: true,
          text: 'Symptpm Code L<sub>0</sub>',
          align: 'center',
        },
        subtitle: {
          text:
            'Source: ' +
            '<a href="https://energiogklima.no/klimavakten/land-med-hoyest-utslipp/"' +
            'target="_blank">Administrator</a>',
          align: 'center',
        },

        xAxis: {
          categories: ['Product Type'],
          crosshair: true,
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Number of NCs',
          },
        },
        series: res[2] as Highcharts.SeriesOptionsType[],
      };

      this.updateFlag = true;
    });
  }

  fetchTableData(): void {
    this._ncgService.getAllNCs().subscribe(async (res) => {
      for (const element of res) {
        const creatorName = await firstValueFrom(
          this._ncgService.getNameBySSO(element.creator)
        );
        element.creatorName = creatorName.result;
        element.agingDate = this.getAgingDate(element);
        if (element.stage === -1) {
          element.activity = 'Overdue';
          element.overDue = true;
        }
        if (element.stage === 3 && new Date(element.closedDate) < new Date()) {
          element.activity = 'On Time';
          element.overDue = false;
        }
        if (element.stage === 3 && new Date(element.closedDate) > new Date()) {
          element.activity = 'Overdue';
          element.overDue = true;
        }
        if (element.stage !== -1 && element.stage !== -3) {
          if (new Date(element.dueDate) < new Date()) {
            element.activity = 'Overdue';
            element.overDue = true;
          } else {
            element.activity = 'On Time';
            element.overDue = false;
          }
        }
      }
      this.dataSource.data = res;
    });
  }

  getAgingDate(element: any): number {
    const today = new Date();
    const createdDatedate = new Date(element.createdDate);
    let timeDiff = 0;
    if (element.stage === 0 || element.stage === 1) {
      timeDiff = Math.abs(today.getTime() - createdDatedate.getTime());
    }
    if (element.stage === 2) {
      const solvedDate = new Date(element.solvedDate);
      timeDiff = Math.abs(solvedDate.getTime() - createdDatedate.getTime());
    }
    if (element.stage === 3) {
      const closedDate = new Date(element.closedDate);
      timeDiff = Math.abs(closedDate.getTime() - createdDatedate.getTime());
    }
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
