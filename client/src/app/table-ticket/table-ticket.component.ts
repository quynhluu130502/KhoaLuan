import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NcgService } from '../services/ncg.service';

@Component({
  selector: 'app-table-ticket',
  templateUrl: './table-ticket.component.html',
  styleUrl: './table-ticket.component.css',
})
export class TableTicketComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'NC_ID',
    'Detected_By_Unit',
    'Status',
    'Action_Plan_Due_Date',
  ];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _ncgService: NcgService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this._ncgService.getMyNCs().subscribe((data) => {
      this.dataSource.data = data;
      console.log(data);
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
