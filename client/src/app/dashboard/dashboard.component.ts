import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Highcharts from 'highcharts';
import IndicatorsCore from 'highcharts/indicators/indicators';
import IndicatorZigzag from 'highcharts/indicators/zigzag';
IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
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
      text: 'Browser market shares in January, 2018',
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
    series: [
      {
        type: 'pie',
        name: 'Brands',
        data: [
          {
            name: 'Chrome',
            y: 61.41,
          },
          {
            name: 'Internet Explorer',
            y: 11.84,
          },
          {
            name: 'Firefox',
            y: 10.85,
          },
          {
            name: 'Edge',
            y: 4.67,
          },
          {
            name: 'Safari',
            y: 4.18,
          },
          {
            name: 'Other',
            y: 2.61,
          },
        ],
      },
    ],
    credits: {
      enabled: false,
    },
  };
  barChartOptions: Highcharts.Options = {
    accessibility: {
      enabled: false,
    },
    chart: {
      type: 'bar',
      backgroundColor: '#FFFFFF',
      height: 400,
      plotBackgroundColor: undefined,
      plotBorderWidth: undefined,
      plotShadow: false,
    },
    title: {
      text: 'Fruit Consumption',
    },
    xAxis: {
      categories: ['Apples', 'Bananas', 'Oranges'],
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total fruit consumption',
      },
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
      series: {
        stacking: 'normal',
      },
    },
    series: [
      {
        type: 'bar',
        name: 'John',
        data: [5, 3, 4],
      },
      {
        type: 'bar',
        name: 'Jane',
        data: [2, 2, 3],
      },
      {
        type: 'bar',
        name: 'Joe',
        data: [3, 4, 4],
      },
    ],
    credits: {
      enabled: false,
    },
  };

  columnChartOptions: Highcharts.Options = {
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
    title: {
      text: 'Monthly Average Rainfall',
    },
    subtitle: {
      text: 'Source: WorldClimate.com',
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Rainfall (mm)',
      },
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
    series: [
      {
        type: 'column',
        name: 'Tokyo',
        data: [
          49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
          95.6, 54.4,
        ],
      },
      {
        type: 'column',
        name: 'New York',
        data: [
          83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6,
          92.3,
        ],
      },
      {
        type: 'column',
        name: 'London',
        data: [
          48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3,
          51.2,
        ],
      },
      {
        type: 'column',
        name: 'Berlin',
        data: [
          42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8,
          51.1,
        ],
      },
    ],
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

  item: string = 'me';

  constructor() {}

  ngOnInit(): void {
    console;
  }

  onItemHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    target.style.cursor = 'pointer';
  }

  onItemClick(event: MouseEvent, item: string): void {
    this.item = item;
  }
}
