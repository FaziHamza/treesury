import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SidebarService } from '../shared/services/sidebar.service';
import { NavLink } from '../shared/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  sidebarMinimized$ = this.sidebarService.minimizedSubject;
  navLinks: NavLink[] = [
    // {
    //   id: 'branches',
    //   name: 'Credit Cards Payments',
    //   url: '/',
    //   icon: 'credit-card',
    // },
    {
      id: 'credit-cards',
      name: 'Credit Cards Payments',
      url: '/credit-card',
      icon: 'credit',
    },
    {
      id: 'deposit-cheque',
      name: 'Deposit Cheques',
      url: '/deposit-cheque',
      icon: 'credit',
    },
    // {
    //   id: 'roles',
    //   name: 'Terminals Providers Setup',
    //   url: '/roles',
    //   icon: 'terminal-providers',
    // },
    // {
    //   id: 'users',
    //   name: 'Bank Setup',
    //   url: '/users',
    //   icon: 'bank',
    // },
    // {
    //   id: 'revenue',
    //   name: 'Treasury Setup',
    //   url: '/revenue',
    //   icon: 'treasury-setup',
    // },
    // {
    //   id: 'cm-setup',
    //   name: 'CM Setup',
    //   url: '/cm-setup',
    //   icon: 'setup',
    // },
  ];

  constructor(private router: Router, private sidebarService: SidebarService) {}

  onNavLinkSelect(navLink: NavLink) {
    if (navLink?.id && navLink?.url) {
      this.router.navigate([navLink.url]);
    }
  }
}
