import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderService } from '../../shared/services/header.service';
import { SidebarService } from '../../shared/services/sidebar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credit-cards-payment',
  templateUrl: './credit-cards-payment.component.html',
  styleUrls: ['./credit-cards-payment.component.scss']
})
export class CreditCardsPaymentComponent {
  selecteddeposit: any = 1;
  depositTypes: any = [];
  totalAllRecordsCount = 0;

  constructor(
    private headerService: HeaderService,
    private sidebarService: SidebarService,
    private route: ActivatedRoute
  ) {
    const step = this.route.snapshot.queryParamMap.get('num')
    if (step) {
      this.selecteddeposit =parseInt(step)
    }
    else{
      this.selecteddeposit =1
    }
  }

  ngOnInit(): void {
    this.headerService.setTitle('Deposited Cheques > Cheques List ');
    const activeNavLink = this.sidebarService.findNavLink(this.sidebarService.navLinks, 'deposites');
    if (activeNavLink) {
      this.sidebarService.emitEvent({ select: { navLink: activeNavLink, silent: true } });
    }
    this.getdepositTypes();
  }

  ngOnDestroy() {
  }
  chooseDeposit(deposit: any) {
    
    this.selecteddeposit = deposit.id;
  }
  getdepositTypes() {
    this.depositTypes = [
      {
        id: 1,
        name: 'Credit Cards Payments List'
      },
      {
        id: 2,
        name: 'Reconciliation History'
      },
    ];
  }
}
