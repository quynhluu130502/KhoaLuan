import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { QsaService } from '../services/qsa.service';
import { UserRoleCreateComponent } from '../user-role-create/user-role-create.component';

@Component({
  selector: 'app-create-internal-user',
  templateUrl: './create-internal-user.component.html',
  styleUrl: './create-internal-user.component.scss',
})
export class CreateInternalUserComponent {
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
  constructor(
    private _user: UserService,
    private _toast: ToastrService,
    private _qsa: QsaService
  ) {
    this._qsa.getApplicationName().subscribe((res) => {
      this.applications = res;
      this.applications.forEach((application) => {
        application.selected = false;
      });
    });
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
      this._user.getUserById(sso).subscribe((res) => {
        if (res.user) {
          this.inforForm.patchValue({
            email: res.user.email,
            name: res.user.name,
            job_function: res.user.job_function,
            language: res.user.language,
          });
          this.userRoles = res.user.application as {
            application: string;
            role: string;
            subBusiness: string;
            unit: string;
          }[];
          // Disable the input fields
          this.inforForm.get('email')?.disable();
          this.inforForm.get('name')?.disable();
          this.inforForm.get('job_function')?.disable();
          this.inforForm.get('language')?.disable();
          this._toast.success('Tìm thấy SSO', 'TÌM KIẾM');
        } else {
          this._toast.error('Không tìm thấy SSO', 'TÌM KIẾM');
        }
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
    console.log();
    this._qsa.addApps(this.inforForm.value).subscribe((res) => {
      console.log(res);
    });
  }
}
