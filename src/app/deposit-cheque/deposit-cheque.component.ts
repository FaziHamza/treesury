import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderService } from '../shared/services/header.service';
import { SidebarService } from '../shared/services/sidebar.service';

@Component({
  selector: 'app-deposit-cheque',
  templateUrl: './deposit-cheque.component.html',
  styleUrls: ['./deposit-cheque.component.scss']
})
export class DepositChequeComponent implements OnInit, OnDestroy {
  
  depositTypes: any = [];
  totalAllRecordsCount = 0;

  constructor(
    public headerService: HeaderService,
    private sidebarService: SidebarService,
  ) { }

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
    this.headerService.selecteddeposit = deposit.id;
  }
  getdepositTypes() {
    this.depositTypes = [
      {
        id: 1,
        name: 'Cheques Dashboard'
      },
      {
        id: 2,
        name: 'Cheques List'
      },
    ];
  }

}
