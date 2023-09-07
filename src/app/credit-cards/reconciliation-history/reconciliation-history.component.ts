import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, takeUntil } from 'rxjs';
import { TableColumn, TableConfig } from 'src/app/shared/components/table-advanced';
import { DepositService } from 'src/app/shared/services/deposit.service';
// import { Category, Users, depositChequeList } from '../data';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { CreditCardService } from 'src/app/shared/services/credit-card.service';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/shared/services/header.service';

@Component({
  selector: 'app-reconciliation-history',
  templateUrl: './reconciliation-history.component.html',
  styleUrls: ['./reconciliation-history.component.scss']
})
export class ReconciliationHistoryComponent {
  unsubscribe = new Subject<void>();
  amountchange = new FormControl(null);
  netamountchange = new FormControl(null);
  searchText = new FormControl(null);
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


  /**
 * filter selection
 */
  commission: boolean = false;
  amount: boolean = false;
  netAmount: boolean = false;

  constructor(
    private creditcardservice: CreditCardService,
    private headerService: HeaderService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.headerService.setTitle('Reconciliation History');
    this.getData()
    this.initTableColumns();
    this.GetReconciliationTable()
    this.amountchange.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        const text: string = value || '';
        if (text?.length >= 0 || (!text?.length && this.tableConfig.filter.Amount?.length)) {
          this.tableConfig.filter.Amount = text;
          this.page = 1;
          this.GetReconciliationTable()
        }
      });
    this.netamountchange.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        const text: string = value || '';
        if (text?.length >= 0 || (!text?.length && this.tableConfig.filter.NetAmount?.length)) {
          this.tableConfig.filter.NetAmount = text;
          this.page = 1;
          this.GetReconciliationTable()
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
        key: 'reconciliationHistoryId',
        label: 'Reconciliation ID',
        canSort: true,
      },
      {
        key: 'createdBy.fullName',
        label: 'Created by',
        canSort: true,
      },
      {
        key: 'createdAt',
        label: 'Date',
        canSort: true,
      },
      {
        key: 'totalAmount',
        label: 'Amount',
        canSort: true,
      },
      // {
      //   key: 'Commission',
      //   label: 'Commission',
      // },
      {
        key: 'totalNetAmount',
        label: 'Net',
        canSort: true,
      },
      {
        key: 'Action',
        label: 'Action',
        canSort: false,
      },
    ];
  }



  onSortChange(sort: any) {
    if (sort?.direction && sort?.column) {
      switch (sort.column) {
        // case 'No':
        //   this.tableConfig.filter.Sort = sort.direction === 'desc' ? 3 : 2;
        //   break;
        case 'reconciliationHistoryId':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 3 : 2;
          break;
        case 'createdBy.fullName':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 5 : 4;
          break;
        case 'createdAt':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 7 : 6;
          break;
        case 'totalAmount':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 9 : 8;
          break;
        case 'totalNetAmount':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 11 : 10;
          break;
        // case 'Action':
        //   this.tableConfig.filter.Sort = sort.direction === 'desc' ? 15 : 13;
        //   break;
        default:
          break;
      }
    } else {
      this.tableConfig.filter.Sort = 1;
    }
    this.GetReconciliationTable()
  }

  onPageChange(page: number) {
    this.page = page;
    this.GetReconciliationTable();
  }

  removeSearchChequeNo() {
    this.searchChequeNo = '';
    this.sort = 1;

  }

  onDateValueChange(event: any) {
    var pipe = new DatePipe('en-US');
    this.startDate = pipe.transform(event) || '';
    console.log(this.startDate);
    if (this.startDate) {
      const fromDate = new Date(this.startDate);
      fromDate.setDate(fromDate.getDate() + 1); // Adding one day
      const formattedFromDate = fromDate.toISOString();
      this.tableConfig.filter.ReconciliationDate = formattedFromDate;

    } else
      this.tableConfig.filter.ReconciliationDate = this.startDate;
    this.page = 1;
    this.GetReconciliationTable()
  }



  removeCollectionDateFilter() {
    (this.startDate = '');
    if (this.datepickerInput)
      this.datepickerInput = '';
    this.page = 1;
    this.GetReconciliationTable()
  }

  // To Remove More Filters > Amount clear
  removeAmountFilter() {
    this.amountchange.setValue(null);
    this.tableConfig.filter.Amount = '';
    this.page = 1;
    this.GetReconciliationTable()
  }

  // To Remove Checkbox from More Filters > Amount
  filterAmount(event: any) {
    this.amount = event.checked;

    if (!this.amount) {
      this.amount = false
      this.amountchange.setValue(null);
      this.tableConfig.filter.Amount = '';
      this.page = 1;
      this.GetReconciliationTable()
    }
  }

  // To Remove More Filters > Net Amount clear
  removeNetAmountFilter() {
    this.netamountchange.setValue(null);
    this.tableConfig.filter.NetAmount = '';
    this.page = 1;
    this.GetReconciliationTable()
  }

  // To Remove Checkbox from More Filters > Net Amount
  filterNetAmount(event: any) {
    this.netAmount = event.checked;

    if (!this.netAmount) {
      this.netAmount = false
      this.netamountchange.setValue(null);
      this.tableConfig.filter.NetAmount = '';
      this.page = 1;
      this.GetReconciliationTable()
    }
  }


  provider: any[] = [];
  cardlist: any[] = [];

  getData() {
    const api1$ = this.creditcardservice.GetProviders(this.tableConfig.filter);
    const api2$ = this.creditcardservice.GetCards();
    forkJoin([api1$, api2$]).subscribe(
      ([result1, result2]) => {
        if (result1) {
          console.log(result1.data);

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

  GetReconciliationTable() {
    this.tableConfig.filter.PageNo = this.page - 1;

    const api1$ = this.creditcardservice.GetReconciliationHistory(this.tableConfig.filter);
    forkJoin([api1$]).subscribe(
      ([result1]) => {
        console.log(result1);
        if (result1) {
          this.chequeList = result1.data || [];
          this.totalAllRecordsCount = result1.totalRecordCount;
          this.total = result1.totalRecordCount;
        }
      })
  }

  handleCategoryChange(event: any) {
    this.tableConfig.filter.ProviderId = event.providerId;
    this.page = 1;
    this.GetReconciliationTable();
  }

  onClear() {
    delete this.tableConfig.filter.ProviderId;
    this.page = 1;
    this.GetReconciliationTable()
  }

  onCTClear() {
    delete this.tableConfig.filter.CardTypeId;
    this.page = 1;
    this.GetReconciliationTable()
  }

  handleCardType(event: any) {
    this.tableConfig.filter.CardTypeId = event.id;
    this.page = 1;
    this.GetReconciliationTable()
  }
  sendid(reconciliationHistoryId: any) {

    this.router.navigate(['credit-card/reconciliation-details'], { queryParams: { reconciliationHistoryid: reconciliationHistoryId } });
  }
  validateInput(event: any) {
    const enteredValue = event.target.value;
    const pattern = /^[0-9]*\.?[0-9]*$/; // Regex pattern to allow numbers and decimal point
    if (!pattern.test(enteredValue)) {
      event.target.value = enteredValue.replace(/[^0-9.]/g, ''); // Remove any invalid characters
    }
  }
}
