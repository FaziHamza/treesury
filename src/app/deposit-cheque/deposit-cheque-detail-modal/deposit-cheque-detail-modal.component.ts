import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deposit-cheque-detail-modal',
  templateUrl: './deposit-cheque-detail-modal.component.html',
  styleUrls: ['./deposit-cheque-detail-modal.component.scss']
})
export class DepositChequeDetailModalComponent {
  @Input() details: any;
  @Input() title = '';
  @Input() detailShow = false;
  @Output() sendtoLoadData = new EventEmitter();
  constructor(private modalService: NgbModal
  ) { }
  ngOnInit() {
  }
  dismissModal() {
    this.modalService.dismissAll();
  }
  submit() {
    this.sendtoLoadData.emit();
  }
}
