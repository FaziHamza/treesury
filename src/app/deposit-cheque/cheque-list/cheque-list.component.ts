import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, takeUntil } from 'rxjs';
import { TableColumn, TableConfig } from 'src/app/shared/components/table-advanced';
import { DepositService } from 'src/app/shared/services/deposit.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepositChequeModalComponent } from '../deposit-cheque-modal/deposit-cheque-modal.component';
import { ReplaceChequeComponent } from '../replace-cheque/replace-cheque.component';
import { ReplacedChequeDetailViewComponent } from '../cheque-dashboard/replaced-cheque-detail-view/replaced-cheque-detail-view.component';
import { FormControl } from '@angular/forms';
import { PermissionService } from 'src/app/shared/services/permission.service';

@Component({
  selector: 'app-cheque-list',
  templateUrl: './cheque-list.component.html',
  styleUrls: ['./cheque-list.component.scss']
})
export class ChequeListComponent implements OnInit, OnDestroy {
  searchText = new FormControl(null);
  searchChequeText = new FormControl(null);
  loading = false;
  page = 1;
  total = 0;
  limit = 6;
  sort: number = 1;
  tableConfig: TableConfig = {
    paging: true,
    filter: {
      Sort: 1,
      PageSize: this.limit,
    },
  };
  search = new FormControl(null);
  tableColumns: TableColumn[] = [];
  deposites: any = [];
  totalAllRecordsCount = 0;
  unsubscribe = new Subject<void>();
  statusId: any;
  actionList: any[] = [];
  constructor(
    private modalService: NgbModal, private depositservice: DepositService,
    private permission: PermissionService
  ) { }

  ngOnInit(): void {
    this.getbanks();
    this.initTableColumns();
    this.fetchData();
    this.searchChequeText.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        const text: string = value || '';
        if (text?.length >= 3 || (!text?.length && this.tableConfig.filter.ChequeNo?.length)) {
          this.tableConfig.filter.ChequeNo = text;
          this.page = 1;
          this.selecteddata = [];
          this.fetchData();
        }
      });
    this.searchText.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        const text: string = value || '';
        if (text?.length >= 3 || (!text?.length && this.tableConfig.filter.Customer?.length)) {
          this.tableConfig.filter.Customer = text;
          this.selecteddata = [];
          this.page = 1;
          this.fetchData();
        }
      });
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  fetchData() {
    this.loading = true;
    // this.makeDepositList(depositChequeList);
    // this.tableConfig.filter.BranchTypeId = this.selectedBranch.id;
    this.tableConfig.filter.PageNo = this.page - 1;
    this.depositservice
      .getDepositCheques(this.tableConfig.filter)
      .subscribe(result => {
        if (result) {
          this.makeListData(result.data || []);
          if (this.selecteddata.length > 0) {
            this.deposites.forEach((element: any) => {
              let findElement = this.selecteddata.find(elem => elem.id == element.id);
              if (findElement)
                element.checked = true;
            });
          }
          this.totalAllRecordsCount = result?.totalRecordCount;
          this.total = result?.totalRecordCount;
        }
      })
      .add(() => (this.loading = false));
  }

  onSortChange(sort: any) {
    if (sort?.direction && sort?.column) {
      switch (sort.column) {
        case 'chequeNo':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 3 : 2;
          break;
        case 'customerName':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 5 : 4;
          break;
        case 'bank':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 7 : 6;
          break;
        case 'chequeDate':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 9 : 8;
          break;
        case 'chequeCollectionJod':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 11 : 10;
          break;
        case 'collectedAt':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 13 : 12;
          break;
        case 'status':
          this.tableConfig.filter.Sort = sort.direction === 'desc' ? 15 : 14;
          break;
        default:
          break;
      }
    } else {
      this.tableConfig.filter.Sort = 1;
    }
    this.fetchData();
  }

  onPageChange(page: number) {
    this.page = page;
    this.fetchData();
  }

  initTableColumns() {
    this.tableColumns = [
      {
        key: 'select',
        label: 'Select All',
        canSort: true,
      },
      {
        key: 'chequeNo',
        label: 'Cheque No',
        canSort: true,
      },
      {
        key: 'customerName',
        label: 'Customer Name',
        canSort: true,
      },
      {
        key: 'bank',
        label: 'Bank Name',
        canSort: true,
      },
      {
        key: 'chequeDate',
        label: 'Due Date',
        canSort: true,
      },
      {
        key: 'chequeCollectionJod',
        label: 'Amount',
        canSort: true,
      },
      {
        key: 'collectedAt',
        label: 'Collection Date',
        canSort: true,
      },
      {
        key: 'status',
        label: 'Status',
        canSort: true,
      },
      {
        key: 'action',
        label: 'Action',
      },
    ];
  }

  getStatusLabel(item: any): string {
    if (item && item.name && item.name.length > 0) {
      return item.name[0].lookupName;
    }
    return '';
  }
  onSelectData(selectedData: any) {

  }
  selecteddata: any[] = [];
  getSelectedItem(data: any, event: any): any {
    if (this.selecteddata.length == 0 && event.target.checked) {
      this.sort = 1;
      this.page = 1;
      if (this.tableConfig.filter.Status != data.status) {
        this.selecteddata.push(data);
        this.tableConfig.filter.Status = data.status;
        this.fetchData();
      } else
        this.selecteddata.push(data);
    }
    else if (event.target.checked) {
      this.selecteddata.push(data);
    } else {
      const index = this.selecteddata.findIndex(selectedDataItem => {
        return this.areObjectsEqual(selectedDataItem, data);
      });
      if (index !== -1) {
        this.selecteddata.splice(index, 1);
      }
    }
  }
  areObjectsEqual(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  showMultiSelect = false;
  multiSelect() {
    this.showMultiSelect = true;
  }
  removeSearch() {
    this.searchText.setValue(null);
    this.sort = 1;
    this.selecteddata = [];
    this.page = 1;
    delete this.tableConfig.filter.Customer;
    this.fetchData();
  }
  removeChequeSearch() {
    this.searchChequeText.setValue(null);
    this.sort = 1;
    this.page = 1;
    this.selecteddata = [];
    delete this.tableConfig.filter.ChequeNo;
    this.fetchData();
  }

  handleCategoryChange(event: any) {
    this.tableConfig.filter.Status = event.id;
    // this.statusId = event?.id;
    this.sort = 1;
    this.page = 1;
    this.selecteddata = [];
    this.fetchData();
  }
  onClear() {
    delete this.tableConfig.filter.Status;
    // this.statusId = null;
    this.selecteddata = [];
    this.page = 1;
    this.fetchData();
  }

  /**
 * filter selection
 */
  bank: boolean = false;
  amount: boolean = false;
  displayAmount = new FormControl(0);
  collectionDate: boolean = false;
  dueDate: boolean = false;

  filterbank(event: any) {
    this.bank = event.checked;
  }
  filteramount(event: any) {
    this.amount = event.checked;
  }
  filterCollectionDates(event: any) {
    this.collectionDate = event.checked;
  }
  filterDueDates(event: any) {
    this.dueDate = event.checked;
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
      this.tableConfig.filter.Amount = parseFloat(inputValue).toFixed(3);
      this.displayAmount.patchValue(parseFloat(parseFloat(inputValue).toFixed(3)));
      this.page = 1;
      this.selecteddata = [];
      this.sort = 1;
      this.fetchData();
    }
    else if (inputValue.includes('-')) {
      this.displayAmount.patchValue(0);
    }
    else if (isNaN(parseFloat(inputValue))) {
      this.displayAmount.patchValue(0);
    }
    else if (parseFloat(inputValue) == 0 && !checkPoint) {
      this.displayAmount.patchValue(0);
    }
  }
  /**
* get Branches
*/

  banksList: any;
  getbanks() {
    const api1$ = this.depositservice.getBankLookups(11);
    const api2$ = this.depositservice.getLookups(28);
    const api3$ = this.depositservice.getLookups(29);
    forkJoin([api1$, api2$, api3$]).subscribe(
      ([result1, result2, result3]) => {

        if (result1) {
          this.banksList = result1.data || []
        }
        console.log("ss", result2)
        if (result2) {
          this.statusId = result2.data || [];
        }
        if (result3) {
          this.actionList = result3.data || [];
          this.makeActionList();

        }
      },
      (error) => {
        console.error(error);
      },
      () => {
        this.loading = false;
      }
    );
  }
  firstActionList: any[] = [];
  secondActionList: any[] = [];
  makeListData(data: any) {
    const updatedData = data.map((item: any) => {
      const collectedAtDate = new Date(item.chequeDate);
      const currentDate = new Date();

      const isCollectedInPast = collectedAtDate < currentDate && item.statusObj?.translations?.[0]?.lookupName != 'Collected';

      return {
        ...item,
        isCollectedInPast: isCollectedInPast
      };
    });

    this.deposites = updatedData;

  }
  makeActionList() {

    const firstArrayLookupNames = [29002, 29003, 29001, 29006];
    const secondArrayLookupNames = [29004, 29003];
    this.firstActionList = this.actionList.filter(item =>
      firstArrayLookupNames.includes(item.id)
    );
    this.secondActionList = this.actionList.filter(item =>
      secondArrayLookupNames.includes(item.id)
    );
  }

  depositDetail(item: any, row: any) {
    if (item?.id == 29002)
      this.openModalTrigger(item, row, 'Returned Cheque Details View', true, true)
    else if (item?.id == 29001)
      this.openModalTrigger(item, row, 'Bounce Cheque', true, true)
    else if (item?.id == 29003)
      this.replace(item, row)
    else if (item?.id == 29004)
      this.openModalTrigger(item, row, 'Re-deposited Cheque Details View', true, true)
    else if (item?.id == 29006)
      this.openModalTrigger(item, row, 'Collect Cheque', true, false)
    else if (item?.name?.[0].lookupName == 'replace-view')
      this.replaceView()
  }
  /**
 * remove branch filter
 */
  newDropdownbank: any = [];
  removebankFilter() {
    this.newDropdownbank = [];
    this.dropDownbankId = [];
    delete this.tableConfig.filter.BankId;
    this.bank = false;
    this.page = 1;
    this.selecteddata = [];
    this.sort = 1;
    this.fetchData();
  }

  removeCollectionDateFilter() {
    this.collectionDate = false;
    delete this.tableConfig.filter.FromDate;
    delete this.tableConfig.filter.ToDate;
    this.selecteddata = [];
    this.page = 1;
    this.sort = 1;
    this.fetchData();
  }

  removeDueCollectionDateFilter() {
    this.dueDate = false;
    delete this.tableConfig.filter.FromDueDate;
    delete this.tableConfig.filter.ToDueDate;
    this.selecteddata = [];
    this.page = 1;
    this.sort = 1;
    this.fetchData();
  }
  removeAmount() {
    this.displayAmount.patchValue(0);
    this.amount = false;
    delete this.tableConfig.filter.Amount;
    this.page = 1;
    this.selecteddata = [];
    this.sort = 1;
    this.fetchData();
  }
  dropDownbankId: any[] = [];
  applybank(item: any, event: any) {
    const obj4 = item.name?.[0].lookupName;
    const bankId = item.id;
    if (event.target.checked) {
      // checking if the checkbox has been checked

      this.newDropdownbank.push(obj4); // pushing object to newArray[]
      this.dropDownbankId.push(bankId); // pushing object to newArray[]
    } else {
      this.newDropdownbank = this.newDropdownbank.filter(
        (v: any) => v !== obj4
      ); // if the checkbox has been unchecked removing the object from the array

      this.dropDownbankId = this.dropDownbankId.filter(
        (x) => x !== bankId
      );
    }
    this.tableConfig.filter.BankId = this.dropDownbankId;
    this.selecteddata = [];
    this.page = 1;
    this.fetchData();
  }

  onDateValueChange(event: any) {
    var pipe = new DatePipe('en-US');
    let startDate = pipe.transform(event[0]) || '';
    let endDate = pipe.transform(event[1]) || '';
    this.tableConfig.filter.FromDate = startDate;
    this.tableConfig.filter.ToDate = endDate;
    this.selecteddata = [];
    this.page = 1;
    this.sort = 1;
    this.fetchData();
  }

  onDueDateValueChange(event: any) {
    var pipe = new DatePipe('en-US');
    let startDate = pipe.transform(event[0]) || '';
    let endDate = pipe.transform(event[1]) || '';
    if (startDate) {
      const fromDate = new Date(startDate);
      fromDate.setDate(fromDate.getDate() + 1); // Adding one day
      const formattedFromDate = fromDate.toISOString();
      this.tableConfig.filter.FromDueDate = formattedFromDate;

    } else
        this.tableConfig.filter.FromDueDate = startDate;
    if (endDate) {
      const fromDate = new Date(endDate);
      fromDate.setDate(fromDate.getDate() + 1); // Adding one day
      const formattedFromDate = fromDate.toISOString();
      this.tableConfig.filter.ToDueDate = formattedFromDate;

    } else
         this.tableConfig.filter.ToDueDate = endDate;
    this.selecteddata = [];
    this.page = 1;
    this.sort = 1;
    this.fetchData();
  }

  IsPDCFilter(IsPDC: any) {
    this.tableConfig.filter.IsPDC = IsPDC;
    this.selecteddata = [];
    this.page = 1;
    this.sort = 1;
    this.fetchData();
  }

  openModalTrigger(actionType: any, detail: any, item: any, confirm: boolean, detailShow: boolean): void {
    let listArray: any[] = [];
    if (this.showMultiSelect) {
      this.selecteddata.forEach(element => {
        const data = this.deposites.find((a: any) => a.id === element.id);
        listArray.push(data);
      });
    } else
      listArray = [detail];

    const modalRef = this.modalService.open(DepositChequeModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
    modalRef.componentInstance.details = listArray;
    modalRef.componentInstance.title = item;
    modalRef.componentInstance.isConfirmShow = confirm;
    modalRef.componentInstance.detailShow = detailShow;
    modalRef.componentInstance.actionType = actionType;
    modalRef.componentInstance.sendtoLoadData.subscribe((result: any) => {
      if (result)
        this.ngOnInit();
      console.log('resendtoLoadDatasult', result);
      this.modalService.dismissAll();


      // this.getList();
    });
  }

  replace(actionType: any, detail: any) {
    const modalRef = this.modalService.open(ReplaceChequeComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });
    modalRef.componentInstance.details = detail;
    modalRef.componentInstance.actionType = actionType;
    modalRef.componentInstance.sendtoLoadData.subscribe((result: any) => {
      if (result) {
        this.ngOnInit();
      }
      console.log('resendtoLoadDatasult', result);


      this.modalService.dismissAll();
      // this.getList();
    });
  }

  replaceView() {
    const modalRef = this.modalService.open(ReplacedChequeDetailViewComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });
    modalRef.componentInstance.sendtoLoadData.subscribe((result: any) => {
      console.log('resendtoLoadDatasult', result);
      this.modalService.dismissAll();
      // this.getList();
    });
  }

  canPerformAction(catId: number, subCatId: number, perItemName: number) {
    return this.permission.checkPermission(catId, subCatId, perItemName);
  }
  multi() {
    this.showMultiSelect = false
    this.selecteddata = [];
    this.page = 1;
    this.sort = 1;
    delete this.tableConfig.filter.Status;
    this.fetchData();
  }
}
