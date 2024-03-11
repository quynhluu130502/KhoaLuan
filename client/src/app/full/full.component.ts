import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Data } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';

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
    private _activatedRoute: ActivatedRoute
  ) {}

  @ViewChild('drawer') drawer!: MatSidenav;
  routerActive: string = 'activelink';
  sidebarMenu: sidebarMenu[] = [];
  isHandset$: Observable<boolean> = this._breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this._activatedRoute.data.subscribe((data: Data) => {
      const sidebarMenu = Object.values(data);
      this.sidebarMenu = sidebarMenu as sidebarMenu[];
    });
  }

  toggleSidebar() {
    // mat-sidenav will be toggled based on the drawer variable and a overlay will be shown on the content
    this.drawer.toggle();
  }
}
