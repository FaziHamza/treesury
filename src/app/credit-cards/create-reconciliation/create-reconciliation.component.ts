import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableColumn, TableConfig } from 'src/app/shared/components/table-advanced';
import { CreditCardService } from 'src/app/shared/services/credit-card.service';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, takeUntil } from 'rxjs';
import { HeaderService } from '../../shared/services/header.service';
import { FormControl } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-reconciliation',
  templateUrl: './create-reconciliation.component.html',
  styleUrls: ['./create-reconciliation.component.scss']
})
export class CreateReconciliationComponent {
  datepickerInput: any;
  searchText = new FormControl(null);
  netAmount = new FormControl(null)
  @ViewChild('myModal') event: ElementRef | undefined;
  @ViewChild('myErrorModal') eventerror: ElementRef | undefined;
  unsubscribe = new Subject<void>();
  isvalid: boolean = true
  tableColumns: TableColumn[] = [];
  searchChequeNo: string = '';
  searchCustomerNo: string = '';
  loading = false;
  reconciliation: any[] = [];
  totalAllRecordsCount = 0;
  onSelectString = '';
  page = 1;
  total = 0;
  limit = 6;
  sort: number = 1;
  startDate = '';
  tableConfig: TableConfig = {
    paging: true,
    filter: {
      Sort: 1,
      PageSize: this.limit,
    },
  };
  modalReference: any;
  closeResult: any;

  constructor(
    private creditcardservice: CreditCardService,
    private headerService: HeaderService,
    private modalService: NgbModal,
    public router: Router,
    private modalConfig: NgbModalConfig
  ) {
    this.modalConfig.centered = true;
  }
  // ngAfterViewInit(): void {
  //   console.log(this.event,'hello')


  // }

  ngOnInit() {
    this.headerService.setTitle('Create Reconciliation');
    this.initTableColumns();
    this.fetcAllData();
    this.getData()
    this.netAmount.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        const text: string = value || '';
        if (text?.length >= 2 || (!text?.length && this.tableConfig.filter.NetAmount?.length)) {
          this.tableConfig.filter.NetAmount = text;
          this.selectedAmount = 0;
          this.selecteddata = [];
          this.page = 1;
          this.fetcAllData();
        }
      });
  }



  openmdel() {
    this.modalService.open(this.event, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  openmdelerroe() {
    this.modalService.open(this.eventerror, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnDestroy() { }

  initTableColumns() {
    this.tableColumns = [
      {
        key: '',
        label: 'Select All',
        canSort: true,
      },
      {
        key: 'cardLast4Digits',
        label: 'Last 4 Digit',
        canSort: true,
      },
      {
        key: 'providerName',
        label: 'Provider',
        canSort: true,
      },
      {
        key: 'orderCollectionId',
        label: 'Invoice',
        canSort: true,
      },
      {
        key: 'collectionAt',
        label: 'Date',
        canSort: true,
      },
      {
        key: 'branchName',
        label: 'Branch Name',
        canSort: true,
      },
      {
        key: 'registersName',
        label: 'Register Name',
        canSort: true,
      },
      {
        key: 'cardType',
        label: 'Card Type',
        canSort: true,
      },
      {
        key: 'cardCollectionJod',
        label: 'Amount',
        canSort: true,
      },
      {
        key: 'commission',
        label: 'Commission Ration',
        canSort: true,
      },
      {
        key: 'cardCollectionJodNet',
        label: 'Net',
        canSort: true,
      }
    ];
  }
  selecteddata: any[] = [];
  fetcAllData() {
    this.loading = true;
    // this.tableConfig.filter.PageNo = 0;
    this.tableConfig.filter.PageNo = this.page - 1;
    this.tableConfig.filter.Status = 30001;

    this.creditcardservice.GetReconHistory(this.tableConfig.filter).subscribe(result => {
      if (result) {
        this.reconciliation = result.data || []
        console.log(">", this.reconciliation)
        this.totalAllRecordsCount = result?.totalRecordCount;
        this.total = result?.totalRecordCount;
        if (this.selecteddata.length > 0) {
          this.reconciliation.forEach((element: any) => {
            let findElement = this.selecteddata.find(elem => elem.ordersCardsCollectionId == element.ordersCardsCollectionId);
            if (findElement)
              element.checked = true;
          });
        }
        // this.page = 1;
        // this.totalAllRecordsCount = result?.totalRecordCount;
      }
    })
      .add(() => (this.loading = false));

  }

  onSortChange(sort: any) {
    if (sort?.direction && sort?.column) {
      switch (sort.column) {

        case 'cardLast4Digits':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 3 : 2;
          break;
        case 'providerName':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 5 : 4;
          break;
        case 'orderCollectionId':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 7 : 6;
          break;

        case 'collectionAt':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 9 : 8;
          break;
        case 'branchName':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 11 : 10;
          break;
        case 'cardType':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 13 : 12;
          break;
        case 'cardCollectionJod':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 15 : 14;
          break;
        case 'commission':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 15 : 14;
          break;
        case 'cardCollectionJodNet':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 15 : 14;
          break;
        default:
          break;
      }
    } else {
      this.tableConfig.filter.Sort = 1;
    }
    this.fetcAllData();
  }

  onPageChange(page: number) {
    this.page = page;
    this.fetcAllData();
  }

  removeSearchChequeNo() {
    this.searchChequeNo = '';
    this.sort = 1;
    this.fetcAllData();
  }

  searchCheque(event: any) {
    const text = event.target.value;
    if (text.length >= 2) {
      this.searchChequeNo = text;
      this.page = 0;
      this.fetcAllData();
    }
    if (text.length == 0) {
      this.fetcAllData();
    }
  }

  removeSearchCustomerNo() {
    this.searchCustomerNo = '';
    this.sort = 1;
    this.fetcAllData();
  }

  searchCustomer(event: any) {
    const text = event.target.value;
    if (text.length >= 2) {
      this.searchCustomerNo = text;
      this.page = 0;
      this.fetcAllData();
    }
    if (text.length == 0) {
      this.fetcAllData();
    }
  }

  onDateValueChange(event: any) {
    var pipe = new DatePipe('en-US');
    this.startDate = pipe.transform(event) || '';
    console.log(this.startDate);
    if (this.startDate) {
      const fromDate = new Date(this.startDate);
      fromDate.setDate(fromDate.getDate() + 1); // Adding one day
      const formattedFromDate = fromDate.toISOString();
      this.tableConfig.filter.CollectionDate = formattedFromDate;

    } else
      this.tableConfig.filter.CollectionDate = this.startDate;
    this.selectedAmount = 0;
    this.selecteddata = [];
    this.page = 1;
    this.fetcAllData();
  }

  onDueDateValueChange(event: any) {
    var pipe = new DatePipe('en-US');
    this.startDate = pipe.transform(event) || '';
    this.fetcAllData();
  }

  removeCollectionDateFilter() {
    (this.startDate = '');
    if (this.datepickerInput)
      this.datepickerInput = '';
    this.selectedAmount = 0;
    this.selecteddata = [];
    this.page = 1;
    this.fetcAllData();
  }
  removeNetAmountFilter() {
    this.netAmount.setValue(null);
    this.tableConfig.filter.NetAmount = '';
    this.selectedAmount = 0;
    this.selecteddata = [];
    this.page = 1;
    this.fetcAllData();
  }

  provider: any[] = [];
  cardlist: any[] = [];

  getData() {
    const api1$ = this.creditcardservice.GetProviders(this.tableConfig.filter);
    const api2$ = this.creditcardservice.GetCards();

    // const api3$ = this.creditcardservice.getLookups(29);
    forkJoin([api1$, api2$]).subscribe(
      ([result1, result2]) => {
        if (result1) {
          this.provider = result1.data || [];
        }
        console.log("result2", result2);
        if (result2) {
          this.cardlist = result2.data || [];
        }
      }, (error) => {
        console.error(error);
      }, () => {
        this.loading = false;
      });
  }

  selectedAmount = 0;
  async onSelectData(selectedData: any) {
    this.onSelectString = ''
    for await (const [Index, iterator] of selectedData.entries()) {
      if (Index === 0) {
        this.onSelectString = iterator.ordersCardsCollectionId.toString()
      } else {
        this.onSelectString += `, ${iterator.ordersCardsCollectionId}`
      }
    }
    if (selectedData.length > 0) {
      this.isvalid = false
    } else {
      this.isvalid = true
    }

    this.selectedAmount = selectedData.reduce((acc: any, cur: any) => acc + cur.cardCollectionJodNet, 0);
  }

  onClear() {
    delete this.tableConfig.filter.providerId;
    // this.statusId = null;
    this.selectedAmount = 0;
    this.selecteddata = [];
    this.page = 1;
    this.fetcAllData();
  }

  handleCategoryChange(event: any) {
    this.tableConfig.filter.providerId = event.providerId;
    this.selectedAmount = 0;
    this.selecteddata = [];
    this.page = 1;
    // this.statusId = event?.id;
    this.fetcAllData();
  }

  handleCardType(event: any) {
    this.tableConfig.filter.CardTypeId = event.id;
    this.selectedAmount = 0;
    this.selecteddata = [];
    this.page = 1;
    // this.statusId = event?.id;
    this.fetcAllData();
  }

  modelClose(num: any) {
    if (num == 1) {
      this.modalService.dismissAll();
      this.router.navigate(['credit-card'], { queryParams: { num: 2 } });
    }
    else {
      this.modalService.dismissAll();

    }

  }

  onCTClear() {

    delete this.tableConfig.filter.CardTypeId;
    // this.statusId = null;
    this.selectedAmount = 0;
    this.selecteddata = [];
    this.page = 1;
    this.fetcAllData();
  }
  erromessage: any
  onPostReconcilationIds() {
    // this.openmdel()
    this.creditcardservice.ReconcilationIds(this.onSelectString).subscribe(result => {
      if (result) {
        this.openmdel()
        setTimeout(() => {
          this.modelClose(1)
        }, 3000)

      }

    }, err => {
      this.erromessage = err?.error?.errors[0]?.ErrorMessageEn
      console.log(err);

      this.openmdelerroe()
      setTimeout(() => {
        this.modelClose(2)
      }, 3000)

    })
      .add(() => (this.loading = false));
  }



  validateInput(event: any) {
    const enteredValue = event.target.value;
    const pattern = /^[0-9]*\.?[0-9]*$/; // Regex pattern to allow numbers and decimal point
    if (!pattern.test(enteredValue)) {
      event.target.value = enteredValue.replace(/[^0-9.]/g, ''); // Remove any invalid characters
    }
  }
}
