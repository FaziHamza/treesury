import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal-logout',
  templateUrl: './modal-logout.component.html',
  styleUrls: ['./modal-logout.component.scss'],
})
export class ModalLogoutComponent {
  faArrowRightFromBracket = faArrowRightFromBracket;

  constructor(private modal: NgbActiveModal) {}

  confirm() {
    this.modal.close({ action: 'confirm' });
  }

  close(): void {
    this.modal.close();
  }
}
