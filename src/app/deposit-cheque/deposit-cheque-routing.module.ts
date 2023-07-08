import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositChequeComponent } from './deposit-cheque.component';
import { DepositChequeDetailComponent } from './deposit-cheque-detail/deposit-cheque-detail.component';
import { ReplaceChequeComponent } from './replace-cheque/replace-cheque.component';
import { ReplacedChequeDetailViewComponent } from './cheque-dashboard/replaced-cheque-detail-view/replaced-cheque-detail-view.component';


const routes: Routes = [
  {
    path: '',
    component: DepositChequeComponent,
  },
  { path: 'detail/:id', component: DepositChequeDetailComponent },
  { path: 'replace', component: ReplaceChequeComponent },
  { path: 'replace-view', component: ReplacedChequeDetailViewComponent },
  //   { path: 'view-branch/:id', component: AddBranchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositChequeRoutingModule { }
