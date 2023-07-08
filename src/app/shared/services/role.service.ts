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
export class RoleService {
  constructor(private http: HttpClient) {}

  getRoles(filter: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      toFilteringUrl(urlJoin(environment.apiUrl, '/Roles/GetRoles'), filter),
    );
  }

  getRoleDetails(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      urlJoin(environment.apiUrl, `/Roles/GetRoleDetails?roleId=${id}`),
    );
  }

  getRolePortals(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      urlJoin(environment.apiUrl, `/Roles/GetRolePortals?roleId=${id}`),
    );
  }

  getRolePermissions(PortalId: number, roleId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      urlJoin(
        environment.apiUrl,
        `/Roles/GetRolePermissions?roleId=${roleId}&portalId=${PortalId}`,
      ),
    );
  }

  getDefaultPermissionsByPortal(portalId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      urlJoin(
        environment.apiUrl,
        `/Permissions/GetDefaultPermissions?PortalId=${portalId}&Status=2001`,
      ),
    );
  }

  addRole(role: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(urlJoin(environment.apiUrl, '/Roles/AddRole'), role);
  }

  updateRole(role: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(urlJoin(environment.apiUrl, '/Roles/UpdateRole'), role);
  }
}
