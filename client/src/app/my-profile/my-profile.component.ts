import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<MyProfileComponent>,
    private _authService: AuthService
  ) {}

  displayedColumns: string[] = ['business', 'application', 'role'];
  dataSource = new MatTableDataSource<any>();
  profileForm = new FormGroup({
    accountId: new FormControl({ value: '', disabled: true }),
    fullName: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
  });
  currentUser = new User();

  ngOnInit(): void {
    this.currentUser = this._authService.currentUser;
    this.profileForm.patchValue({
      accountId: this.currentUser.sso.toString(),
      fullName: this.currentUser.name,
      email: this.currentUser.email,
    });
    this.dataSource.data = this.currentUser.application;
  }

  closeClick() {
    this.dialogRef.close();
  }
}
