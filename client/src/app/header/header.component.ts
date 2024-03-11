import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _userService: UserService,
    private _toastr: ToastrService,
    public profileDialog: MatDialog
  ) {}

  @Input() isHandset$!: Observable<boolean>;
  @Output() toggleSidebar = new EventEmitter<void>();
  username = '';

  ngOnInit(): void {
    this._userService.getNameOfUser().subscribe((res: any) => {
      if (res.result) {
        this.username = res.result;
        return;
      }
      this._toastr.error('Error getting user name', 'ERROR');
    });
  }
  onLogout(): void {
    this._auth.logout().subscribe((res: any) => {
      if (res.result) {
        localStorage.removeItem('token');
        localStorage.removeItem('sso');
        this._router.navigate(['/login']);
      }
    });
  }

  onProfileClick() {
    const dialogRef = this.profileDialog.open(MyProfileComponent, {
      width: '75%',
      height: '62.5%',
      enterAnimationDuration: '225ms',
      exitAnimationDuration: '225ms',
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('result', result);
      }
    });
  }

  underDevelopment(): void {
    this._toastr.info('This feature is under development', 'INFO');
  }

  navigateToLandingPage() {
    this._router.navigate(['/']);
  }
}
