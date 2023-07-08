import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { SharedModule } from '../shared/shared.module';
import { DepositChequeComponent } from './deposit-cheque.component';
import { DepositChequeRoutingModule } from './deposit-cheque-routing.module';
import { DepositChequeDetailComponent } from './deposit-cheque-detail/deposit-cheque-detail.component';
import { ChequeListComponent } from './cheque-list/cheque-list.component';
import { ChequeDashboardComponent } from './cheque-dashboard/cheque-dashboard.component';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { ChequeAgingReportComponent } from './cheque-dashboard/cheque-aging-report/cheque-aging-report.component';
import { DashboardChequeChartComponent } from './cheque-dashboard/dashboard-cheque-chart/dashboard-cheque-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { ReplaceChequeComponent } from './replace-cheque/replace-cheque.component';
import { ReplacedChequeDetailViewComponent } from './cheque-dashboard/replaced-cheque-detail-view/replaced-cheque-detail-view.component';
import { DepositChequeModalComponent } from './deposit-cheque-modal/deposit-cheque-modal.component';
import { MaxCharactersDirective } from '../shared/directives/max-characters.directive';

@NgModule({
  declarations: [DepositChequeComponent, DepositChequeDetailComponent,
    ChequeListComponent, ChequeDashboardComponent, DashboardCardComponent,
    ChequeAgingReportComponent, DashboardChequeChartComponent, ReplaceChequeComponent,
    ReplacedChequeDetailViewComponent, DepositChequeModalComponent,MaxCharactersDirective],
  imports: [
    CommonModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    DepositChequeRoutingModule,
    SharedModule,
    NgChartsModule,
  ],
})
export class DepositChequeModule {}
