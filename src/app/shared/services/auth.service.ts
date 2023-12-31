import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';

import { TokenService } from './token.service';
import { UserService } from './user.service';
import { ApiResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private jwtHelperService: JwtHelperService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  get userId(): number | null {
    const token = this.getDecodedToken();
    return token ? Number(token.nameid) : null;
  }

  getDecodedToken() {
    try {
      return this.jwtHelperService.decodeToken(this.tokenService.token);
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  getLoggedUserDetails(): Observable<ApiResponse | null> {
    if (this.userId) {
      return this.userService.getUserDetails(this.userId);
    }
    return of(null);
  }

  logout() {
    // if (this.userId) {
    //   this.userService.logoutUser(this.userId).subscribe();
    // }
    // localStorage.removeItem('token');
    // sessionStorage.removeItem('token');
    if (environment.apiUrl2.includes('test')) {
      window.location.href = 'https://dx-portalstest.azurewebsites.net/main-menu';
    }
    else if (environment.apiUrl2.includes('dev')) {
      window.location.href = 'https://portals-dx-fe-dev.azurewebsites.net/main-menu';
    }
    else {
      window.location.href = 'https://dx-portalsstage.azurewebsites.net/main-menu';
    }
    // window.location.href = environment.portalUrl;
  }
}
