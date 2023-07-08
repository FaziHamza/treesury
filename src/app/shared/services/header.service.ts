import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  titleSubject = new BehaviorSubject<string>('');

  setTitle(title: string) {
    this.titleSubject.next(title);
  }
}
