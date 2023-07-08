import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NavLink } from '../models';

export interface SidebarSelect {
  navLink?: NavLink | null;
  silent?: boolean;
}

export interface SidebarAction {
  minimize?: boolean | 'toggle';
  select?: SidebarSelect;
}

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  navLinks: NavLink[] = [];
  activeNavLinkSubject = new BehaviorSubject<NavLink | undefined | null>(null);
  minimizedSubject = new BehaviorSubject<boolean>(false);
  eventsSubject = new BehaviorSubject<SidebarAction>({});
  eventsObservable = this.eventsSubject.asObservable();
  activeNavLinkObservable = this.activeNavLinkSubject.asObservable();

  emitEvent(action: SidebarAction) {
    this.eventsSubject.next(action);
  }

  findNavLink(navLinks: NavLink[] | undefined, id: string | undefined): NavLink | null {
    if (navLinks && id) {
      for (let i = 0; i < navLinks.length; i++) {
        if (navLinks[i].id === id) {
          return navLinks[i];
        }
      }
    }
    return null;
  }
}
