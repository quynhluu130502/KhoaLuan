import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
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
    private _activatedRoute: ActivatedRoute,
    private _toastr: ToastrService
  ) {}

  @ViewChild(MatStepper) stepper!: MatStepper;
  private subscription = new Subscription();

  detailForm: FormGroup = this._formBuilder.group({});
  investigationForm: FormGroup = this._formBuilder.group({});
  dataSource = new MatTableDataSource<any>();
  thirdFormGroup: FormGroup = this._formBuilder.group({});
  fourthFormGroup: FormGroup = this._formBuilder.group({});
  stepperForm = this._formBuilder.group({
    detailForm: this.detailForm,
    secondStep: this.investigationForm,
    thirdStep: this.thirdFormGroup,
    fourthStep: this.fourthFormGroup,
  });
  masterData$ = this._ncgService.getMasterData();
  stage = new BehaviorSubject<number>(0);
  dataLoadedCount = 0;
  totalComponents = 2;
  nc_id: string = '';
  nc_creator: string = '';
  attachmentFiles = new BehaviorSubject<any[]>([]);
  ngOnInit() {
    this._activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.nc_id = params['id'];
      }
    });
    this.subscription.add(
      this.stage.subscribe((stage) => {
        if (this.stepper) {
          for (let i = 0; i < this.stepper.steps.length; i++) {
            if (i < stage) {
              this.stepper.steps.toArray()[i].completed = true;
              this.stepper.steps.toArray()[i].editable = false;
            } else {
              this.stepper.steps.toArray()[i].completed = false;
              this.stepper.steps.toArray()[i].editable = true;
            }
          }
        }
      })
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

  onCancel() {}
  onClone() {}
  onBack() {}
  onSave() {
    console.log(this.investigationForm.value);
  }
  onAccept() {
    if (this.stage.value === 1) {
      this.investigationForm.controls['actions'].setValue(this.dataSource.data);
      const mergedValues = {
        ...this.investigationForm.value,
        ...this.detailForm.value,
      };
      this._ncgService.updateNC(mergedValues, this.nc_id).subscribe((res) => {
        if (res.result) {
          this.stepper.next();
        } else {
          this._toastr.error('Error', 'Error in updating the NCR');
          console.log(res.message);
        }
      });
    }
  }
}
