import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  description: string;
}

@Component({
  selector: 'app-problem-description-dialog',
  templateUrl: './problem-description-dialog.component.html',
  styleUrl: './problem-description-dialog.component.css',
})
export class ProblemDescriptionDialogComponent {
  problemDescription: FormControl = new FormControl('');
  constructor(
    public dialogRef: MatDialogRef<ProblemDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
