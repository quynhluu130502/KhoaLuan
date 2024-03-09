import { Component, Inject, inject, Type } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  constructor(@Inject('modalData') public modalData: any) {}
  modal = inject(NgbActiveModal);

  dismissModal() {
    this.modal.dismiss(false);
  }

  closeModal() {
    this.modal.close(true);
  }
}

export const MODALS: { [name: string]: Type<any> } = {
  focusFirst: ConfirmModalComponent,
  autofocus: ConfirmModalComponent,
};
