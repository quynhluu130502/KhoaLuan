import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NcgService } from '../services/ncg.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table-ticket',
  templateUrl: './table-ticket.component.html',
  styleUrl: './table-ticket.component.scss',
})
export class TableTicketComponent implements OnInit, AfterViewInit {
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _ncgService: NcgService,
    private _router: Router,
    private _toastr: ToastrService
  ) {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // This code will run every time a navigation ends
        console.log('NavigationEnd');
      });
  }
  displayedColumns: string[] = [
    'NC_ID',
    'Detected_By_Unit',
    'Status',
    'Action_Plan_Due_Date',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this._ncgService.getMyNCs().subscribe((data) => {
      this.dataSource.data = data;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  exportMyNCToExcel() {
    this._ncgService.exportMyNCToExcel().subscribe((excel: any) => {
      const blob = new Blob([excel], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const today = new Date();
      link.href = url;
      link.download = `Non_Conformities_Report_${today.getDate()}_${
        today.getMonth() + 1
      }_${today.getFullYear()}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
