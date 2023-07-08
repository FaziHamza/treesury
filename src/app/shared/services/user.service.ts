import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import urlJoin from 'url-join';

import { toFilteringUrl } from '../utility';
import { ApiResponse } from '../models/api-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(filter: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      toFilteringUrl(urlJoin(environment.apiUrl, '/User/GetUsers'), filter),
    );
  }

  getUserDetails(userId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      urlJoin(environment.apiUrl, '/User/GetUSERDetails', `?userId=${userId}`),
    );
  }

  getUserPermissions(id: number, portalId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      urlJoin(environment.apiUrl, `User/GetUserPermissions?userId=${id}&portalId=${portalId}`),
    );
  }

  addUser(role: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(urlJoin(environment.apiUrl, '/User/AddUser'), role);
  }

  updateUser(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(urlJoin(environment.apiUrl, '/User/EditUser'), data);
  }

  logoutUser(userId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      urlJoin(environment.apiUrl, '/User/Logout', `?userId=${userId}`),
      {},
    );
  }
}
