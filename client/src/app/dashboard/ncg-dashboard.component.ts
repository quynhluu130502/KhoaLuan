import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import * as Highcharts from 'highcharts';
import noData from 'highcharts/modules/no-data-to-display';
import { NcgService } from '../services/ncg.service';
import { pieChartOptions } from '../constant';

noData(Highcharts);

@Component({
  selector: 'app-ncg-dashboard',
  templateUrl: './ncg-dashboard.component.html',
  styleUrl: './ncg-dashboard.component.scss',
})
export class NcgDashboardComponent implements OnInit {
  constructor(private _ncgService: NcgService, public platform: Platform) {}

  @ViewChild('actionStatusChart') actionStatusChart!: Highcharts.Chart;

  item: string = 'me';
  openNCs: any[] = [];
  solvedNCs: any[] = [];
  onTimeNCs: any[] = [];
  overDueNCs: any[] = [];
  // Action's status chart
  notStartedActions: any[] = [];
  solvedActions: any[] = [];
  doneActions: any[] = [];
  cancelledActions: any[] = [];

  Highcharts: typeof Highcharts = Highcharts;

  pieChartOptions: Highcharts.Options = pieChartOptions;

  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartCallback: Highcharts.ChartCallbackFunction = function (
    chart: Highcharts.Chart
  ) {
    if (chart !== undefined) {
      return;
    }
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
          const dueDate = new Date(nc.dueDate);
          // Compare the due date with the current date and push the NC to the corresponding array
          if (new Date() > dueDate) {
            this.overDueNCs.push(nc);
          } else {
            this.onTimeNCs.push(nc);
          }
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
        name: 'Actions',
        data: [
          {
            name: 'Not Started',
            y: this.notStartedActions.length,
            color: '#FFC107',
          },
          {
            name: 'Solved',
            y: this.solvedActions.length,
            color: '#28A745',
          },
          {
            name: 'Done',
            y: this.doneActions.length,
            color: '#007BFF',
          },
          {
            name: 'Cancelled',
            y: this.cancelledActions.length,
            color: '#DC3545',
          },
        ],
      },
    ];
    this.updateFlag = true;
  }
}
