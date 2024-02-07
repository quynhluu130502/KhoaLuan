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
  id: string = '';

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
  ngOnInit() {
    this._activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'];
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
      this._ncgService.getNC(this.id).subscribe((res) => {
        console.log(res);
        this.detailForm.patchValue(res.result[0]);
        this.investigationForm.patchValue(res.result[0]);
        this.stage.next(res.result[0].stage);
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
      console.log(this.investigationForm.value);
      this._ncgService
        .updateNC(this.investigationForm.value, this.id)
        .subscribe((res) => {
          console.log(res);
          if (res.result) {
            console.log(res.result);
            this.stepper.next();
          } else {
            this._toastr.error('Error', 'Error in updating the NCR');
            console.log(res.message);
          }
        });
    }
  }
}
