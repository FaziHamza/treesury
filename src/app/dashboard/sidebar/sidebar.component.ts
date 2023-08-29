import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NavLink } from '../../shared/models';
import { SidebarService } from '../../shared/services/sidebar.service';
import { AuthService } from '../../shared/services/auth.service';
import { ModalLogoutComponent } from '../../shared/modals/modal-logout/modal-logout.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() navLinks: NavLink[] = [];
  @Output() navLinkSelect = new EventEmitter<any>();

  links?: NavLink[];
  selectedNavLink?: NavLink | null;
  minimized$ = this.sidebarService.minimizedSubject;
  unsubscribe = new Subject<void>();

  constructor(
    private modalService: NgbModal,
    private sidebarService: SidebarService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.links = cloneDeep(this.navLinks) || [];
    this.sidebarService.navLinks = this.links;
    this.sidebarService.eventsObservable.pipe(takeUntil(this.unsubscribe)).subscribe(action => {
      if (action.select?.navLink) {
        this.onSelect(action.select?.navLink, action.select?.silent);
      }
    });
  }

  ngOnDestroy() {
    this.sidebarService.navLinks = [];
    this.sidebarService.activeNavLinkSubject.next(null);
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSelect(navLink: NavLink | undefined | null, silent = false) {
    this.selectedNavLink = navLink;
    this.sidebarService.activeNavLinkSubject.next(navLink);
    if (!silent) {
      this.navLinkSelect.emit(this.selectedNavLink);
    }
  }

  logout() {
    this.authService.logout();
    // this.modalService.open(ModalLogoutComponent, { backdrop: 'static' }).result.then(result => {
    //   if (result?.action) {
    //   }
    // });
  }
}
