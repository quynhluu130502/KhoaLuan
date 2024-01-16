import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-internal-user',
  templateUrl: './internal-user.component.html',
  styleUrl: './internal-user.component.scss',
})
export class InternalUserComponent {
  displayedColumns: string[] = [
    'sso',
    'name',
    'email',
    'language',
    'role',
    'application',
    'last_login',
    'active',
    'action'
  ];
  users: User[] = [];
  constructor(
    private _userService: UserService,
    private _toast: ToastrService
  ) {
    this.getAllUsers();
  }
  public getAllUsers() {
    this._userService.getAllUsers().subscribe((data) => {
      this.users = data;
      console.log(data);
    });
  }
}
