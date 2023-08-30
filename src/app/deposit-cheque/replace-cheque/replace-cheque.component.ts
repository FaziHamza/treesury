import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCircleNotch, faCloudArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DepositService } from 'src/app/shared/services/deposit.service';
import { RevenueService } from 'src/app/shared/services/revenue.service';


@Component({
  selector: 'app-replace-cheque',
  templateUrl: './replace-cheque.component.html',
  styleUrls: ['./replace-cheque.component.scss']
})
export class ReplaceChequeComponent {
  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private depositservice: DepositService,
  ) { }
  @Input() actionType: any;
  @Input() details: any;
  isLoading: boolean = false;
  faXmark = faXmark;
  faCloudArrowUp = faCloudArrowUp;
  faCircleNotch = faCircleNotch;
  loading = false;
  form!: FormGroup;
  bankList: any = [];
  message: string = '';
  messageError: string = '';
  isStatus = false;
  submitted = false;
  unsubscribe = new Subject<void>();
  filesToUpload: File[] = [];
  @Output() sendtoLoadData = new EventEmitter();

  ngOnInit(): void {
    this.form = this.fb.group({
      ChequeNo: ['', [Validators.required]],
      ChequeDate: ['', [Validators.required]],
      BankId: [null, [Validators.required]],
      ChequeCustomer: ['', [Validators.required]],
      Customer: false,
      Note: ['', [Validators.required, Validators.maxLength(200)]],
    });
    this.depositservice.getBankLookups(11).subscribe(response => {
      this.makeBankList(response.data || [])
    });

  }
  sameCustomer() {
    if (this.form.get('Customer')?.value) {
      this.form.get('ChequeCustomer')?.clearValidators(); // Remove the required validator
      this.form.get('ChequeCustomer')?.setValue('');
    } else {
      this.form.get('ChequeCustomer')?.setValidators(Validators.required); // Add the required validator
      this.form.get('ChequeCustomer')?.setValue(this.details?.customer?.customerName);
    }
    this.form.get('ChequeCustomer')?.updateValueAndValidity(); // Update the control's validity status
  }

  makeBankList(item: any) {
    let array = [];
    if (item.length > 0) {
      for (let index = 0; index < item.length; index++) {
        const element = item[index];
        let obj = {
          id: element.id,
          bankName: element?.name?.[0].lookupName
        }
        array.push(obj);
      }
    }
    this.bankList = array;
  }
  onFileSelected(event: any): void {
    this.filesToUpload = event.target.files;
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  bankSelected(item: any) {
    this.form.get('BankId')?.setValue(item);
  }
  remove(item: string) {
    if (item == 'ChequeNo')
      this.form.get('ChequeNo')?.setValue(null);
    else if (item == 'ChequeCustomer') {
      this.form.get('ChequeCustomer')?.setValue('');
      this.form.get('Customer')?.setValue(false)
    }
  }

  removeCollectionDateFilter() {
    this.form.get('ChequeDate')?.patchValue('');
  }
  onDateValueChange(event: any) {
    const date = new Date(event);
    if (isNaN(date.getTime())) {
      // Invalid date, do not patch the value
      return;
    }

    const pipe = new DatePipe('en-US');
    this.form.get('ChequeDate')?.patchValue(pipe.transform(event) || '');
  }

  onSubmit() {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isLoading = true;
      if (this.filesToUpload && this.filesToUpload.length > 0) {
        const formData: FormData = new FormData();
        for (let i = 0; i < this.filesToUpload.length; i++) {
          formData.append('Image', this.filesToUpload[i]);
        }
        const fromDate = new Date(this.form.value.ChequeDate);
        const formattedFromDate = fromDate.toISOString();
        formData.append('DepositedChequeId', this.details.id.toString());
        formData.append('ActionId', this.actionType.id.toString());
        formData.append('ChequeAmount', this.details?.chequeCollectionJod.toString());
        formData.append('ChequeNo', this.form.value.ChequeNo.toString());
        formData.append('ChequeDate', formattedFromDate);
        formData.append('BankId', this.form.value.BankId.toString());
        formData.append('ChequeCustomer', this.form.value.ChequeCustomer);
        formData.append('Notes', this.form.value.Note);
        this.depositservice.actionOnCheques(formData)
          .subscribe({
            next: response => {
              if (response.isSuccess) {
                this.toastrService.success('Action Successfully Taken');
                 this.sendtoLoadData.emit('true');
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
      } else {
        this.toastrService.error('please Upload Image');
      }
    }
  }

  get formControls() {
    return this.form.controls;
  }
  close() {
    this.sendtoLoadData.emit();
  }
  get formValid(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
