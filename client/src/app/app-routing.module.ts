import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FullComponent } from './full/full.component';
import { InternalUserComponent } from './internal-user/internal-user.component';
import { authGuard } from './auth.guard';
import { NonConformitiesComponent } from './non-conformities/non-conformities.component';
import { ncgMenu, qsaMenu } from './constant';
import { TableTicketComponent } from './table-ticket/table-ticket.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NCRDetailComponent } from './ncg/ncr-detail/ncr-detail.component';
import { NcgDashboardComponent } from './ncg-dashboard/ncg-dashboard.component';
import { QsaDashboardComponent } from './qsa-dashboard/qsa-dashboard.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'qsa',
    component: FullComponent,
    canActivate: [authGuard],
    data: qsaMenu,
    children: [
      { path: '', redirectTo: 'internal-user', pathMatch: 'full' },
      { path: 'internal-user', component: InternalUserComponent },
      { path: 'dashboard', component: QsaDashboardComponent },
    ],
  },
  {
    path: 'ncg',
    component: FullComponent,
    canActivate: [authGuard],
    data: ncgMenu,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: NcgDashboardComponent },
      { path: 'create-ncr', component: NonConformitiesComponent },
      { path: 'ncr-details/:id', component: NCRDetailComponent },
      {
        path: 'ticket',
        component: TableTicketComponent,
        canActivate: [authGuard],
        runGuardsAndResolvers: 'always',
      },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
