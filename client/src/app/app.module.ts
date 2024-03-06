import { NgModule, isDevMode } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GraduationThesisModule } from './modules/graduation-thesis/graduation-thesis.module';

import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { ToastrModule } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';

import { AppRoutingModule } from './app-routing.module';
import { FullComponent } from './full/full.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { InternalUserComponent } from './internal-user/internal-user.component';
import { CreateInternalUserComponent } from './qsa/create-internal-user/create-internal-user.component';
import { NonConformitiesComponent } from './non-conformities/non-conformities.component';
import { CreateNonConformitiesComponent } from './create-non-conformities/create-non-conformities.component';
import { RichTextComponent } from './rich-text/rich-text.component';
import { ProblemDescriptionDialogComponent } from './problem-description-dialog/problem-description-dialog.component';
import { DragDropFileUploadDirective } from './directives/drag-drop-file-upload.directive';
import { TableTicketComponent } from './table-ticket/table-ticket.component';
import { UserRoleCreateComponent } from './qsa/user-role-create/user-role-create.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NCRDetailComponent } from './ncg/ncr-detail/ncr-detail.component';
import { NonGaContainmentInvestigationComponent } from './ncg/non-ga/non-ga-containment-investigation/non-ga-containment-investigation.component';
import { NonGaNcDetailsComponent } from './ncg/non-ga/non-ga-nc-details/non-ga-nc-details.component';
import { ActionTableDialogComponent } from './ncg/action-table-dialog/action-table-dialog.component';
import { NcgDashboardComponent } from './dashboard/ncg-dashboard.component';
import { AttachmentComponent } from './attachment/attachment.component';
import { QsaDashboardComponent } from './qsa-dashboard/qsa-dashboard.component';
@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    RegisterComponent,
    LoginComponent,
    InternalUserComponent,
    CreateInternalUserComponent,
    NonConformitiesComponent,
    CreateNonConformitiesComponent,
    RichTextComponent,
    ProblemDescriptionDialogComponent,
    DragDropFileUploadDirective,
    TableTicketComponent,
    UserRoleCreateComponent,
    LandingPageComponent,
    NCRDetailComponent,
    NonGaContainmentInvestigationComponent,
    NonGaNcDetailsComponent,
    ActionTableDialogComponent,
    NcgDashboardComponent,
    AttachmentComponent,
    QsaDashboardComponent,
  ],
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    FeatherModule.pick(allIcons),
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true,
    }),
    QuillModule.forRoot(),
    GraduationThesisModule,
    AppRoutingModule,
  ],
  exports: [FeatherModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
