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
export class RevenueService {
  constructor(private http: HttpClient) {}

  getSageBanksAccounts(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      urlJoin(environment.apiUrl, '/Mainfund/GetSageBanksAccounts'),
    );
  }

  getOtherRevenues(filter: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      toFilteringUrl(urlJoin(environment.apiUrl, '/OtherRevenue/GetOtherRevenue'), filter),
    );
  }

  createRevenue(formData: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      urlJoin(environment.apiUrl, '/OtherRevenue/Create'),
      formData,
    );
  }

  updateRevenue(formData: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      urlJoin(environment.apiUrl, '/OtherRevenue/Update'),
      formData,
    );
  }

  deleteRevenue(formData: any) {
    return this.http.post<ApiResponse>(
      urlJoin(environment.apiUrl, '/OtherRevenue/Delete'),
      formData,
    );
  }
}
