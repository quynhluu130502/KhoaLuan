import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-create-non-conformities',
  templateUrl: './create-non-conformities.component.html',
  styleUrl: './create-non-conformities.component.css',
})
export class CreateNonConformitiesComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  title = new FormControl('', Validators.required);
  detail = new FormControl('', Validators.required);
}
