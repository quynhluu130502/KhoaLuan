import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { NcgService } from '../services/ncg.service';
import { Observable, defaultIfEmpty, map, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProblemDescriptionDialogComponent } from '../problem-description-dialog/problem-description-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-non-conformities',
  templateUrl: './create-non-conformities.component.html',
  styleUrl: './create-non-conformities.component.css',
})
export class CreateNonConformitiesComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  // NC Type
  ncTypeControl = new FormControl('factory internal', Validators.required);

  // Detected by unit
  detectedByUnitControl = new FormControl<string | any>(
    '',
    Validators.required
  );
  detectedByUnits: any[] = [];
  filteredDetectedByUnit: Observable<any[]> = new Observable<any[]>();

  // Detection Date
  detectionDateControl = new FormControl(new Date(), Validators.required);
  maxDetectionDate = new Date();

  // Problem Title
  problemTitle = new FormControl('', Validators.required);

  // Problem Description
  problemDescription = new FormControl('', Validators.required);
  files: { item: File; url: string }[] = [];
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this.problemDescriptionDialog.open(
      ProblemDescriptionDialogComponent,
      {
        width: '75%',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          description: this.problemDescription.value,
          files: this.files,
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.files = result.files;
        this.problemDescription.setValue(result.description);
      }
    });
  }
  sanitize(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }
  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  // Contaiment
  contaiment = new FormControl('');

  // Project Number
  projectNumberControl = new FormControl('');

  // Project Name
  projectNameControl = new FormControl('');

  // Defective Quantity
  defectiveQuantityControl = new FormControl('', Validators.required);

  // Defective unit
  defectiveUnitControl = new FormControl<string | any>('', Validators.required);
  defectiveUnits: any[] = [];
  filteredDefectiveUnit: Observable<any[]> = new Observable<any[]>();

  // Product Type
  productTypeControl = new FormControl<string | any>('', Validators.required);
  productTypes: any[] = [];
  filteredProductType: Observable<any[]> = new Observable<any[]>();

  // Device
  deviceControl = new FormControl<string | any>('', Validators.required);
  device: any[] = [];
  filteredDevice: Observable<any[]> = new Observable<any[]>();

  // Symptom Code L0
  symptomCodeL0Control = new FormControl('', Validators.required);
  symptomCodeL0s: any[] = [];
  filteredSymptomCodeL0: Observable<any[]> = new Observable<any[]>();

  // System Code L1
  symptomCodeL1Control = new FormControl('', Validators.required);
  symptomCodeL1s: any[] = [];
  filteredSymptomCodeL1: Observable<any[]> = new Observable<any[]>();

  // Location Where Detected
  locationWhereDetectedControl = new FormControl('', Validators.required);
  locationWhereDetected: any[] = [];
  filteredLocationWhereDetected: Observable<any[]> = new Observable<any[]>();

  // Phase Dectection
  phaseDetectionControl = new FormControl('', Validators.required);
  phaseDetections: any[] = [];
  filteredPhaseDetection: Observable<any[]> = new Observable<any[]>();

  // Due Date
  _dueDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
  dueDateControl = new FormControl(this._dueDate, Validators.required);

  // Impact
  impactControl = new FormControl('');
  impact: any[] = [];
  filteredImpact: Observable<any[]> = new Observable<any[]>();

  // Priority
  priorityControl = new FormControl('');

  // Validator
  validatorControl = new FormControl('', Validators.required);
  validators: any[] = [];
  filteredValidator: Observable<any[]> = new Observable<any[]>();

  // Assigned Department
  assignedDepartmentControl = new FormControl('');
  assignedDepartment: any[] = [];
  filteredAssignedDepartment: Observable<any[]> = new Observable<any[]>();

  createNCForm: FormGroup = new FormGroup({
    ncType: this.ncTypeControl,
    detectedByUnit: this.detectedByUnitControl,
    detectionDate: this.detectionDateControl,
    problemTitle: this.problemTitle,
    problemDescription: this.problemDescription,
    contaiment: this.contaiment,
    projectNumber: this.projectNumberControl,
    projectName: this.projectNameControl,
    defectiveQuantity: this.defectiveQuantityControl,
    defectiveUnit: this.defectiveUnitControl,
    productType: this.productTypeControl,
    device: this.deviceControl,
    symptomCodeL0: this.symptomCodeL0Control,
    symptomCodeL1: this.symptomCodeL1Control,
    locationWhereDetected: this.locationWhereDetectedControl,
    phaseDetection: this.phaseDetectionControl,
    dueDate: this.dueDateControl,
    impact: this.impactControl,
    priority: this.priorityControl,
    validator: this.validatorControl,
    assignedDepartment: this.assignedDepartmentControl,
  });

  constructor(
    private _ncgService: NcgService,
    public problemDescriptionDialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private _activedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this._ncgService.getMasterData().subscribe((res) => {
      this.detectedByUnits = res.mdDetectedByUnits;
      this.detectedByUnitControl.setValue('');

      this.defectiveUnits = res.mdDefectiveUnits;
      this.defectiveUnitControl.setValue('');

      this.productTypes = res.mdProductTypes;
      this.productTypeControl.setValue('');

      this.symptomCodeL0s = res.mdSymptomCodeL0s;
      this.symptomCodeL0Control.setValue('');

      this.locationWhereDetected = res.mdLocationWhereDetecteds;
      this.locationWhereDetectedControl.setValue('');

      this.phaseDetections = res.mdPhaseDetections;
      this.phaseDetectionControl.setValue('');

      this.impact = res.mdImpactPriorities;
      this.impactControl.setValue('');

      this.assignedDepartment = res.mdAssignedDepartments;
      this.assignedDepartmentControl.setValue('');
    });
    this._ncgService.getInternalUsers().subscribe((res) => {
      this.validators = res;
      this.validatorControl.setValue('');
    });
  }

  ngOnInit(): void {
    // Product Type
    this.filteredProductType = this.productTypeControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.code;
        return name
          ? this._filterProductType(name as string)
          : this.productTypes.slice();
      }),
      defaultIfEmpty(this.productTypes)
    );
    this.filteredProductType.subscribe((selectedProductType) => {
      if (selectedProductType.length == 1) {
        this.device = selectedProductType[0].mdDevice;
      } else {
        this.device = [];
      }
      this.deviceControl.setValue('');
    });
    // Device
    this.filteredDevice = this.deviceControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.code;
        return name ? this._filterDevice(name as string) : this.device.slice();
      }),
      defaultIfEmpty(this.device)
    );
    // Detected by unit
    this.filteredDetectedByUnit = this.detectedByUnitControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value!.unitName;
        return name
          ? this._filterDetectedUnit(name as string)
          : this.detectedByUnits.slice();
      }),
      defaultIfEmpty(this.detectedByUnits)
    );
    // Defective unit
    this.filteredDefectiveUnit = this.defectiveUnitControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.nameEN;
        return name
          ? this._filterDefectiveUnit(name as string)
          : this.defectiveUnits.slice();
      }),
      defaultIfEmpty(this.defectiveUnits)
    );
    // Symptom Code L0
    this.filteredSymptomCodeL0 = this.symptomCodeL0Control.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.code;
        return name
          ? this._filterSymptomCodeL0(name as string)
          : this.symptomCodeL0s.slice();
      }),
      defaultIfEmpty(this.symptomCodeL0s)
    );
    this.filteredSymptomCodeL0.subscribe((selectedSymptomCodeL0) => {
      if (selectedSymptomCodeL0.length == 1) {
        this.symptomCodeL1s = selectedSymptomCodeL0[0].mdSymptomCodeL1s;
      } else {
        this.symptomCodeL1s = [];
      }
      this.symptomCodeL1Control.setValue('');
    });
    // Symptom Code L1
    this.filteredSymptomCodeL1 = this.symptomCodeL1Control.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.code;
        return name
          ? this._filterSymptomCodeL1(name as string)
          : this.symptomCodeL1s.slice();
      }),
      defaultIfEmpty(this.symptomCodeL1s)
    );
    // Impact
    this.filteredImpact = this.impactControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.code;
        return name ? this._filterImpact(name as string) : this.impact.slice();
      }),
      defaultIfEmpty(this.impact)
    );
    this.filteredImpact.subscribe((selectedImpact) => {
      if (selectedImpact.length == 1) {
        this.priorityControl.setValue(selectedImpact[0].priority);
      } else {
        this.priorityControl.setValue('');
      }
    });
    // Phase Detection
    this.filteredPhaseDetection = this.phaseDetectionControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.code;
        return name
          ? this._filterPhaseDetection(name as string)
          : this.phaseDetections.slice();
      }),
      defaultIfEmpty(this.phaseDetections)
    );
    // Location Where Detected
    this.filteredLocationWhereDetected =
      this.locationWhereDetectedControl.valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          const name = typeof value === 'string' ? value : value?.code;
          return name
            ? this._filterLocationWhereDetected(name as string)
            : this.locationWhereDetected.slice();
        }),
        defaultIfEmpty(this.locationWhereDetected)
      );
    // Validator
    this.filteredValidator = this.validatorControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filterValidator(name as string)
          : this.validators.slice();
      }),
      defaultIfEmpty(this.validators)
    );
    // Assigned Department
    this.filteredAssignedDepartment =
      this.assignedDepartmentControl.valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          const name = typeof value === 'string' ? value : value?.code;
          return name
            ? this._filterAssignedDepartment(name as string)
            : this.assignedDepartment.slice();
        }),
        defaultIfEmpty(this.assignedDepartment)
      );
    Object.keys(this.createNCForm.controls).forEach((field) => {
      const control = this.createNCForm.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }

  ngOnDestroy(): void {
    this.filteredProductType = new Observable<any[]>();
    this.filteredDevice = new Observable<any[]>();
    this.filteredDetectedByUnit = new Observable<any[]>();
    this.filteredDefectiveUnit = new Observable<any[]>();
    this.filteredSymptomCodeL0 = new Observable<any[]>();
    this.filteredSymptomCodeL1 = new Observable<any[]>();
    this.filteredImpact = new Observable<any[]>();
    this.filteredPhaseDetection = new Observable<any[]>();
    this.filteredLocationWhereDetected = new Observable<any[]>();
    this.filteredValidator = new Observable<any[]>();
    this.filteredAssignedDepartment = new Observable<any[]>();
  }

  private _filterProductType(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.productTypes.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterDevice(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.device.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterDetectedUnit(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.detectedByUnits.filter((option) =>
      option.unitName.toLowerCase().includes(filterValue)
    );
  }

  private _filterDefectiveUnit(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.defectiveUnits.filter((option) =>
      option.nameEN.toLowerCase().includes(filterValue)
    );
  }

  private _filterSymptomCodeL0(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.symptomCodeL0s.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterSymptomCodeL1(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.symptomCodeL1s.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterImpact(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.impact.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterPhaseDetection(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.phaseDetections.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterLocationWhereDetected(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.locationWhereDetected.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  private _filterValidator(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.validators.filter(
      (option) =>
        option.sso.toString().includes(filterValue) ||
        option.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterAssignedDepartment(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.assignedDepartment.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }

  onResetClick() {
    this.createNCForm.reset();
    this.files = [];
  }

  onSubmitClick() {
    (this.createNCForm as FormGroup).addControl(
      'attachment',
      new FormControl(this.files)
    );
    this._ncgService.createNC(this.createNCForm.value).subscribe((res) => {
      if (res.result) {
        this._router.navigate(['/ncg/ncr-details', res.result.id]);
      } else {
        console.log(res.message);
      }
    });
  }
}
