import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, takeUntil } from 'rxjs';
import { TableColumn, TableConfig } from 'src/app/shared/components/table-advanced';
import { DepositService } from 'src/app/shared/services/deposit.service';
import { Category, Users, depositChequeList } from '../data';
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
          this.fetchData();
        }
      });
    this.searchText.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.unsubscribe))
      .subscribe(value => {
        const text: string = value || '';
        if (text?.length >= 3 || (!text?.length && this.tableConfig.filter.Customer?.length)) {
          this.tableConfig.filter.Customer = text;
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
          this.deposites = result.data || []
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

  removeSearch() {
    this.searchText.setValue(null);
    this.sort = 1;
    this.page = 1;
    delete this.tableConfig.filter.Customer;
    this.fetchData();
  }
  removeChequeSearch() {
    this.searchChequeText.setValue(null);
    this.sort = 1;
    this.page = 1;
    delete this.tableConfig.filter.ChequeNo;
    this.fetchData();
  }

  handleCategoryChange(event: any) {
    this.tableConfig.filter.Status = event.id;
    // this.statusId = event?.id;
    this.fetchData();
  }
  onClear() {
    delete this.tableConfig.filter.Status;
    // this.statusId = null;
    this.fetchData();
  }

  /**
 * filter selection
 */
  bank: boolean = false;
  collectionDate: boolean = false;
  dueDate: boolean = false;

  filterbank(event: any) {
    this.bank = event.checked;
  }
  filterCollectionDates(event: any) {
    this.collectionDate = event.checked;
  }
  filterDueDates(event: any) {
    this.dueDate = event.checked;
  }
  /**
* get Branches
*/

  banksList: any;
  getbanks() {
    const api1$ = this.depositservice.getLookups(11);
    const api2$ = this.depositservice.getLookups(28);
    const api3$ = this.depositservice.getLookups(29);
    forkJoin([api1$, api2$, api3$]).subscribe(
      ([result1, result2, result3]) => {
        if (result1) {
          this.banksList = result1.data || [];
        }
        console.log("ss",result2)
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
  firstActionList :any[] = [];
  secondActionList :any[] = [];

  makeActionList(){
    // const firstArrayLookupNames = ["Return", "Replace", "Bounce", "Collect"];
    const firstArrayLookupNames = ["Return", "Replace", "Bounce", "Multi select"];
    const secondArrayLookupNames = ["Re-deposited", "Replace"];
   this.firstActionList =  this.actionList.filter(item =>
      firstArrayLookupNames.includes(item.name[0]?.lookupName)
    );
    this.secondActionList = this.actionList.filter(item =>
      secondArrayLookupNames.includes(item.name[0]?.lookupName)
    );
  }

  depositDetail(item:any,row:any){
    if(item?.name?.[0].lookupName == 'Return')
      this.openModalTrigger(item,row,'Returned Cheque Details View',true,true)
    else if(item?.name?.[0].lookupName == 'Bounce')
      this.openModalTrigger(item,row,'Bounced Cheque Details View',true,true)
    else if(item?.name?.[0].lookupName == 'Replace')
      this.replace(item,row)
    else if(item?.name?.[0].lookupName == 'Re-deposited')
      this.openModalTrigger(item,row,'Re-deposited Cheque Details View',true,true)
    else if(item?.name?.[0].lookupName == 'Multi select')
      this.openModalTrigger(item,row,'Collected Cheque Details View',false,false)
    else if(item?.name?.[0].lookupName == 'replace-view')
      this.replaceView()
  }
  /**
 * remove branch filter
 */
  newDropdownbank: any = [];
  removebankFilter() {
    this.newDropdownbank = [];
    this.dropDownbankId = [];
    this.bank = false;
    this.fetchData();
  }

  removeCollectionDateFilter() {
    this.collectionDate = false;
    delete this.tableConfig.filter.FromDate;
    delete this.tableConfig.filter.ToDate;
    this.fetchData();
  }

  removeDueCollectionDateFilter() {
    this.dueDate = false;
    delete this.tableConfig.filter.FromDueDate;
    delete this.tableConfig.filter.ToDueDate;
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
    this.fetchData();
  }

  onDateValueChange(event: any) {
    var pipe = new DatePipe('en-US');
    let startDate = pipe.transform(event[0]) || '';
    let endDate = pipe.transform(event[1]) || '';
    this.tableConfig.filter.FromDate = startDate;
    this.tableConfig.filter.ToDate = endDate;
    this.fetchData();
  }

  onDueDateValueChange(event: any) {
    var pipe = new DatePipe('en-US');
    let startDate = pipe.transform(event[0]) || '';
    let endDate = pipe.transform(event[1]) || '';
    this.tableConfig.filter.FromDueDate = startDate;
    this.tableConfig.filter.ToDueDate = endDate;
    this.fetchData();
  }

  IsPDCFilter(IsPDC: any) {
    this.tableConfig.filter.IsPDC = IsPDC;
    this.fetchData();
  }

  openModalTrigger(actionType:any,detail: any, item: any, confirm: boolean, detailShow: boolean): void {
    const modalRef = this.modalService.open(DepositChequeModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
    modalRef.componentInstance.details = detail;
    modalRef.componentInstance.title = item;
    modalRef.componentInstance.isConfirmShow = confirm;
    modalRef.componentInstance.detailShow = detailShow;
    modalRef.componentInstance.actionType = actionType;
    modalRef.componentInstance.sendtoLoadData.subscribe((result: any) => {
      console.log('resendtoLoadDatasult', result);
      this.modalService.dismissAll();
      // this.getList();
    });
  }

  replace(actionType:any,detail: any) {
    const modalRef = this.modalService.open(ReplaceChequeComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });
    modalRef.componentInstance.details = detail;
    modalRef.componentInstance.actionType = actionType;
    modalRef.componentInstance.sendtoLoadData.subscribe((result: any) => {
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
}
