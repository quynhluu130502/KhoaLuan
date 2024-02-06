import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NcgService } from 'src/app/services/ncg.service';

@Component({
  selector: 'app-ncr-detail',
  templateUrl: './ncr-detail.component.html',
  styleUrl: './ncr-detail.component.scss',
})
export class NCRDetailComponent {
  firstFormGroup = this._formBuilder.group({});
  secondFormGroup = this._formBuilder.group({});
  thirdFormGroup = this._formBuilder.group({});
  fourthFormGroup = this._formBuilder.group({});
  stepperForm = this._formBuilder.group({
    firstFormGroup: this.firstFormGroup,
    secondStep: this.secondFormGroup,
    thirdStep: this.thirdFormGroup,
    fourthStep: this.fourthFormGroup,
  });
  firstFormData = new BehaviorSubject<any>(null);

  masterData$ = this._ncgService.getMasterData();
  stage: number = 2;
  constructor(
    private _formBuilder: FormBuilder,
    private _ncgService: NcgService,
    private _activatedRoute: ActivatedRoute
  ) {
    this._activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this._ncgService.getNCR(params['id']).subscribe((res) => {
          console.log(res);
          this.firstFormData.next(res.result[0]);
          this.stage = res.result[0].stage;
        });
      }
    });
  }

  onCancel() {}
  onClone() {}
  onBack() {}
  onSave() {}
  onAcept() {}
}
