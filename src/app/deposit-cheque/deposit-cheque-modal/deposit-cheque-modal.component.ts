import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalMessageComponent } from 'src/app/shared/modals/modal-message/modal-message.component';
import { DepositService } from 'src/app/shared/services/deposit.service';

@Component({
  selector: 'app-deposit-cheque-modal',
  templateUrl: './deposit-cheque-modal.component.html',
  styleUrls: ['./deposit-cheque-modal.component.scss']
})
export class DepositChequeModalComponent {
  @Input() details: any[] = [];
  @Input() actionType: any;
  @Input() title = '';
  @Input() isConfirmShow = false;
  @Input() detailShow = false;
  @Output() sendtoLoadData = new EventEmitter();
  message: string = '';
  messageError: string = '';
  isLoading: boolean = false;
  reasonForm !: FormGroup;
  saveSubmitted: boolean = false;
  constructor(private formBuilder: FormBuilder, private deposiService: DepositService,
    private modalService: NgbModal, private toastrService: ToastrService
  ) { }
  ngOnInit() {
    this.initForm();
  }
  dismissModal() {
    this.modalService.dismissAll();
  }
  submit() {
    this.sendtoLoadData.emit();
  }
  close() {
    this.sendtoLoadData.emit('true');
  }
  initForm() {
    this.reasonForm = this.formBuilder.group({
      note: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }
  get formControls() {
    return this.reasonForm.controls;
  }
  saveForm() {

    if (this.isConfirmShow) {
      this.saveSubmitted = true;
      this.details.forEach(element => {
        let formData = new FormData();
        formData.append('DepositedChequeId', element?.id.toString());
        formData.append('ActionId', this.actionType.id.toString());
        if (this.reasonForm.valid) {
          this.isLoading = true;
          formData.append('Notes', this.reasonForm.value.note);
          this.submitData(formData);
        }
        if (!this.detailShow) {
          this.submitData(formData);
        }
      });
    }
  }



  submitData(formData: any) {
    this.deposiService.actionOnCheques(formData)
      .subscribe({
        next: response => {
          if (response.isSuccess) {
            const modalRef = this.modalService.open(ModalMessageComponent);
            modalRef.componentInstance.type = 'success';
            modalRef.componentInstance.message = 'Your ' + this.actionType?.name?.[0].lookupName + " Action Successfully Performed";
            modalRef.componentInstance.loadPageData.subscribe((result: any) => {
              this.close();
            });
          } else {
            const modalRef = this.modalService.open(ModalMessageComponent);
            modalRef.componentInstance.type = 'error';
            modalRef.componentInstance.messageError = response?.errors;
          }
        },
        error: (err) => {
          const modalRef = this.modalService.open(ModalMessageComponent);
          modalRef.componentInstance.type = 'error';
          modalRef.componentInstance.messageError = err?.error?.errors;
        },
      })
      .add(() => (this.isLoading = false));
  }
}

