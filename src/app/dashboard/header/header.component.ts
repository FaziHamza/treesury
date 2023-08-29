import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { SidebarService } from '../../shared/services/sidebar.service';
import { HeaderService } from '../../shared/services/header.service';
import { AuthService } from '../../shared/services/auth.service';
import { CreditCardService } from 'src/app/shared/services/credit-card.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  title$ = this.headerService.titleSubject;
  sidebarMinimized$ = this.sidebarService.minimizedSubject;
  mobileScreen = false;
  fullName = '';
  firstName = '';
  lastName = '';
  portalList :any[] = [];

  constructor(
    private headerService: HeaderService,
    private sidebarService: SidebarService,
    private authService: AuthService,
    private creditCardService : CreditCardService, @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.onWindowResize();
    this.authService.getLoggedUserDetails().subscribe(result => {
      this.fullName = result?.data?.fullName;
      if (this.fullName?.length) {
        const parts = this.fullName.split(' ');
        this.firstName = parts[0];
        this.lastName = parts[1];
      }
    });
    this.getPortals();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (window.innerWidth < 600) {
      this.mobileScreen = true;
      this.sidebarService.minimizedSubject.next(true);
    } else {
      this.mobileScreen = false;
      this.sidebarService.minimizedSubject.next(false);
    }
  }
  getPortals() {
    this.creditCardService.getPortals().subscribe((response: any) => {
      if (response.isSuccess) {
        this.portalList = response.data;
      }
    })
  }
  sidebarToggle() {
    this.sidebarService.minimizedSubject.next(!this.sidebarService.minimizedSubject.value);
  }
  redirectTo(item:any) {
    var token = localStorage.getItem("token");
    const url = `${item?.description}/login?token=${token}&redirectUrl=${this.document.location.origin}`;
    window.location.replace(url)
  }
}
