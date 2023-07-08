import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DepositService } from 'src/app/shared/services/deposit.service';

@Component({
  selector: 'app-deposit-cheque-modal',
  templateUrl: './deposit-cheque-modal.component.html',
  styleUrls: ['./deposit-cheque-modal.component.scss']
})
export class DepositChequeModalComponent {
  @Input() details: any;
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
      let formData = new FormData();
      formData.append('DepositedChequeId', this.details?.id.toString());
      formData.append('ActionId', this.actionType.id.toString());
      if (this.reasonForm.valid) {
        this.isLoading = true;
        formData.append('Notes', this.reasonForm.value.note);
        this.submitData(formData);
      }
      if (!this.detailShow) {
        this.submitData(formData);
      }
    }
  }



  submitData(formData: any) {
    this.deposiService.actionOnCheques(formData)
      .subscribe({
        next: response => {
          if (response.isSuccess) {
            this.toastrService.success('Action Successfully Taken');
          } else {
            const errorsList = response?.errors;
            this.toastrService.error(errorsList.length ? errorsList.join('<br>') : 'Failed!', '', {
              enableHtml: true,
            });
          }
        },
        error: err => {
          const errors = err?.error?.errors?.map((entry: any) => entry.ErrorMessageEn) || [];
          this.toastrService.error(errors.length ? errors.join('<br>') : 'Failed!', '', {
            enableHtml: true,
          });
        },
      })
      .add(() => (this.isLoading = false));
  }
}
0
