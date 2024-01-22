import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FullComponent } from './full/full.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { InternalUserComponent } from './internal-user/internal-user.component';
import { authGuard } from './auth.guard';
import { NonConformitiesComponent } from './non-conformities/non-conformities.component';
import { ncgMenu, qsaMenu } from './constant';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
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
    ],
  },
  {
    path: 'ncg',
    component: FullComponent,
    canActivate: [authGuard],
    data: ncgMenu,
    children: [
      { path: '', redirectTo: 'non-conformities', pathMatch: 'full' },
      { path: 'non-conformities', component: NonConformitiesComponent },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
