import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NcgService } from '../services/ncg.service';

@Component({
  selector: 'app-ncg-dashboard',
  templateUrl: './ncg-dashboard.component.html',
  styleUrl: './ncg-dashboard.component.scss',
})
export class NcgDashboardComponent implements OnInit, AfterViewInit {
  constructor(
    private _ncgService: NcgService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'id',
    'activity',
    'stage',
    'detectedByUnit',
    'ncType',
  ];

  ngOnInit(): void {
    this._ncgService.getAllNCs().subscribe((res) => {
      res.forEach((element: any) => {
        if (element.stage === 3 || element.stage === -1) {
          element.activity = 'Overdue';
          element.overDue = true;
        } else {
          element.activity = 'On Time';
          element.overDue = false;
        }
      });
      this.dataSource.data = res;
    });
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
