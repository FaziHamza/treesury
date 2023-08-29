import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-replaced-cheque-detail-view',
  templateUrl: './replaced-cheque-detail-view.component.html',
  styleUrls: ['./replaced-cheque-detail-view.component.scss']
})
export class ReplacedChequeDetailViewComponent {
  selectedValue: any = 1;
  @Input() replacedCheque: any = [];
  @Input() details: any = [];
  @Input() selectedCheque: any;
  @Output() sendtoLoadData = new EventEmitter();

  constructor(
  ) { }

  ngOnInit(): void {
    // this.getdepositTypes();
    // this.selectedCheque = this.replacedCheque.find((x:any) => x.id == this.selectedValue);
  }

  chooseDeposit(deposit: any, index: number) {
    this.selectedValue = index + 1;
    this.selectedCheque = deposit;
  }
  getdepositTypes() {
    this.replacedCheque = [
      {
        id: 1,
        name: 'V1 Cheque Details',
        children: [
          { ChequeId: 1, ChequeAmount: "500JOD", ChequeNumber: 345465, ChequeDate: "16-june-2023", ChauqeBankID: "Arab Bank", ChauqeName: "Muhammad Ali sami mahmood", Customer: true, Note: "No note has been added" },
        ]
      },
      {
        id: 2,
        name: 'V2 Cheque Details',
        children: [
          { ChequeId: 2, ChequeAmount: "1000JOD", ChequeNumber: 100017, ChequeDate: "20-june-2023", ChauqeBankID: "National Bank", ChauqeName: "Muhammad Sami", Customer: false, Note: "Cheque replaced by the help of owner" }
        ]
      },
      {
        id: 3,
        name: 'V3 Cheque Details',
        children: [
          { ChequeId: 3, ChequeAmount: "1500JOD", ChequeNumber: 345617, ChequeDate: "10-june-2023", ChauqeBankID: "Arab Bank", ChauqeName: "Muhammad Sami Ibrahim", Customer: true, Note: "no comment" }
        ]
      },
    ];
  }
  close(){
    this.sendtoLoadData.emit();
  }
}
