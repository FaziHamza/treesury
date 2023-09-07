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
import { DepositChequeDetailModalComponent } from '../deposit-cheque-detail-modal/deposit-cheque-detail-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deposit-cheque-detail',
  templateUrl: './deposit-cheque-detail.component.html',
  styleUrls: ['./deposit-cheque-detail.component.scss']
})
export class DepositChequeDetailComponent implements OnInit, OnDestroy {
  current = 0;
  id: any;
  loading = false;
  depositeDetail: any;
  steps: any[] = [];
  actionList: any[] = [];
  activityLog: any[] = [];
  masterActivityLog: any[] = [];
  constructor(private activatedRoute: ActivatedRoute, private headerService: HeaderService,
    private modalService: NgbModal, private depositservice: DepositService, private toastrService: ToastrService) { }
  ngOnInit() {
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
    this.headerService.selecteddeposit = 2;
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
          const array1Map = new Map(this.masterActivityLog.map(item => [item.statusId, item]));

          // Sort array2 based on the sequence in array1, keeping all items from array2
          const matchingItems = result2.data.filter((item:any) => {
            const aStatusId = item.id;
            return array1Map.has(aStatusId);
          });

          const sortedArray2 = matchingItems.sort((a:any, b:any) => {
            const aStatusId = a.id;
            const bStatusId = b.id;

            const aItemInArray1 = array1Map.get(aStatusId);
            const bItemInArray1 = array1Map.get(bStatusId);

            return this.masterActivityLog.indexOf(aItemInArray1) - this.masterActivityLog.indexOf(bItemInArray1);
          });

          this.steps = sortedArray2 || [];
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
  makeActionList() {
    // const firstArrayLookupNames = ["Return", "Replace", "Bounce", "Collect"];
    const firstArrayLookupNames = [29002, 29003, 29001, 29006];
    const secondArrayLookupNames = [29004, 29003];
    this.firstActionList = this.actionList.filter(item =>
      firstArrayLookupNames.includes(item.id)
    );
    this.secondActionList = this.actionList.filter(item =>
      secondArrayLookupNames.includes(item.id)
    );
  }
  depositDetail(item: any) {
    if (item?.id == 29002)
      this.openModalTrigger(item, 'Returne Cheque', true, true)
    else if (item?.id == 29001)
      this.openModalTrigger(item, 'Bounce Cheque', true, true)
    else if (item?.id == 29003)
      this.replace(item)
    else if (item?.id == 29004)
      this.openModalTrigger(item, 'Re-deposited Cheque', true, true)
    else if (item?.id == 29006)
      this.openModalTrigger(item, 'Collect Cheque', true, false)
  }
  openModalTrigger(actionType: any, item: any, confirm: boolean, detailShow: boolean): void {

    const modalRef = this.modalService.open(DepositChequeModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
    modalRef.componentInstance.details = [this.depositeDetail];
    modalRef.componentInstance.title = item;
    modalRef.componentInstance.isConfirmShow = confirm;
    modalRef.componentInstance.detailShow = detailShow;
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
  depositDetailModal(item: any) {
    let findStatus = this.masterActivityLog.find(a => a.statusId == item.id);
    if (findStatus) {
      this.depositservice.getChequeActionDetails(this.id, findStatus.actionId)
        .subscribe({
          next: response => {
            if (response.isSuccess) {
              if (findStatus?.actionId == 29002)
                this.openDetailModal(response.data, 'Returned', true, true)
              else if (findStatus?.actionId == 29001)
                this.openDetailModal(response.data, 'Bounced', true, true)
              else if (findStatus?.actionId == 29003)
                this.replaceView(response.data)
              else if (findStatus?.actionId == 29004)
                this.openDetailModal(response.data, 'Re-deposited', true, true)
              else if (findStatus?.actionId == 29010)
                this.openDetailModal(response.data, 'Deposited', true, false)
              else if (findStatus?.actionId == 29006)
                this.openDetailModal(response.data, 'Collected', true, false)
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
    }

  }
  openDetailModal(detail: any, item: any, confirm: boolean, detailShow: boolean): void {
    const modalRef = this.modalService.open(DepositChequeDetailModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
    modalRef.componentInstance.details = detail;
    modalRef.componentInstance.title = item;
    modalRef.componentInstance.isConfirmShow = confirm;
    modalRef.componentInstance.detailShow = detailShow;
    modalRef.componentInstance.sendtoLoadData.subscribe((result: any) => {
      console.log('resendtoLoadDatasult', result);
      this.modalService.dismissAll();
      // this.getList();
    });
  }
  replace(actionType: any) {
    const modalRef = this.modalService.open(ReplaceChequeComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });
    modalRef.componentInstance.details = this.depositeDetail;
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
  replaceView(data: any) {
    const modalRef = this.modalService.open(ReplacedChequeDetailViewComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });
    let updateData: any = [];
    if (data) {
      let replacedCheque: any = JSON.parse(JSON.stringify(data));
      replacedCheque = {
        ...data,
        ...data?.replacedCheque
      };
      let obj = {
        id: 1,
        name: 'V2 Replace Cheque Details',
        children: [replacedCheque]
      }
      updateData.push(obj);
      let obj1 = {
        id: 2,
        name: 'V1 Cheque Details',
        children: [data]
      }
      updateData.push(obj1);
    }
    modalRef.componentInstance.replacedCheque = updateData;
    modalRef.componentInstance.details = data;
    modalRef.componentInstance.selectedCheque = updateData[0];
    modalRef.componentInstance.sendtoLoadData.subscribe((result: any) => {
      console.log('resendtoLoadDatasult', result);
      this.modalService.dismissAll();
      // this.getList();
    });
  }
  activeTabs(tab: any) {
    const findStatus = this.masterActivityLog.find(a => a.statusId == tab.id);
    if (findStatus)
      return true;
    if (tab.id == this.depositeDetail?.statusObj?.lookupId)
      return true;
    return false;
  }
}
