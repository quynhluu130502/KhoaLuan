import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {
  Observable,
  Subject,
  defaultIfEmpty,
  map,
  startWith,
  takeUntil,
} from 'rxjs';
import { NcgService } from 'src/app/services/ncg.service';

@Component({
  selector: 'app-action-table-dialog',
  templateUrl: './action-table-dialog.component.html',
  styleUrl: './action-table-dialog.component.scss',
})
export class ActionTableDialogComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  today = new Date();
  returnData: any;

  // ID
  idControl = new FormControl<string | any>('', Validators.required);

  // Class
  classControl = new FormControl<string | any>('', Validators.required);

  // Action Description
  actionDescriptionControl = new FormControl<string | any>(
    '',
    Validators.nullValidator
  );

  // Department
  departmentControl = new FormControl<string | any>('', Validators.required);
  department: any[] = [];

  // Responsible
  responsibleControl = new FormControl<string | any>('', Validators.required);
  responsible: any[] = [];
  filteredResponsible: Observable<any[]> = new Observable<any[]>();

  // Additional Notify Person
  additionalNotifyPersonControl = new FormControl<string | any>(
    '',
    Validators.nullValidator
  );

  // Start Date
  startDateControl = new FormControl<string | any>('', Validators.required);

  // Completion Date
  completionDateControl = new FormControl<string | any>(
    '',
    Validators.required
  );

  // Status
  statusControl = new FormControl<string | any>('', Validators.required);

  tableForm = new FormGroup({
    id: this.idControl,
    class: this.classControl,
    actionDescription: this.actionDescriptionControl,
    department: this.departmentControl,
    responsible: this.responsibleControl,
    additionalNotifyPerson: this.additionalNotifyPersonControl,
    startDate: this.startDateControl,
    completionDate: this.completionDateControl,
    status: this.statusControl,
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private _toastr: ToastrService,
    private _toastService: ToastrService,
    private _ncgService: NcgService,
    public dialogRef: MatDialogRef<ActionTableDialogComponent>
  ) {
    this.department = dialogData.masterData.mdAssignedDepartments;

    this._ncgService.getInternalUsers().subscribe((data) => {
      this.responsible = data;
      if (dialogData.rowData !== undefined) {
        this.tableForm.patchValue(dialogData.rowData);
      } else {
        this.responsibleControl.setValue('');
      }
    });
    Object.keys(this.tableForm.controls).forEach((field) => {
      const control = this.tableForm.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }

  ngOnInit(): void {
    this.filteredResponsible = this.responsibleControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filterResponsible(name as string)
          : this.responsible.slice();
      }),
      defaultIfEmpty(this.responsible)
    );
    this.startDateControl.valueChanges.subscribe((value) => {
      if (
        value &&
        this.completionDateControl.value &&
        value > this.completionDateControl.value
      ) {
        this.completionDateControl.setValue('');
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
  onSubmitClick(): void {
    if (this.tableForm.valid) {
      this.returnData = this.tableForm.value;
      this.dialogRef.close(this.returnData);
    } else {
      this._toastService.error('Please fill all the required fields');
    }
  }

  private _filterResponsible(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.responsible.filter(
      (option) =>
        option.sso.toString().includes(filterValue) ||
        option.name.toLowerCase().includes(filterValue)
    );
  }
}
