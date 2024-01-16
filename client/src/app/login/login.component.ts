import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  constructor(
    private _router: Router,
    private _auth: AuthService,
    private _toast: ToastrService
  ) {}
  ngOnInit() {
    this.loginForm = new FormGroup({
      sso: new FormControl('', [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.pattern('^[a-zA-Z0-9-]+$'),
      ]),
      pass: new FormControl('', Validators.required),
    });
  }
  get sso(): AbstractControl {
    return this.loginForm.get('sso')!;
  }
  get password(): AbstractControl {
    return this.loginForm.get('pass')!;
  }
  onFormSubmit(): void {
    if (this.sso.invalid || this.password.invalid) {
      this._toast.error('Vui lòng nhập đầy đủ thông tin!', 'ĐĂNG NHẬP');
      return;
    }
    this._auth.login(this.loginForm.value).subscribe((res) => {
      if (!res.user) {
        if (res.message === 'User not found') {
          this._toast.error('Tài khoản không tồn tại!', 'ĐĂNG NHẬP');
          return;
        } else {
          this._toast.error('Sai mật khẩu!', 'ĐĂNG NHẬP');
          return;
        }
      }
      this._auth.changeAuthStatus();
      sessionStorage.setItem('user', JSON.stringify(res.user));
      sessionStorage.setItem('isLoggedIn', 'true');
      this._toast.success('Đăng nhập thành công!', 'ĐĂNG NHẬP');
      this._router.navigate(['/qsa']);
    });
  }
}
