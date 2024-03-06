import { Component, OnInit } from '@angular/core';
import { NcgService } from '../services/ncg.service';
import { Platform } from '@angular/cdk/platform';
import {
  areaChartOptions,
  barChartOptions,
  columnChartOptions,
} from '../constant';
import * as Highcharts from 'highcharts';
// import IndicatorsCore from 'highcharts/indicators/indicators';
// import IndicatorZigzag from 'highcharts/indicators/zigzag';
// import Boost from 'highcharts/modules/boost';
// import noData from 'highcharts/modules/no-data-to-display';
// import More from 'highcharts/highcharts-more';
// import highchartsAccessibility from 'highcharts/modules/accessibility';
import { forkJoin, map } from 'rxjs';

// Boost(Highcharts);
// More(Highcharts);
// noData(Highcharts);
// IndicatorsCore(Highcharts);
// IndicatorZigzag(Highcharts);
// highchartsAccessibility(Highcharts);

@Component({
  selector: 'app-qsa-dashboard',
  templateUrl: './qsa-dashboard.component.html',
  styleUrl: './qsa-dashboard.component.scss',
})
export class QsaDashboardComponent implements OnInit {
  constructor(private _ncgService: NcgService, public platform: Platform) {}

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;

  numberOfCharts: number = 3;
  barChartOptions: Highcharts.Options = barChartOptions;
  columnChartOptions: Highcharts.Options = columnChartOptions;
  areaChartOptions: Highcharts.Options = areaChartOptions;

  // Detection Phase chart
  detectionPhaseCount: any[] = [];

  // Product's Types chart
  productTypeCount: any[] = [];

  // Symptom Code L0 chart
  symptomCodeL0Count: any[] = [];

  ngOnInit(): void {
    const detectionPhaseCount$ = this._ncgService
      .getCountOfEachDetectionPhase()
      .pipe(
        map((res: any) => {
          return Object.entries(res).map(([key, value]) => ({
            type: 'bar',
            name: key,
            data: [value],
          }));
        })
      );

    const productTypeCount$ = this._ncgService.getCountOfProductType().pipe(
      map((res: any) => {
        return Object.entries(res).map(([key, value]) => ({
          type: 'column',
          name: key,
          data: [value],
        }));
      })
    );
    const symptomCodeL0Count$ = this._ncgService.getCountOfSymptomCodeL0().pipe(
      map((res: any) => {
        return Object.entries(res).map(([key, value]) => ({
          type: 'column',
          name: key,
          data: [value],
        }));
      })
    );

    forkJoin([
      detectionPhaseCount$,
      productTypeCount$,
      symptomCodeL0Count$,
    ]).subscribe((res: any[]) => {
      this.barChartOptions.series = res[0];
      this.columnChartOptions.series = res[1];
      this.areaChartOptions.series = res[2];
      this.updateFlag = true;
    });
  }
}
