import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { NcgService } from '../services/ncg.service';
import { DetectedUnit } from '../models/detectedUnit';
import { Observable, defaultIfEmpty, map, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProblemDescriptionDialogComponent } from '../problem-description-dialog/problem-description-dialog.component';

@Component({
  selector: 'app-create-non-conformities',
  templateUrl: './create-non-conformities.component.html',
  styleUrl: './create-non-conformities.component.css',
})
export class CreateNonConformitiesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  detectedByUnitControl = new FormControl<string | DetectedUnit>('');
  detectedUnits: DetectedUnit[] = [];
  filteredDetectedByUnit: Observable<DetectedUnit[]> = new Observable<
    DetectedUnit[]
  >();

  title = new FormControl('', Validators.required);
  detail = new FormControl('', Validators.required);

  problemTitle = new FormControl('', Validators.required);
  problemDescription = new FormControl('', Validators.required);
  contaiment = new FormControl('', Validators.required);

  maxDetectionDate = new Date();

  constructor(
    private _ncgService: NcgService,
    public problemDescriptionDialog: MatDialog
  ) {
    this._ncgService.getDetectedUnits().subscribe((res) => {
      this.detectedUnits = res;
      this.detectedByUnitControl.setValue('');
    });
  }
  ngOnInit(): void {
    this.filteredDetectedByUnit = this.detectedByUnitControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value!.unitName;
        return name
          ? this._filterDetectedUnit(name as string)
          : this.detectedUnits.slice();
      }),
      defaultIfEmpty(this.detectedUnits)
    );
  }

  private _filterDetectedUnit(name: string): DetectedUnit[] {
    const filterValue = name.toLowerCase();
    return this.detectedUnits.filter((option) =>
      option.unitName.toLowerCase().includes(filterValue)
    );
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

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
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      this.problemDescription.setValue(result);
    });
  }
}
