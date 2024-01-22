import { NgModule, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GraduationThesisModule } from './graduation-thesis/graduation-thesis.module';

import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { ToastrModule } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill'

import { AppRoutingModule } from './app-routing.module';
import { FullComponent } from './full/full.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { InternalUserComponent } from './internal-user/internal-user.component';
import { CreateInternalUserComponent } from './create-internal-user/create-internal-user.component';
import { NonConformitiesComponent } from './non-conformities/non-conformities.component';
import { CreateNonConformitiesComponent } from './create-non-conformities/create-non-conformities.component';
import { RichTextComponent } from './rich-text/rich-text.component';
import { ProblemDescriptionDialogComponent } from './problem-description-dialog/problem-description-dialog.component';
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
    ProblemDescriptionDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule, // required animations module
    NgbModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
