import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { UserService } from '../services/user.service';
import { QsaService } from '../services/qsa.service';
import { CreateInternalUserComponent } from '../qsa/create-internal-user/create-internal-user.component';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-internal-user',
  templateUrl: './internal-user.component.html',
  styleUrl: './internal-user.component.scss',
})
export class InternalUserComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private _userService: UserService,
    private _qsaService: QsaService,
    private _toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer,
    public editInternalUserDialog: MatDialog
  ) {
    this.getInternalUsers();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private modalService = inject(NgbModal);
  private subscription = new Subscription();
  userTable = new BehaviorSubject<any[]>([]);
  users = new MatTableDataSource<any>();
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

  ngOnInit(): void {
    this.subscription.add(
      this.userTable.subscribe((data) => {
        this.users.data = data;
      })
    );
  }

  ngAfterViewInit() {
    this.users.paginator = this.paginator;
    this.users.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public getInternalUsers() {
    this._qsaService.getInternalUsers().subscribe((res) => {
      if (res.result) {
        this.userTable.next(res.result);
        return;
      }
      this._toastr.error('Failed to get internal user');
    });
  }

  editInternalUser(user: any) {
    const dialogRef = this.editInternalUserDialog.open(
      CreateInternalUserComponent,
      {
        width: '75%',
        height: '75%',
        enterAnimationDuration: 500,
        exitAnimationDuration: 500,
        data: user,
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getInternalUsers();
      }
    });
  }

  removeInternalUser(user: any) {
    this._qsaService.removerInternalUser(user.sso).subscribe((res) => {
      if (res.result) {
        this.getInternalUsers();
        return;
      }
      this._toastr.error('Failed to remove internal user');
    });
  }
}
