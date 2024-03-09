import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import * as Highcharts from 'highcharts';
import noData from 'highcharts/modules/no-data-to-display';
import { NcgService } from '../services/ncg.service';
import { pieChartOptions, STAGE } from '../constant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

noData(Highcharts);

@Component({
  selector: 'app-ncg-dashboard',
  templateUrl: './ncg-dashboard.component.html',
  styleUrl: './ncg-dashboard.component.scss',
})
export class NcgDashboardComponent implements OnInit, AfterViewInit {
  constructor(
    private _ncgService: NcgService,
    private _liveAnnouncer: LiveAnnouncer,
    public platform: Platform
  ) {}

  @ViewChild('actionStatusChart') actionStatusChart!: Highcharts.Chart;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'NC_ID',
    'Activity',
    'Status',
    'Detected_By_Unit',
    'NC_Type',
  ];

  item: string = 'me';
  openNCs: any[] = [];
  solvedNCs: any[] = [];
  onTimeNCs: any[] = [];
  overDueNCs: any[] = [];
  // Action's status chart
  notStartedActions: any[] = [];
  inProgressActions: any[] = [];
  doneActions: any[] = [];
  // NC's stage chart
  ncStages: any = {};

  Highcharts: typeof Highcharts = Highcharts;

  actionStatusOptions: Highcharts.Options = pieChartOptions;
  ncStageOptions: Highcharts.Options = pieChartOptions;

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
    if (this.actionStatusOptions.legend) {
      if (this.platform.FIREFOX) {
        this.actionStatusOptions.legend.itemMarginTop = 6;
      } else if (this.platform.SAFARI) {
        this.actionStatusOptions.legend.itemMarginTop = 12.1;
      } else {
        this.actionStatusOptions.legend.itemMarginTop = 8.2;
      }
    }
    this.getNCs();
  }

  getNCs(): void {
    this._ncgService.getAllNCs().subscribe((res) => {
      this.dataSource.data = res;
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
            }
            if (action.status === 2) {
              this.inProgressActions.push(action);
            }
            if (action.status === 3) {
              this.doneActions.push(action);
            }
          });
        }
        if (this.ncStages[STAGE[nc.stage]] === undefined) {
          this.ncStages[STAGE[nc.stage]] = {
            name: STAGE[nc.stage],
            y: 1,
          };
        } else {
          this.ncStages[STAGE[nc.stage]].y++;
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
    this.actionStatusOptions = {
      ...this.actionStatusOptions,
      title: {
        text: 'Status of Actions',
      },
      tooltip: {
        pointFormat: '{point.name}: <b>{point.y} Actions</b>',
      },
    };
    this.actionStatusOptions.series = [
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
            name: 'In Progress',
            y: this.inProgressActions.length,
            color: '#28A745',
          },
          {
            name: 'Done',
            y: this.doneActions.length,
            color: '#007BFF',
          },
        ],
      },
    ];
    this.ncStageOptions = {
      ...this.ncStageOptions,
      title: {
        text: 'NC Stages',
      },
      tooltip: {
        pointFormat: '{point.name}: <b>{point.y} NCs</b>',
      },
    };
    this.ncStageOptions.series = [
      {
        type: 'pie',
        name: 'NCs',
        data: Object.values(this.ncStages),
      },
    ];
    this.updateFlag = true;
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
