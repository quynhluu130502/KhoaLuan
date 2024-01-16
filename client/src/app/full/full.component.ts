import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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
export class FullComponent {
  search: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  routerActive: string = 'activelink';

  sidebarMenu: sidebarMenu[] = [
    {
      link: '/home',
      icon: 'home',
      menu: 'Dashboard',
    },
    {
      link: '/forms',
      icon: 'layout',
      menu: 'Forms',
    },
    {
      link: '/alerts',
      icon: 'info',
      menu: 'Alerts',
    },
    {
      link: '/grid-list',
      icon: 'file-text',
      menu: 'Grid List',
    },
    {
      link: '/menu',
      icon: 'menu',
      menu: 'Menus',
    },
    {
      link: '/table',
      icon: 'grid',
      menu: 'Tables',
    },
    {
      link: '/tabs',
      icon: 'list',
      menu: 'Tabs',
    },
    {
      link: '/progress',
      icon: 'bar-chart-2',
      menu: 'Progress Bar',
    },
    {
      link: '/slide-toggle',
      icon: 'layers',
      menu: 'Slide Toggle',
    },
  ];
}
