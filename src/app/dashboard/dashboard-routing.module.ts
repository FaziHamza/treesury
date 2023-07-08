import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    // canActivate: [],
    // canActivateChild: [authGuard],
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'deposit-cheque',
        loadChildren: () => import('../deposit-cheque/deposit-cheque.module').then(m => m.DepositChequeModule),
      },
      {
        path: 'credit-card',
        loadChildren: () => import('../credit-cards/credit-cards.module').then(m => m.CreditCardsModule),
      },
      { path: '', redirectTo: 'deposit-cheque', pathMatch: 'full' }, // Make sure this route is defined after other child routes
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
