import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: any;
  constructor(private _router: Router, private _auth: AuthService) {}
  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  onFormSubmit(): void {
    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');
    if (this._auth.login(this.loginForm.value) === true) {
      this._router.navigate(['/dashboard']);
    }
  }
}
