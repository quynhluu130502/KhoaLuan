import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  routerActive: string = 'activelink';
  sidebarMenu: sidebarMenu[] = [];
  isHandset$: Observable<boolean> = this._breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _activatedRoute: ActivatedRoute,
    private _auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._activatedRoute.data.subscribe((data: Data) => {
      const sidebarMenu = Object.values(data);
      this.sidebarMenu = sidebarMenu as sidebarMenu[];
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
}
