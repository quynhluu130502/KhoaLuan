import {
  Component,
  Inject,
  Input,
  OnInit,
  Optional,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserRoleCreateComponent } from '../user-role-create/user-role-create.component';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { QsaService } from '../../services/qsa.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-create-internal-user',
  templateUrl: './create-internal-user.component.html',
  styleUrl: './create-internal-user.component.scss',
  // providers: [
  //   { provide: MAT_DIALOG_DATA, useValue: {} }, // Provide a default value for MAT_DIALOG_DATA
  // ],
})
export class CreateInternalUserComponent implements OnInit {
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Optional() public dialogRef: MatDialogRef<CreateInternalUserComponent>,
    // @Optional() @Inject(BehaviorSubject<any[]>) public userTable: any,
    private _userService: UserService,
    private _qsaService: QsaService,
    private _toast: ToastrService
  ) {
    this._qsaService.getApplicationName().subscribe((res) => {
      this.applications = res;
      this.applications.forEach((application) => {
        application.selected = false;
      });
    });
  }

  @Input() userTable?: BehaviorSubject<any[]>; // This is the userTable from internal-user.component.ts
  @ViewChildren(UserRoleCreateComponent)
  userRoleComponents!: QueryList<UserRoleCreateComponent>;
  applications: any[] = [];
  userRoles = [
    {
      application: '',
      role: '',
      subBusiness: '',
      unit: '',
    },
  ]; // Start with one <app-user-role-create>

  ngOnInit() {
    if (this.dialogData !== null) {
      this.inforForm.patchValue({
        sso: this.dialogData.sso,
        email: this.dialogData.email,
        name: this.dialogData.name,
        job_function: this.dialogData.job_function,
        language: this.dialogData.language,
      });
      this.userRoles = this.dialogData.application;
    }
  }

  sso = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[1-9]\d{5}$/),
  ]);
  inforForm = new FormGroup({
    sso: this.sso,
    email: new FormControl({ value: '', disabled: false }, [
      Validators.required,
      Validators.email,
    ]),
    name: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
    job_function: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
    language: new FormControl('English'),
    application: new FormControl(),
  });

  getSSOErrorMessage() {
    if (this.sso.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.sso.hasError('pattern')) {
      return 'Not a valid SSO';
    }
    return '';
  }

  onSearch() {
    const sso: string | null = this.sso.value;
    if (sso !== null) {
      this._qsaService.isInternalUser(sso).subscribe((res) => {
        if (res.result) {
          this.inforForm.patchValue({
            email: res.result.email,
            name: res.result.name,
            job_function: res.result.job_function,
            language: res.result.language,
          });
          // Disable the input fields
          this.inforForm.get('email')?.disable();
          this.inforForm.get('name')?.disable();
          this.inforForm.get('job_function')?.disable();
          this.inforForm.get('language')?.disable();
          this._toast.success('Account ID found', 'RETRIEVE USER INFO');
          return;
        }
        this._toast.error(`${res.message}`, 'RETRIEVE USER INFO');
      });
    }
  }

  addUserRole() {
    this.userRoles.push({
      application: '',
      role: '',
      subBusiness: '',
      unit: '',
    });
  }

  removeUserRole(i: any) {
    this.applications.forEach((application) => {
      if (
        application.applicationCode ===
        this.userRoleComponents.get(i)?.applicationControl.value
      ) {
        application.selected = false;
      }
    });
    this.userRoles.splice(i, 1);
  }

  addRole() {
    const applicationRole: any[] = [];
    this.userRoleComponents.forEach((component) => {
      applicationRole.push(component.onSubmit());
    });
    this.inforForm.get('application')?.setValue(applicationRole);
    this._qsaService.addApps(this.inforForm.value).subscribe((res) => {
      if (res.result) {
        if (this.userTable) {
          const data = this.userTable.getValue();
          data.push(res.result);
          this.userTable.next(data);
        }
        if (this.dialogData !== null) {
          this.dialogData = this.inforForm.value;
        }
        this._toast.success('User role added successfully');
        return;
      }
    });
  }

  cancelClick() {
    this.dialogRef.close();
  }

  saveClick() {
    this.addRole();
    this.dialogRef.close(this.dialogData);
  }
}
