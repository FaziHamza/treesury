import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  get token(): string {
    let accessToken = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    if (!accessToken && !environment.production) {
      accessToken = environment.generalToken;
    }
    return accessToken;
  }

  setToken(accessToken: string) {
    localStorage.setItem('token', accessToken);
  }
}
