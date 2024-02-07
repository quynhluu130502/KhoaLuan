import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NcgService } from 'src/app/services/ncg.service';
import { Observable, defaultIfEmpty, map, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProblemDescriptionDialogComponent } from 'src/app/problem-description-dialog/problem-description-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-non-ga-nc-details',
  templateUrl: './non-ga-nc-details.component.html',
  styleUrl: './non-ga-nc-details.component.scss',
})
export class NonGaNcDetailsComponent implements OnInit {
  constructor(
    private _ncgService: NcgService,
    public problemDescriptionDialog: MatDialog,
    private _sanitizer: DomSanitizer
  ) {}

  @Input() detailForm!: FormGroup;
  @Input() masterData: any;
  @Output() dataLoaded = new EventEmitter<boolean>();

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
  dueDateControl = new FormControl(new Date());

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

  ngOnInit(): void {
    this.detectedByUnits = this.masterData.mdDetectedByUnits;
    this.defectiveUnits = this.masterData.mdDefectiveUnits;
    this.productTypes = this.masterData.mdProductTypes;
    this.symptomCodeL0s = this.masterData.mdSymptomCodeL0s;
    this.locationWhereDetected = this.masterData.mdLocationWhereDetecteds;
    this.phaseDetections = this.masterData.mdPhaseDetections;
    this.impact = this.masterData.mdImpactPriorities;
    this.assignedDepartment = this.masterData.mdAssignedDepartments;
    this._ncgService.getInternalUsers().subscribe((res) => {
      this.validators = res;
      this.dataLoaded.emit(true);
    });
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

    this.detailForm.addControl('ncType', this.ncTypeControl);
    this.detailForm.addControl('detectedByUnit', this.detectedByUnitControl);
    this.detailForm.addControl('detectionDate', this.detectionDateControl);
    this.detailForm.addControl('problemTitle', this.problemTitle);
    this.detailForm.addControl('problemDescription', this.problemDescription);
    this.detailForm.addControl('contaiment', this.contaiment);
    this.detailForm.addControl('projectNumber', this.projectNumberControl);
    this.detailForm.addControl('projectName', this.projectNameControl);
    this.detailForm.addControl(
      'defectiveQuantity',
      this.defectiveQuantityControl
    );
    this.detailForm.addControl('defectiveUnit', this.defectiveUnitControl);
    this.detailForm.addControl('productType', this.productTypeControl);
    this.detailForm.addControl('device', this.deviceControl);
    this.detailForm.addControl('symptomCodeL0', this.symptomCodeL0Control);
    this.detailForm.addControl('symptomCodeL1', this.symptomCodeL1Control);
    this.detailForm.addControl(
      'locationWhereDetected',
      this.locationWhereDetectedControl
    );
    this.detailForm.addControl('phaseDetection', this.phaseDetectionControl);
    this.detailForm.addControl('dueDate', this.dueDateControl);
    this.detailForm.addControl('impact', this.impactControl);
    this.detailForm.addControl('priority', this.priorityControl);
    this.detailForm.addControl('validator', this.validatorControl);
    this.detailForm.addControl(
      'assignedDepartment',
      this.assignedDepartmentControl
    );

    Object.keys(this.detailForm.controls).forEach((field) => {
      const control = this.detailForm.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
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
}
