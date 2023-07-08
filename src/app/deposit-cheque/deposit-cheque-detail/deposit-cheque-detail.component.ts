import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DepositService } from 'src/app/shared/services/deposit.service';
import { DepositChequeModalComponent } from '../deposit-cheque-modal/deposit-cheque-modal.component';
import { ReplaceChequeComponent } from '../replace-cheque/replace-cheque.component';
import { ReplacedChequeDetailViewComponent } from '../cheque-dashboard/replaced-cheque-detail-view/replaced-cheque-detail-view.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from 'src/app/shared/services/header.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deposit-cheque-detail',
  templateUrl: './deposit-cheque-detail.component.html',
  styleUrls: ['./deposit-cheque-detail.component.scss']
})
export class DepositChequeDetailComponent implements OnInit, OnDestroy {
  current = 0;
  id: any;
  loading = false;
  imgUrl:any="";
  depositeDetail: any;
  steps: any[] = [];
  actionList: any[] = [];
  activityLog: any[] = [];
  masterActivityLog: any[] = [];
  constructor(private activatedRoute: ActivatedRoute,   private headerService: HeaderService,
    private modalService: NgbModal, private depositservice: DepositService) { }
  ngOnInit() {
    this.imgUrl=environment.imgUrl;
    this.headerService.setTitle('Deposited Cheques > Cheques List > Deposited Cheque Details ');
    this.activatedRoute.params.subscribe(res => {
      if (res) {
        this.id = res['id'];
        this.getDepositDetail();
        this.getData();
      }
    })
  }
  ngOnDestroy() {
    this.headerService.selecteddeposit =2;
  }
  getDepositDetail() {
    this.loading = true;
    this.depositservice.getChequeDetails(this.id).subscribe(result => {
      if (result) {
        this.depositeDetail = result.data || {}
      }
    }).add(() => (this.loading = false));
  }
  viewMore() {
    this.activityLog = this.masterActivityLog;
  }
  viewLess() {
    this.activityLog = [];
    let getFirstIndex = this.masterActivityLog.length > 0 ? this.masterActivityLog[0] : null
    if (getFirstIndex)
      this.activityLog.push(getFirstIndex);
  }

  getData() {
    const api1$ = this.depositservice.getChequesActionsLog(this.id);
    const api2$ = this.depositservice.getLookups(28);
    const api3$ = this.depositservice.getLookups(29);
    forkJoin([api1$, api2$, api3$]).subscribe(
      ([result1, result2, result3]) => {
        if (result1) {
          this.masterActivityLog = result1.data || [];
          let getFirstIndex = this.masterActivityLog.length > 0 ? this.masterActivityLog[0] : null;
          if (getFirstIndex)
            this.activityLog.push(getFirstIndex);
        }
        if (result2) {
          this.steps = result2.data || [];
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
    const firstArrayLookupNames = ["Return", "Replace", "Bounce", "Collect"];
    const secondArrayLookupNames = ["Re-deposit", "Replace"];
   this.firstActionList =  this.actionList.filter(item =>
      firstArrayLookupNames.includes(item.name[0]?.lookupName)
    );
    this.secondActionList = this.actionList.filter(item =>
      secondArrayLookupNames.includes(item.name[0]?.lookupName)
    );
  }
  depositDetail(item: any) {
    if (item?.name?.[0].lookupName == 'Return')
      this.openModalTrigger(item,'Returne Cheque', true, true)
    else if (item?.name?.[0].lookupName == 'Bounce')
      this.openModalTrigger(item,'Bounce Cheque', true, true)
    else if (item?.name?.[0].lookupName == 'Replace')
    this.replace(item)
    else if (item?.name?.[0].lookupName == 'Re-deposit')
      this.openModalTrigger(item,'Re-deposited Cheque', true, true)
    else if (item?.name?.[0].lookupName == 'Collect')
      this.openModalTrigger(item,'Collect Cheque', true, false)
    else if (item?.name?.[0].lookupName == 'replace-view')
      this.replaceView()
  }
  openModalTrigger(actionType:any, item: any, confirm: boolean, detailShow: boolean): void {
    const modalRef = this.modalService.open(DepositChequeModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
    modalRef.componentInstance.details = this.depositeDetail;
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
  replace(actionType:any) {
    const modalRef = this.modalService.open(ReplaceChequeComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });
    modalRef.componentInstance.details = this.depositeDetail;
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
}
