import { Component, Injector, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { MODALS } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
})
export class CreateUserComponent implements OnInit {
  constructor(
    private _toastr: ToastrService,
    private _router: Router,
    private _userService: UserService
  ) {}

  private modalService = inject(NgbModal);
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
    const newUser = this.registerForm.value as User;
    this._userService.createUser(newUser).subscribe((res) => {
      if (res.result) {
        this._toastr.success('User created successfully', 'Success');
        this.openConfirmModal().then((outcome) => {
          if (outcome) {
            this.registerForm.reset();
          }
        });
      }
    });
  }

  injector = Injector.create({
    providers: [
      {
        provide: 'modalData',
        useValue: {
          title: 'Are you sure you want to reset this form',
          object: 'Form',
          content: 'All information associated to this form will be reset.',
        },
      },
    ],
  });

  async openConfirmModal() {
    const modalRef = this.modalService.open(MODALS['focusFirst'], {
      injector: this.injector,
    });
    let outcome = false;
    try {
      outcome = await modalRef.result;
    } catch (reason: boolean | any) {
      outcome = reason;
    }
    return outcome;
  }
}
