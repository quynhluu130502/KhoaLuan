import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NcgService } from 'src/app/services/ncg.service';

@Component({
  selector: 'app-ncr-detail',
  templateUrl: './ncr-detail.component.html',
  styleUrl: './ncr-detail.component.scss',
})
export class NCRDetailComponent implements OnInit, OnDestroy {
  constructor(
    private _formBuilder: FormBuilder,
    private _ncgService: NcgService,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _toastr: ToastrService,
    private _router: Router
  ) {}

  @ViewChild(MatStepper) stepper!: MatStepper;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  private subscription = new Subscription();

  detailForm: FormGroup = this._formBuilder.group({});
  investigationForm: FormGroup = this._formBuilder.group({});
  actionsTable = new BehaviorSubject<any[]>([]);
  stepperForm = this._formBuilder.group({
    detailForm: this.detailForm,
    secondStep: this.investigationForm,
  });
  masterData$ = this._ncgService.getMasterData();
  stage = new BehaviorSubject<number>(0);
  dataLoadedCount = 0;
  totalComponents = 2;
  nc_id: string = '';
  nc_creator: string = '';
  noti: string = '';
  attachmentFiles = new BehaviorSubject<{ item: File; url: string }[]>([]);
  ngOnInit() {
    this._activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.nc_id = params['id'];
      }
    });
    this.subscription.add(
      this.stage.subscribe((stage) => {
        if (stage === -1) {
          this.noti = 'NCR Cancelled';
        } else {
          if (this.stepper) {
            const n = this.stepper.steps.length;
            for (let i = 0; i < n; i++) {
              if (i <= stage) {
                this.stepper.steps.toArray()[i].completed = true;
                this.stepper.steps.toArray()[i].editable = false;
              } else {
                this.stepper.steps.toArray()[i].completed = false;
                this.stepper.steps.toArray()[i].editable = true;
              }
            }
          }
        }
      })
    );
    this.detailForm.addControl(
      'attachment',
      new FormControl(this.attachmentFiles.value)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onDataLoaded(loaded: boolean) {
    if (loaded) {
      this.dataLoadedCount++;
    }
    if (this.dataLoadedCount === this.totalComponents) {
      this._ncgService.getNC(this.nc_id).subscribe((res) => {
        if (!res.result) {
          this._toastr.error('Error', 'Error in fetching the NCR');
          console.log(res.message);
          return;
        }
        this.detailForm.patchValue(res.result);
        this.investigationForm.patchValue(res.result);
        this.actionsTable.next(res.result.actions);
        this.stage.next(res.result.stage);
        this.attachmentFiles.next(res.result.attachment);
        this._ncgService.getNameBySSO(res.result.creator).subscribe((res) => {
          if (res.result) {
            this.nc_creator = res.result;
          }
        });
      });
    }
  }

  onCancel() {
    if (this.openConfirmToast()) {
      this._ncgService.cancelNC(this.nc_id).subscribe((res) => {
        if (res.result) {
          this._toastr.success('Success', 'NCR cancelled successfully');
        } else {
          this._toastr.error('Error', 'Error in cancelling the NCR');
          console.log(res.message);
        }
      });
    }
  }
  onClone() {
    if (!this.openConfirmToast()) return;
    this._ncgService
      .saveNC(this.combineForms(), this.nc_id)
      .subscribe((res) => {
        if (res.result) {
          this._ncgService.cloneNC(this.nc_id).subscribe((res) => {
            if (res.result) {
              this._toastr.success('Success', 'NCR cloned successfully');
              this._router.navigate(['/ncg/ncr-details/', res.result.id]);
            } else {
              this._toastr.error('Error', 'Error in cloning the NCR');
              console.log(res.message);
            }
          });
        } else {
          this._toastr.error('Error', 'Error in saving the NCR');
          console.log(res.message);
        }
      });
  }
  onBack() {
    if (!this.openConfirmToast()) return;
    if (this.stage.value < 1 || this.stage.value > 2) return;
    this._ncgService
      .backNC(this.combineForms(), this.nc_id)
      .subscribe((res) => {
        if (res.result) {
          this.stepper.previous();
          this._toastr.success('Success', 'NCR sent back successfully');
        } else {
          this._toastr.error('Error', 'Error in sending back the NCR');
          console.log(res.message);
        }
      });
  }
  onSave() {
    this._ncgService
      .saveNC(this.combineForms(), this.nc_id)
      .subscribe((res) => {
        if (res.result) {
          this._toastr.success('Success', 'NCR updated successfully');
        } else {
          this._toastr.error('Error', 'Error in updating the NCR');
          console.log(res.message);
        }
      });
  }
  onAccept() {
    if (this.stage.value === 0) {
      if (this.detailForm.invalid) return;
      this._ncgService
        .acceptNC(this.combineForms(), this.nc_id)
        .subscribe((res) => {
          if (res.result) {
            this.stepper.next();
            this._toastr.success('Success', 'NCR accepted successfully');
          } else {
            this._toastr.error('Error', 'Error in updating the NCR');
            console.log(res.message);
          }
        });
      return;
    }
    if (!this.formValid()) {
      this._toastr.error('Error', 'Please fill all the fields');
      return;
    }
    if (this.actionsTable.value.length === 0) {
      this._toastr.error(
        'Error',
        'Please add actions in Investigations and Solutions Table to proceed'
      );
      this.tabGroup.selectedIndex = 2;
      return;
    }
    // Stage 1 is Accepted
    if (this.stage.value === 1) {
      this._ncgService
        .solveNC(this.combineForms(), this.nc_id)
        .subscribe((res) => {
          if (res.result) {
            this.stepper.next();
            this._toastr.success('Success', 'NCR accepted successfully');
          } else {
            this._toastr.error('Error', 'Error in updating the NCR');
            console.log(res.message);
          }
        });
      return;
    }
    // Stage 2 is Solved
    if (this.stage.value === 2) {
      let allActionsClosed = true;
      this.actionsTable.value.forEach((action) => {
        if (action.status !== 3) {
          this._toastr.error(
            'Error',
            'Please close all actions before proceeding'
          );
          this.tabGroup.selectedIndex = 2;
          allActionsClosed = false;
          return;
        }
      });
      if (!allActionsClosed) return;
      this._ncgService
        .closeNC(this.combineForms(), this.nc_id)
        .subscribe((res) => {
          if (res.result) {
            this.stepper.next();
            this._toastr.success('Success', 'NCR closed successfully');
            this._router.navigate(['/ncg/ncr-details/', this.nc_id]);
          } else {
            this._toastr.error('Error', 'Error in closing the NCR');
            console.log(res.message);
          }
        });
      return;
    }
  }

  combineForms() {
    this.detailForm.controls['attachment'].setValue(this.attachmentFiles.value);
    this.investigationForm.controls['actions'].setValue(
      this.actionsTable.value
    );
    return {
      ...this.detailForm.value,
      ...this.investigationForm.value,
    };
  }

  formValid() {
    return this.detailForm.valid && this.investigationForm.valid;
  }

  openConfirmToast(): boolean {
    if (confirm('Are you sure you want to do that?')) {
      return true;
    }
    return false;
  }
}
