import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router, Data } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrl: './full.component.scss',
})
export class FullComponent implements OnInit {
  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _activatedRoute: ActivatedRoute,
    private _auth: AuthService,
    private _router: Router,
    private _userService: UserService,
    private _toastr: ToastrService,
    public profileDialog: MatDialog
  ) {}
  routerActive: string = 'activelink';
  sidebarMenu: sidebarMenu[] = [];
  isHandset$: Observable<boolean> = this._breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  username = '';

  ngOnInit(): void {
    this._activatedRoute.data.subscribe((data: Data) => {
      const sidebarMenu = Object.values(data);
      this.sidebarMenu = sidebarMenu as sidebarMenu[];
    });
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
}
