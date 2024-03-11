import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
})
export class CreateUserComponent implements OnInit {
  constructor(private _toastr: ToastrService, private _router: Router) {}
  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    language: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    pass: new FormControl('', Validators.required),
    job_function: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.registerForm.patchValue({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      language: 'English',
      role: 'admin',
      pass: '123456',
      job_function: 'Developer',
    });
    this._toastr.success('Chào em yêu', 'Hello');
  }

  onSubmit() {
    console.log(this.registerForm.value);
  }
}
