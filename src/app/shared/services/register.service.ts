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
export class RegisterService {
  constructor(private http: HttpClient) {}

  getRegisters(filter: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      toFilteringUrl(urlJoin(environment.apiUrl, '/Register/GetRegisters'), filter),
    );
  }

  getRegisterDetails(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      urlJoin(environment.apiUrl, `Register/GetRegisterDetails?Id=${id}`),
    );
  }

  addRegister(info: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(urlJoin(environment.apiUrl, 'Register/AddRegister'), info);
  }

  updateRegister(info: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      urlJoin(environment.apiUrl, 'Register/UpdateRegister'),
      info,
    );
  }
}
