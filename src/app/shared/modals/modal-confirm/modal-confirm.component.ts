import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
})
export class ModalConfirmComponent {
  content!: string;

  constructor(private modal: NgbActiveModal) {}

  confirm() {
    this.modal.close({ action: 'confirm' });
  }

  close(): void {
    this.modal.close();
  }
}
