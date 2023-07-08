import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { SharedModule } from '../shared/shared.module';
import { MaxCharactersDirective } from '../shared/directives/max-characters.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditCardsRoutingModule } from './credit-cards-routing.module';
import { CreditCardListComponent } from './credit-card-list/credit-card-list.component';
import { CreateReconciliationComponent } from './create-reconciliation/create-reconciliation.component';
import { ReconciliationHistoryComponent } from './reconciliation-history/reconciliation-history.component';
import { ReconciliationDetailsComponent } from './reconciliation-details/reconciliation-details.component';
import { CreditCardsPaymentComponent } from './credit-cards-payment/credit-cards-payment.component';
import { NgChartsModule } from 'ng2-charts';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentDetailViewComponent } from './payment-detail-view/payment-detail-view.component';



@NgModule({
  declarations: [
    CreditCardListComponent,
    CreateReconciliationComponent,
    ReconciliationHistoryComponent,
    ReconciliationDetailsComponent,
    CreditCardsPaymentComponent,
    PaymentDetailViewComponent
  ],
  imports: [
    CommonModule,
    CreditCardsRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    SharedModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,

  ]
})
export class CreditCardsModule { }
