import { Component, HostListener, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { SidebarService } from '../../shared/services/sidebar.service';
import { HeaderService } from '../../shared/services/header.service';
import { AuthService } from '../../shared/services/auth.service';

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

  constructor(
    private headerService: HeaderService,
    private sidebarService: SidebarService,
    private authService: AuthService,
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

  sidebarToggle() {
    this.sidebarService.minimizedSubject.next(!this.sidebarService.minimizedSubject.value);
  }
}
