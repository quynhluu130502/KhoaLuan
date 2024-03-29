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
  rememberMeControl = new FormControl(false);
  constructor(
    private _router: Router,
    private _auth: AuthService,
    private _toastr: ToastrService
  ) {}
  ngOnInit() {
    this._auth.getProtected().subscribe((res: any) => {
      if (res.result) {
        this._router.navigate(['']);
      }
    });
    this.loginForm = new FormGroup({
      sso: new FormControl('', [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.pattern('^[a-zA-Z0-9-]+$'),
      ]),
      pass: new FormControl('', Validators.required),
    });
    if (localStorage.getItem('sso')) {
      this.rememberMeControl.setValue(true);
      this.sso.setValue(JSON.parse(localStorage.getItem('sso')!) || '');
    }
  }
  get sso(): AbstractControl {
    return this.loginForm.get('sso')!;
  }
  get password(): AbstractControl {
    return this.loginForm.get('pass')!;
  }
  onFormSubmit(): void {
    if (this.sso.invalid || this.password.invalid) {
      this._toastr.error('Please fill in all fields!', 'LOGIN');
      return;
    }
    this._auth.login(this.loginForm.value).subscribe((res) => {
      if (!res.user) {
        if (res.message === 'User not found') {
          this._toastr.error('User not found!', 'LOGIN');
          return;
        } else {
          this._toastr.error('Wrong password!', 'LOGIN');
          return;
        }
      }
      localStorage.setItem('token', res.token);
      if (this.rememberMeControl.value === true) {
        localStorage.setItem('sso', JSON.stringify(res.user.sso));
      }
      this._toastr.success('Login successful!', 'LOGIN');
      this._router.navigate(['/']);
    });
  }
}
