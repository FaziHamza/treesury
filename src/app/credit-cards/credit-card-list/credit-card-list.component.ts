import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableColumn, TableConfig } from 'src/app/shared/components/table-advanced';
import { CreditCardService } from 'src/app/shared/services/credit-card.service';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/shared/services/header.service';
@Component({
  selector: 'app-credit-card-list',
  templateUrl: './credit-card-list.component.html',
  styleUrls: ['./credit-card-list.component.scss'],
})
export class CreditCardListComponent {
  constructor(private creditcardservice: CreditCardService, public router: Router, private headerService: HeaderService) {

  }

  // Form controls for search inputs
  searchChequeText = new FormControl(null);
  searchText = new FormControl(null);
  amountchange = new FormControl(null);
  SessionNumberchange = new FormControl(null);
  netamountchange = new FormControl(null);
  unsubscribe = new Subject<void>();
  CommissionRatiochange = new FormControl(0);

  // Other variables
  datepickerInput: any;
  tableColumns: TableColumn[] = [];
  searchChequeNo: string = '';
  searchCustomerNo: string = '';
  loading = false;
  chequeList: any[] = [];
  dropDownbankId: any[] = [];
  cardlist: any = [];
  branch: any = [];
  register: any = [];
  carddetial: any = [];
  totalAllRecordsCount = 0;
  provider: any;
  cardType: any;
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
  ngOnInit() {

    // Set the page title
    this.headerService.setTitle('Credit Cards Payments ');

    // Initialize table columns
    this.initTableColumns();

    // Fetch data from APIs
    this.getdata();
    this.gettable();

    // Subscribe to form control value changes for search inputs
    this.searchChequeText.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        // Update the Last4digits filter and refresh the table
        const text: string = value || '';
        if (text?.length >= 3 || (!text?.length && this.tableConfig.filter.Last4digits?.length)) {
          this.tableConfig.filter.Last4digits = text;
          this.page = 1;
          this.gettable();
        }
      });

    this.searchText.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        // Update the MachineReceipt filter and refresh the table
        const text: string = value || '';
        if (
          text?.length >= 3 ||
          (!text?.length && this.tableConfig.filter.MachineReceipt?.length)
        ) {
          this.tableConfig.filter.MachineReceipt = text;
          this.page = 1;
          this.gettable();
        }
      });
    this.amountchange.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        // Update the Amount filter and refresh the table
        const text: string = value || '';
        if (text?.length >= 0 || (!text?.length && this.tableConfig.filter.Amount?.length)) {
          this.tableConfig.filter.Amount = text;
          this.page = 1;
          this.gettable();
        }
      });

    this.SessionNumberchange.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        // Update the Amount filter and refresh the table
        const text: string = value || '';
        if (text?.length >= 0 || (!text?.length && this.tableConfig.filter.SessionNumber?.length)) {
          let checktext = parseFloat(text);
          if (!isNaN(checktext))
            this.tableConfig.filter.RegisterSessionId = checktext;
          this.page = 1;
          this.gettable();
        }
      });

    this.netamountchange.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        // Update the NetAmount filter and refresh the table
        const text: string = value || '';
        if (text?.length >= 0 || (!text?.length && this.tableConfig.filter.NetAmount?.length)) {
          this.tableConfig.filter.NetAmount = text;
          this.page = 1;
          this.gettable();
        }
      });
  }

  ngOnDestroy() {
    // Unsubscribe from subscriptions to avoid memory leaks
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // Initialize table columns
  initTableColumns() {
    this.tableColumns = [
      // Define columns with their keys and labels
      {
        key: 'cardLast4Digits',
        label: 'Last 4 Digit',
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
        key: 'collectionAt',
        label: 'Date',
        canSort: true,
      },
      {
        key: 'branch',
        label: 'Branch Name',
        canSort: true,
      },
      {
        key: 'registers',
        label: 'Ragister Name',
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
        label: 'Commission Ratio',
        canSort: true,
      },
      {
        key: 'cardCollectionJodNet',
        label: 'Net',
        canSort: true,
      },
      {
        key: 'registerSessionId',
        label: 'Session Number',
        canSort: true,
      },
      {
        key: 'statusObj',
        label: 'Status',
        canSort: true,
      },
      {
        key: 'Action',
        label: 'Action',
        canSort: true,
      },
    ];
  }

  // Handle table sort change
  onSortChange(sort: any) {
    if (sort?.direction && sort?.column) {
      // Map the sort column to the corresponding filter property
      switch (sort.column) {
        case 'cardLast4Digits':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 3 : 2;
          break;
        case 'provider':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 5 : 4;
          break;
        case 'machineReceiptNumber':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 7 : 6;
          break;
        case 'collectionAt':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 9 : 8;
          break;
        case 'branch':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 11 : 10;
          break;
        case 'registers':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 13 : 12;
          break;
        case 'cardType':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 15 : 14;
          break;
        case 'cardCollectionJod':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 17 : 16;
          break;
        case 'commission':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 19 : 18;
          break;
        case 'cardCollectionJodNet':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 21 : 20;
          break;
        case 'registerSessionId':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 23 : 22;
          break;
        case 'statusObj':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 25 : 24;
          break;
        case 'Action':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 27 : 26;
          break;

        default:
          break;
      }
    } else {
      this.tableConfig.filter.Sort = 1;
    }
    this.gettable();
  }


  // Fetch necessary data from APIs
  getdata() {
    const api1$ = this.creditcardservice.GetProviders(this.tableConfig.filter);
    const api2$ = this.creditcardservice.GetCards();
    const api3$ = this.creditcardservice.GetBranch(this.tableConfig.filter);
    const api4$ = this.creditcardservice.GetRegister(this.tableConfig.filter);
    const api5$ = this.creditcardservice.Getcard();
    forkJoin([api1$, api2$, api3$, api4$, api5$]).subscribe(
      ([result1, result2, result3, result4, result5]) => {
        // Store the fetched data in respective variables
        if (result1) {
          this.provider = result1.data || [];
        }
        if (result2) {
          this.cardlist = result2.data || [];
        }
        if (result3) {
          this.branch = result3.data || [];
        }
        if (result4) {
          this.register = result4.data || [];
        }
        if (result5) {
          this.carddetial = result5.data || [];
        }
      },
      error => {
        console.error(error);
      },
      () => {
        this.loading = false;
      },
    );
  }

  // Fetch table data
  gettable() {
    this.loading = true;

    this.tableConfig.filter.PageNo = this.page - 1;

    this.creditcardservice
      .GetTable(this.tableConfig.filter)
      .subscribe(result => {
        if (result) {
          this.chequeList = result.data;
          this.totalAllRecordsCount = result.totalRecordCount;
          this.total = result.totalRecordCount;
        }
      })
      .add(() => (this.loading = false));

  }


  // Handle table sort change
  onPageChange(page: number) {
    console.log(page);
    this.page = page;
    this.gettable();
  }
  newDropdownbank: any = [];
  removelast4Filter() {
    this.searchChequeText.setValue(null);
    this.tableConfig.filter.Last4digits = '';
    this.page = 1;
    this.gettable();
  }
  removebankFilter() {
    this.newDropdownbank = [];
    this.dropDownbankId = [];
    this.bank = false;
    this.page = 1;
    this.gettable();
  }

  removeInvoiceFilter() {
    this.searchText.setValue(null);
    this.tableConfig.filter.MachineReceipt = '';
    this.page = 1;
    this.gettable();
  }

  removeCommissionFilter() {
    this.Commission = false;
    this.CommissionRatiochange.setValue(0);
    this.tableConfig.filter.Commission = '';
    this.page = 1;
    this.gettable();
  }

  removeAmountFilter() {
    this.amountchange.setValue(null);
    this.tableConfig.filter.Amount = '';
    this.page = 1;
    this.gettable();
  }
  removeSectionFilter() {
    this.SessionNumberchange.setValue(null);
    this.tableConfig.filter.RegisterSessionId = '';
    this.page = 1;
    this.gettable();
  }

  removeNetAmountFilter() {
    this.netamountchange.setValue(null);
    this.tableConfig.filter.NetAmount = '';
    this.page = 1;
    this.gettable();
  }

  removeBranchNameFilter() {
    this.BranchName = false;
    this.branch = '';
    this.page = 1;
    this.gettable();
  }

  removeRegisterNameFilter() {
    this.RegisterName = false;
    this.page = 1;
    this.gettable();
  }

  bank: boolean = false;
  dueDate: boolean = false;
  RegisterName: boolean = false;
  BranchName: boolean = false;
  NetAmount: boolean = false;
  Amount: boolean = false;
  SessionNumber: boolean = false;
  Commission: boolean = false;
  Invoice: boolean = false;
  statusId: any;


  filterRegisterName(event: any) {
    this.RegisterName = event.checked;
    if (!this.RegisterName) {
      this.RegisterName = false
      delete this.tableConfig.filter.RegisterId;
      this.page = 1;
      this.gettable();

    }
  }
  filterBranchName(event: any) {
    this.BranchName = event.checked;
    if (!this.BranchName) {
      this.BranchName = false
      delete this.tableConfig.filter.BranchId;
      this.page = 1;
      this.gettable();

    }
  }
  filterNetAmount(event: any) {
    this.NetAmount = event.checked;
    if (!this.NetAmount) {
      this.NetAmount = false
      this.netamountchange.setValue(null);
      this.tableConfig.filter.netamountchange = '';
      this.page = 1;
      this.gettable();
    }
  }
  filterAmount(event: any) {
    this.Amount = event.checked;
    if (!this.Amount) {
      this.Amount = false
      this.amountchange.setValue(null);
      this.tableConfig.filter.amountchange = '';
      this.page = 1;
      this.gettable();
    }
  }
  filterSessionNumber(event: any) {
    this.SessionNumber = event.checked;
    if (!this.SessionNumber) {
      this.SessionNumber = false
      this.SessionNumberchange.setValue(null);
      this.tableConfig.filter.RegisterSessionId = '';
      this.page = 1;
      this.gettable();
    }
  }
  filterCommission(event: any) {
    this.Commission = event.checked;
    if (!this.Commission) {
      this.Commission = false
      this.CommissionRatiochange.setValue(null);
      this.tableConfig.filter.Commission = '';
      this.page = 1;
      this.gettable();
    }
  }
  filterInvoice(event: any) {
    this.Invoice = event.checked;
    if (!this.Invoice) {
      this.Invoice = false
      this.searchText.setValue(null);
      this.tableConfig.filter.searchText = '';
      this.page = 1;
      this.gettable();
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
    this.gettable();
  }

  removeCollectionDateFilter() {
    delete this.tableConfig.filter.CollectionDate
    this.page = 1;
    this.datepickerInput = null
    this.gettable();
  }

  handleCategoryChange(event: any) {
    console.log('bhushan ==>', event.providerId);

    this.tableConfig.filter.providerId = event.providerId;
    this.page = 1;
    // this.statusId = event?.id;
    this.gettable();
  }

  handleCategoryChange2(event: any) {
    this.tableConfig.filter.CardTypeId = event.id;
    this.page = 1;
    // this.statusId = event?.id;
    this.gettable();
  }
  newDropdownbranch: any = [];
  dropDownbranchId: any[] = [];

  handleCategoryChange3(item: any, event: any) {
    const obj4 = item.branchName;
    const branchId = item.branchId;
    if (event.target.checked) {
      // checking if the checkbox has been checked

      this.newDropdownbranch.push(obj4); // pushing object to newArray[]
      this.dropDownbranchId.push(branchId); // pushing object to newArray[]
    } else {
      this.newDropdownbranch = this.newDropdownbranch.filter(
        (v: any) => v !== obj4
      ); // if the checkbox has been unchecked removing the object from the array

      this.dropDownbranchId = this.dropDownbranchId.filter(
        (x) => x !== branchId
      );
    }
    this.tableConfig.filter.BranchId = this.dropDownbranchId;
    this.page = 1;
    // this.statusId = event?.id;
    this.gettable();
  }
  removebranchFilter() {
    this.newDropdownbranch = [];
    this.dropDownbranchId = [];
    this.tableConfig.filter.BranchId = [];
    this.BranchName = false;
    this.page = 1;
    this.gettable();
  }
  newDropdownregister: any = [];
  dropDownregisterId: any[] = [];
  handleCategoryChange4(item: any, event: any) {
    const obj4 = item.registersName;
    const id = item.id;
    if (event.target.checked) {
      // checking if the checkbox has been checked

      this.newDropdownregister.push(obj4); // pushing object to newArray[]
      this.dropDownregisterId.push(id); // pushing object to newArray[]
    } else {
      this.newDropdownregister = this.newDropdownregister.filter(
        (v: any) => v !== obj4
      ); // if the checkbox has been unchecked removing the object from the array

      this.dropDownregisterId = this.dropDownregisterId.filter(
        (x) => x !== id
      );
    }
    this.tableConfig.filter.RegisterId = this.dropDownregisterId;
    this.page = 1;
    // this.statusId = event?.id;
    this.gettable();
  }
  removeregisterFilter() {
    this.newDropdownregister = [];
    this.dropDownregisterId = [];
    this.tableConfig.filter.RegisterId = [];
    this.RegisterName = false;
    this.page = 1;
    this.gettable();
  }
  onClear() {
    delete this.tableConfig.filter.BranchId;
    this.page = 1;
    this.gettable();
  }

  onClearR() {
    delete this.tableConfig.filter.RegisterId;
    this.page = 1;
    this.gettable();
  }
  onClearcard() {
    delete this.tableConfig.filter.CardTypeId;
    this.page = 1;
    this.gettable();
  }
  IsPDCFilter(value: any) {
    this.tableConfig.filter.Status = value;
    // this.statusId = event?.id;
    this.page = 1;
    this.gettable();
  }

  // Navigate to payment details page
  gotopaymentdetails(value: any) {
    this.router.navigate(['credit-card/payment-details'], { queryParams: { ordersCardsCollectionId: value } });
  }
  onClearprovider() {
    delete this.tableConfig.filter.providerId
    this.page = 1;
    this.gettable();
  }
  inputvalue(value: any) {
    let checkPoint = false;
    const inputValue = value?.target?.value;
    if (inputValue && inputValue.includes('.')) {
      const parts = inputValue.split('.');
      if (parts.length === 2 && parts[1].length > 0) {
        if (inputValue === '0.0')
          checkPoint = true;
        else if (inputValue === '0.00')
          checkPoint = true;
        else checkPoint = false;
      } else if (parts.length === 2 && parts[1].length === 0) {
        checkPoint = true;
      } else {
        checkPoint = false;
      }
    }
    if (!checkPoint && parseFloat(inputValue) > 0) {
      this.tableConfig.filter.Commission = parseFloat(inputValue).toFixed(3);
      this.CommissionRatiochange.patchValue(parseFloat(parseFloat(inputValue).toFixed(3)));
      this.page = 1;
      this.sort = 1;
      this.gettable();
    }
    else if (inputValue.includes('-')) {
      this.CommissionRatiochange.patchValue(0);
    }
    else if (isNaN(parseFloat(inputValue))) {
      this.CommissionRatiochange.patchValue(0);
    }
    else if (parseFloat(inputValue) == 0 && !checkPoint) {
      this.CommissionRatiochange.patchValue(0);
    }
  }
  validateInput(event: any) {
    const enteredValue = event.target.value;
    const pattern = /^[0-9]*\.?[0-9]*$/; // Regex pattern to allow numbers and decimal point
    if (!pattern.test(enteredValue)) {
      event.target.value = enteredValue.replace(/[^0-9.]/g, ''); // Remove any invalid characters
    }
  }
  validateNumberInput(event: any) {
    const enteredValue = event.target.value;
    const pattern = /^[1-9]\d*$/; // Regex pattern to allow positive integers
    if (!pattern.test(enteredValue)) {
      event.target.value = enteredValue.replace(/[^1-9]/g, ''); // Remove any invalid characters
    }
  }
  validateCommissionInput(event: any) {
    const enteredValue = event.target.value;
    const pattern = /^[1-9]\d*$/; // Regex pattern to allow positive integers
    if (!pattern.test(enteredValue)) {
      event.target.value = enteredValue.replace(/[^1-9]/g, ''); // Remove any invalid characters
    } else {
      // Check if the value is greater than 100, and if so, set it to 100
      const numericValue = parseInt(enteredValue, 10);
      if (numericValue > 100) {
        event.target.value = '100';
      }
    }
  }

}
