import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import urlJoin from 'url-join';

import { ApiResponse } from '../models/api-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  constructor(private http: HttpClient) {}

  getLookupsById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      urlJoin(environment.apiUrl, '/Lookups/GetLookups', `?lookupTypeId=${id}`),
    );
  }

  getLocations(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(urlJoin(environment.apiUrl, '/Lookups/GetLocations'));
  }
}
