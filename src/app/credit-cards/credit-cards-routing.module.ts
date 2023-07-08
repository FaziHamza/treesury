import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditCardsPaymentComponent } from './credit-cards-payment/credit-cards-payment.component';
import { CreateReconciliationComponent } from './create-reconciliation/create-reconciliation.component';
import { ReconciliationDetailsComponent } from './reconciliation-details/reconciliation-details.component';
import { PaymentDetailViewComponent } from './payment-detail-view/payment-detail-view.component';

const routes: Routes = [
  {
    path: '',
    component: CreditCardsPaymentComponent,
  },
  {
    path:'reconciliation',
    component: CreateReconciliationComponent,
  },
  {
    path:'reconciliation-details',
    component: ReconciliationDetailsComponent,
  },
  {

    path: 'payment-details',

    component: PaymentDetailViewComponent

  }
  // { path: 'detail/:id', component: DepositChequeDetailComponent },
  // { path: 'replace', component: ReplaceChequeComponent },
  // { path: 'replace-view', component: ReplacedChequeDetailViewComponent },
  //   { path: 'view-branch/:id', component: AddBranchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditCardsRoutingModule { }
