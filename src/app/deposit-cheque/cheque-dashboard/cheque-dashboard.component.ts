import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TableColumn, TableConfig } from 'src/app/shared/components/table-advanced';
import { DepositService } from 'src/app/shared/services/deposit.service';

@Component({
  selector: 'app-cheque-dashboard',
  templateUrl: './cheque-dashboard.component.html',
  styleUrls: ['./cheque-dashboard.component.scss']
})
export class ChequeDashboardComponent implements OnInit, OnDestroy {
  limit = 6;
  tableConfig: TableConfig = {
    paging: true,
    filter: {
      Sort: 1,
      PageSize: this.limit,
    },
  };
constructor(  private depositService:DepositService ){

}
cardsData:any ={}

  ngOnInit() {
    this.Getdashbord()
  }
  ngOnDestroy() {
   }
   Getdashbord() {
    const api1$ = this.depositService.GetDashboardCard()
    forkJoin([api1$ ]).subscribe(
      ([result1]) => {
        if (result1) {
          console.log("result1",result1);
          this.cardsData ={...result1}
        }
      })
  }
}
