import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import {  Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
      username: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      password: new FormControl('', Validators.required),
    });
  }
  get username(): AbstractControl {
    return this.loginForm.get('username')!;
  }
  get password(): AbstractControl {
    return this.loginForm.get('password')!;
  }
  onFormSubmit(): void {
    if (this._auth.login(this.loginForm.value) === true) {
      this._toast.success('Đăng nhập thành công!', 'ĐĂNG NHẬP');
      this._router.navigate(['/qsa']);
    }
  }
}
