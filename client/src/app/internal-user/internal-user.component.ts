import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-internal-user',
  templateUrl: './internal-user.component.html',
  styleUrl: './internal-user.component.scss',
})
export class InternalUserComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.users.paginator = this.paginator;
    this.users.sort = this.sort;
  }
  displayedColumns: string[] = [
    'sso',
    'name',
    'email',
    'language',
    'role',
    'application',
    'last_login',
    'active',
    'action',
  ];
  users = new MatTableDataSource<any>();
  constructor(
    private _userService: UserService,
    private _toast: ToastrService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.getAllUsers();
  }
  public getAllUsers() {
    this._userService.getAllUsers().subscribe((data) => {
      this.users.data = data;
    });
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
