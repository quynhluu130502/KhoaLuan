import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import * as Highcharts from 'highcharts';
import IndicatorsCore from 'highcharts/indicators/indicators';
import IndicatorZigzag from 'highcharts/indicators/zigzag';
import Boost from 'highcharts/modules/boost';
import noData from 'highcharts/modules/no-data-to-display';
import More from 'highcharts/highcharts-more';
import { NcgService } from '../services/ncg.service';

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  constructor(private _ncgService: NcgService, public platform: Platform) {}

  @ViewChild('chart') chart: any;

  item: string = 'me';
  openNCs: any[] = [];
  solvedNCs: any[] = [];
  notStartedActions: any[] = [];
  solvedActions: any[] = [];
  doneActions: any[] = [];
  cancelledActions: any[] = [];

  Highcharts: typeof Highcharts = Highcharts;
  pieChartOptions: Highcharts.Options = {
    accessibility: {
      enabled: false,
    },
    chart: {
      type: 'pie',
      backgroundColor: '#FFFFFF',
      // width: 400,
      // height: 200,
      plotBackgroundColor: undefined,
      plotBorderWidth: undefined,
      plotShadow: false,
    },
    title: {
      text: 'Status of Actions',
    },
    tooltip: {
      pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>',
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

  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {
    console.log(chart);
  }; // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  ngOnInit(): void {
    if (this.pieChartOptions.legend) {
      if (this.platform.FIREFOX) {
        this.pieChartOptions.legend.itemMarginTop = 6;
      } else if (this.platform.SAFARI) {
        this.pieChartOptions.legend.itemMarginTop = 12.1;
      } else {
        this.pieChartOptions.legend.itemMarginTop = 8.2;
      }
    }
    this.getNCs();
  }

  getNCs(): void {
    this._ncgService.getMyNCs().subscribe((res) => {
      res.forEach((nc: any) => {
        // Define the status of the NC
        if (nc.stage === 3) {
          this.solvedNCs.push(nc);
        } else if (nc.stage !== -1) {
          this.openNCs.push(nc);
        }
        // Define the status of the actions
        if (nc.actions.length != 0) {
          nc.actions.forEach((action: any) => {
            if (action.status === 1) {
              this.notStartedActions.push(action);
            } else if (action.status === 2) {
              this.solvedActions.push(action);
            } else if (action.status === 3) {
              this.doneActions.push(action);
            } else if (action.status === 4) {
              this.cancelledActions.push(action);
            }
          });
        }
      });
      // Update the pie chart
      this.handleUpdate();
    });
  }

  onItemHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    target.style.cursor = 'pointer';
  }

  onItemClick(event: MouseEvent, item: string): void {
    this.item = item;
  }

  handleUpdate() {
    this.pieChartOptions.series = [
      {
        type: 'pie',
        name: 'Status',
        data: [
          { name: 'Not Started Actions', y: this.notStartedActions.length },
          { name: 'Solved Actions', y: this.solvedActions.length },
          { name: 'Done Actions', y: this.doneActions.length },
          { name: 'Cancelled Actions', y: this.cancelledActions.length },
        ],
      },
    ];
    this.updateFlag = true;
  }
}
