import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  selecteddeposit: any = 1;
  titleSubject = new BehaviorSubject<string>('');

  setTitle(title: string) {
    this.titleSubject.next(title);
  }
}
