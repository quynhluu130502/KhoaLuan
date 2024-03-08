import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QsaService } from '../../services/qsa.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-user-role-create',
  templateUrl: './user-role-create.component.html',
  styleUrl: './user-role-create.component.scss',
})
export class UserRoleCreateComponent implements OnInit, OnChanges {
  @Input() applications: any;
  @Input() userRole: any;
  @Output() remove = new EventEmitter<void>();
  applicationControl = new FormControl('', [Validators.required]);
  roleControl = new FormControl('', [Validators.required]);
  roles: any[] = [];
  subBusinessControl = new FormControl('', [Validators.required]);
  subBusinesses: any[] = [];
  unitControl = new FormControl('', [Validators.required]);
  units: any[] = [];
  roleForm = new FormGroup({
    application: this.applicationControl,
    role: this.roleControl,
    subBusiness: this.subBusinessControl,
    unit: this.unitControl,
  });

  constructor(private _qsa: QsaService) {}
  ngOnInit(): void {
    this.applicationControl.valueChanges.subscribe((res) => {
      if (res) {
        this._qsa.getApplicationRole('nc').subscribe((res) => {
          this.roles = res;
        });
      }
    });
    this.roleControl.valueChanges.subscribe((res: any) => {
      if (res) {
        this._qsa.getApplicationSubBusiness('nc').subscribe((res) => {
          this.subBusinesses = res;
        });
      }
    });
    this.subBusinessControl.valueChanges.subscribe((res: any) => {
      if (res) {
        this._qsa.getApplicationUnit('nc', res).subscribe((res) => {
          this.units = res;
        });
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['userRole'] && changes['userRole'].currentValue) {
      if (this.userRole.application) {
        this._qsa.getApplicationRole('nc').subscribe((res) => {
          this.roles = res;
        });
        this._qsa.getApplicationSubBusiness('nc').subscribe((res) => {
          this.subBusinesses = res;
        });
        this._qsa
          .getApplicationUnit('nc', this.userRole.subBusiness)
          .subscribe((res) => {
            this.units = res;
          });
        this.applicationControl.setValue(this.userRole.application, {
          emitEvent: true,
        });
        this.roleControl.setValue(this.userRole.role, { emitEvent: true });
        this.subBusinessControl.setValue(this.userRole.subBusiness, {
          emitEvent: true,
        });
        this.unitControl.setValue(this.userRole.unit);
      }
    }
  }
  onSubmit() {
    return this.roleForm.value;
  }
  onSelected(index: any) {
    this.applications[index].selected = !this.applications[index].selected;
  }

  previousValue: any;

  onSelectionChange(event: MatSelectChange) {
    if (this.previousValue) {
      this.applications.forEach((app: any) => {
        if (app.applicationCode === this.previousValue) {
          app.selected = false;
        }
      });
    }
    this.previousValue = event.value;
  }
}
