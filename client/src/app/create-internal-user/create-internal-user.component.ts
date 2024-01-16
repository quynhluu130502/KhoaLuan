import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-internal-user',
  templateUrl: './create-internal-user.component.html',
  styleUrl: './create-internal-user.component.scss',
})
export class CreateInternalUserComponent {
  constructor(private _user: UserService, private _toast: ToastrService) {}
  sso = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[1-9]\d{5}$/),
  ]);
  inforForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.email,
    ]),
    name: new FormControl({ value: '', disabled: true }, [Validators.required]),
    job_function: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    language: new FormControl('English'),
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
          console.log(res.user);
          this.inforForm.patchValue({
            email: res.user.email,
            name: res.user.name,
            job_function: res.user.job_function,
            language: res.user.language,
          });
          this._toast.success('Tìm thấy SSO', 'TÌM KIẾM');
        } else {
          this._toast.error('Không tìm thấy SSO', 'TÌM KIẾM');
        }
      });
    }
  }
}
