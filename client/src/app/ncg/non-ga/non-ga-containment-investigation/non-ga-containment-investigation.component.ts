import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActionTableDialogComponent } from '../../action-table-dialog/action-table-dialog.component';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  defaultIfEmpty,
  map,
  startWith,
  takeUntil,
} from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NcgService } from 'src/app/services/ncg.service';

@Component({
  selector: 'app-non-ga-containment-investigation',
  templateUrl: './non-ga-containment-investigation.component.html',
  styleUrl: './non-ga-containment-investigation.component.scss',
})
export class NonGaContainmentInvestigationComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _tableDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _ncgService: NcgService
  ) {}
  @Input() investigationForm!: FormGroup;
  @Input() actionsTable!: BehaviorSubject<any[]>;
  @Input() masterData: any;
  @Output() dataLoaded = new EventEmitter<boolean>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();
  private subscription = new Subscription();

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'ID',
    'Class',
    'Action_Description',
    'Department',
    'Responsible',
    'Additional_Notify_Person',
    'Start_Date',
    'Completion_Date',
    'Status',
    'Edit',
    'Delete',
  ];

  // Department
  department: any[] = [];

  // Responsible
  responsibleArray: FormArray<FormControl> = this._formBuilder.array([]);
  responsible: any[] = [];
  arrayFilteredResponsible: Observable<any[]>[] = [];

  today = new Date();

  // Findings & Decision
  findingsAndDecision = new FormControl<string | any>('', Validators.required);

  // Cause Code L0
  causeCodeL0Control = new FormControl<string | any>('', Validators.required);
  filteredCauseCodeL0: Observable<any[]> = new Observable<any[]>();
  causeCodeL0s: any[] = [];

  // Cause Code L1
  causeCodeL1Control = new FormControl<string | any>('', Validators.required);
  causeCodeL1s: any[] = [];

  // Decision
  decision = new FormControl<string | any>('', Validators.required);

  // Decision Validator
  decisionValidator = new FormControl<string | any>('', Validators.required);

  ngOnInit(): void {
    this.department = this.masterData.mdAssignedDepartments;
    this.causeCodeL0s = this.masterData.mdCauseCodeL0s;
    this._ncgService.getInternalUsers().subscribe((data) => {
      this.responsible = data;
      this.dataLoaded.emit(true);
    });
    this.causeCodeL0Control.setValue('');
    this.filteredCauseCodeL0 = this.causeCodeL0Control.valueChanges.pipe(
      takeUntil(this.destroy$),
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.code;
        return name
          ? this._filterCauseCodeL0(name as string)
          : this.causeCodeL0s.slice();
      }),
      defaultIfEmpty(this.causeCodeL0s)
    );

    this.subscription.add(
      this.filteredCauseCodeL0.subscribe((data) => {
        if (data.length == 1) {
          this.masterData.mdSupplierCauseCodeL0s.forEach((element: any) => {
            if (element.code == data[0].code) {
              this.causeCodeL1s = element.l1List;
            }
          });
        }
      })
    );

    this.subscription.add(
      this.actionsTable.subscribe((data) => {
        data.forEach((element: any) => {
          this.createResponsibleControl(element.responsible);
        });
        this.dataSource.data = data;
      })
    );

    this.investigationForm.addControl(
      'findingsAndDecision',
      this.findingsAndDecision
    );
    this.investigationForm.addControl(
      'causeCodeL0Control',
      this.causeCodeL0Control
    );
    this.investigationForm.addControl(
      'causeCodeL1Control',
      this.causeCodeL1Control
    );
    this.investigationForm.addControl('decision', this.decision);
    this.investigationForm.addControl(
      'decisionValidator',
      this.decisionValidator
    );
    this.investigationForm.addControl('actions', new FormControl([]));

    Object.keys(this.investigationForm.controls).forEach((field) => {
      const control = this.investigationForm.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openDialog(
    enterAnimationDuration: string = '2000',
    exitAnimationDuration: string = '2000'
  ): void {
    const dialogRef = this._tableDialog.open(ActionTableDialogComponent, {
      width: '75%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        masterData: this.masterData,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.actionsTable.next([...this.actionsTable.value, result]);
        this.createResponsibleControl(result.responsible);
      }
    });
  }

  editDialog(
    enterAnimationDuration: string = '2000',
    exitAnimationDuration: string = '2000',
    rowData: any,
    index: any
  ): void {
    rowData.responsible = this.responsibleArray.at(index).value;
    const dialogRef = this._tableDialog.open(ActionTableDialogComponent, {
      width: '75%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        masterData: this.masterData,
        rowData: rowData,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.actionsTable.value[index] = result;
        this.actionsTable.next(this.actionsTable.value);
        this.responsibleArray.at(index).setValue(result.responsible);
      }
    });
  }

  deleteRow(index: any) {
    this.actionsTable.value.splice(index, 1);
    this.actionsTable.next(this.actionsTable.value);
    this.arrayFilteredResponsible.splice(index, 1);
    this.responsibleArray.removeAt(index);
  }

  createResponsibleControl(controlData: any): void {
    this.arrayFilteredResponsible.push(new Observable<any[]>());
    const control = this._formBuilder.control<FormControl>(
      controlData,
      Validators.required
    );
    this.arrayFilteredResponsible[this.arrayFilteredResponsible.length - 1] =
      control.valueChanges.pipe(
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
    this.responsibleArray.push(control);
  }

  private _filterResponsible(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.responsible.filter(
      (option) =>
        option.sso.toString().includes(filterValue) ||
        option.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterCauseCodeL0(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.causeCodeL0s.filter((option) =>
      option.code.toLowerCase().includes(filterValue)
    );
  }
}
