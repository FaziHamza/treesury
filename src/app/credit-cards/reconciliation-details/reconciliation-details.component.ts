import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableColumn, TableConfig } from 'src/app/shared/components/table-advanced';
import { ActivatedRoute } from '@angular/router';
import { CreditCardService } from 'src/app/shared/services/credit-card.service';
import {
  Subject, debounceTime, distinctUntilChanged, takeUntil, forkJoin
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { HeaderService } from 'src/app/shared/services/header.service';
@Component({
  selector: 'app-reconciliation-details',
  templateUrl: './reconciliation-details.component.html',
  styleUrls: ['./reconciliation-details.component.scss']
})
export class ReconciliationDetailsComponent {
  searchChequeText = new FormControl(null);
  searchText = new FormControl(null);
  unsubscribe = new Subject<void>();
  datepickerInput: any;
  tableColumns: TableColumn[] = [];
  searchChequeNo: string = '';
  searchCustomerNo: string = '';
  loading = false;
  chequeList: any[] = [];
  totalAllRecordsCount = 0;
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
  provider: any;
  reconsilationstepid: any
  reconciliation: any
  constructor(private route: ActivatedRoute,
    private creditcardservice: CreditCardService,
    private headerService: HeaderService) {
    const step = this.route.snapshot.queryParamMap.get('reconciliationHistoryid')
    if (step) {
      console.log();

      this.reconsilationstepid = step
    }
    else {

    }
  }

  ngOnInit() {
    this.headerService.setTitle('Reconciliation History > Reconciliation Details');
    this.initTableColumns();
    this.fetchData();
    this.GetReconciliationTable(this.reconsilationstepid)
    this.searchChequeText.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        const text: string = value || '';
        if (text?.length >= 4 || (!text?.length && this.tableConfig.filter.Last4digits?.length)) {
          this.tableConfig.filter.Last4digits = text;
          this.page = 1;
          this.GetReconciliationTable(this.reconsilationstepid)
        }
      });
    this.searchText.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        const text: string = value || '';
        if (
          text?.length >= 3 ||
          (!text?.length && this.tableConfig.filter.MachineReceipt?.length)
        ) {
          this.tableConfig.filter.MachineReceipt = text;
          this.page = 1;
          this.GetReconciliationTable(this.reconsilationstepid)
        }
      });
  }
  ngOnDestroy() { }

  initTableColumns() {
    this.tableColumns = [
      {
        key: 'No',
        label: 'No.',
        canSort: false,
      },
      {
        key: 'cardLast4Digits',
        label: 'Last 4 Digit',
        canSort: true,
      },
      {
        key: 'reconciliationDetailId',
        label: 'Reconciliation ID',
        canSort: true,
      },
      {
        key: 'provider',
        label: 'Provider',
        canSort: true,
      },
      {
        key: 'machineReceiptNumber',
        label: 'Credit Card Machine Receipt Number',
        canSort: true,
      },
      {
        key: 'createdAt',
        label: 'Date',
        canSort: true,
      },
      {
        key: 'branch',
        label: 'Branch Name',
        canSort: true,
      },

      {
        key: 'register',
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
        key: 'cardCollectionJodNet',
        label: 'Net Reconciliation Amount:',
        canSort: true,
      },
    ];
  }

  fetchData() {
  }

  onSortChange(sort: any) {
    if (sort?.direction && sort?.column) {
      switch (sort.column) {
        // case 'No':
        //   this.tableConfig.filter.Sort = sort.direction === 'desc' ? 3 : 2;
        //   break;
        case 'cardLast4Digits':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 3 : 2;
          break;
        case 'reconciliationDetailId':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 5 : 4;
          break;
        case 'provider':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 7 : 6;
          break;
        case 'machineReceiptNumber':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 9 : 8;
          break;

        case 'createdAt':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 11 : 10;
          break;
        case 'branch':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 13 : 12;
          break;
        case 'register':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 15 : 14;
          break;
        case 'cardType':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 17 : 16;
          break;
        case 'cardCollectionJod':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 19 : 18;
          break;
        case 'cardCollectionJodNet':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 21 : 20;
          break;
        default:
          break;
      }
    } else {
      this.tableConfig.filter.Sort = 1;
    }
    this.GetReconciliationTable(this.reconsilationstepid)
  }

  onPageChange(page: number) {
    this.page = page;
  }

  removeSearchChequeNo() {
    this.searchChequeNo = '';
    this.sort = 1;
    this.page = 1;
    this.fetchData();
  }

  searchCheque(event: any) {
    const text = event.target.value;
    if (text.length >= 2) {
      this.searchChequeNo = text;
      this.page = 0;
      this.fetchData();
    }
    if (text.length == 0) {
      this.page = 1;
      this.fetchData();
    }
  }

  removeSearchCustomerNo() {
    this.searchCustomerNo = '';
    this.sort = 1;
    this.page = 1;
    this.fetchData();
  }

  searchCustomer(event: any) {
    const text = event.target.value;
    if (text.length >= 2) {
      this.searchCustomerNo = text;
      this.page = 0;
      this.fetchData();
    }
    if (text.length == 0) {
      this.page = 1;
      this.fetchData();
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
    this.page = 1;
    this.GetReconciliationTable(this.reconsilationstepid)
  }

  removeCollectionDateFilter() {
    (this.startDate = '');
    if (this.datepickerInput)
      this.datepickerInput = '';
    this.page = 1;
    this.fetchData();
  }

  extractedTime: any;

  GetReconciliationTable(id: any) {
    this.tableConfig.filter.PageNo = this.page - 1;

    this.tableConfig.filter.ReconciliationId = parseInt(id)
    const api1$ = this.creditcardservice.GetReconciliationHistory(this.tableConfig.filter);
    const api2$ = this.creditcardservice.ReconciledTransactionsList(this.tableConfig.filter);
    const api3$ = this.creditcardservice.GetProviders(this.tableConfig.filter);
    forkJoin([api1$, api2$, api3$]).subscribe(
      ([result1, result2, result3]) => {
        if (result1) {
          this.reconciliation = result1.data
          this.extractedTime = this.reconciliation[0]?.createdAt;
          // const date = new Date(dateString);
          // this.extractedTime = date.toLocaleTimeString();
          // console.log("DAte", dateString)
        }
        if (result2) {
          this.chequeList = result2.data
          console.log("", result2)
          this.totalAllRecordsCount = result2.totalRecordCount;
          this.total = result2.totalRecordCount;
        }
        if (result3) {
          this.provider = result3.data
        }
      })
  }

  handleCategoryChange(event: any) {
    console.log('bhushan ==>', event.providerId);

    this.tableConfig.filter.providerId = event.providerId;
    // this.statusId = event?.id;
    this.page = 1;
    this.GetReconciliationTable(this.reconsilationstepid)
  }

  onClear() {
    delete this.tableConfig.filter.providerId;
    // this.statusId = null;
    this.page = 1;
    this.GetReconciliationTable(this.reconsilationstepid)
  }

  removeFourDigit() {
    this.searchChequeText.setValue(null);
    this.tableConfig.filter.Last4digits = '';
    this.page = 1;
    this.GetReconciliationTable(this.reconsilationstepid)
  }
}

