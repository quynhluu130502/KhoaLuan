import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
})
export class HelpComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private _toastr: ToastrService,
    private _userService: UserService
  ) {}
  helpForm: FormGroup = new FormGroup({});
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;
  display: google.maps.LatLngLiteral | undefined;
  ngOnInit() {
    this.helpForm = this.builder.group({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(formData: object) {
    if (this.helpForm.invalid) {
      this._toastr.error('Please fill all fields');
      return;
    }
    this._userService.sendContactForm(formData).subscribe({
      next: (res: any) => {
        if (res.result) {
          this._toastr.success('Message sent', 'Success');
          this.helpForm.reset();
          return;
        }
        this._toastr.error(`${res.message}`, 'Error sending message');
        return;
      },
      error: (err: any) => {
        this._toastr.error(`${err}`, 'Error sending message');
      },
    });
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.center = event.latLng.toJSON();
    }
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.display = event.latLng.toJSON();
    }
  }
}
