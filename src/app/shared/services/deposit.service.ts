import { Observable } from "rxjs";
import { ApiResponse } from "../models";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { toFilteringUrl } from "../utility";
import urlJoin from "url-join";


@Injectable({
    providedIn: 'root',
  })

export class DepositService {
  constructor(private http: HttpClient) {}
    getDepositCheques(filter: any): Observable<ApiResponse> {

      const headers = {
        Authorization: 'Bearer '+localStorage.getItem("token"),
      };
      return this.http.get<ApiResponse>(
        toFilteringUrl(urlJoin(environment.apiUrl2, '/Cheques/GetDepositedCheques'), filter),
        { headers }
      );
    }
    getPermissions(id: any): Observable<ApiResponse> {

      const headers = {
        Authorization: 'Bearer '+localStorage.getItem("token"),
      };
      return this.http.get<ApiResponse>(environment.apiUrl2+'/Permissions/GetPermissions?portalId='+id,
        { headers }
      );
    }
    getLookups(id: any): Observable<ApiResponse> {

      const headers = {
        Authorization: 'Bearer '+localStorage.getItem("token"),
      };
      return this.http.get<ApiResponse>(environment.apiUrl2+'/Lookups/GetLookups?lookupTypeId='+id,
        { headers }
      );
    }
    getBankLookups(id: any): Observable<ApiResponse> {

      const headers = {
        Authorization: 'Bearer '+localStorage.getItem("token"),
      };
      return this.http.get<ApiResponse>(environment.apiUrl2+'/Lookups/GetLookups?lookupTypeId='+id+"&PageNo=0&PageSize=1000",
        { headers }
      );
    }
    getChequesActionsLog(id: any): Observable<ApiResponse> {

      const headers = {
        Authorization: 'Bearer '+localStorage.getItem("token"),
      };
      return this.http.get<ApiResponse>(environment.apiUrl2+'/Cheques/GetChequesActionsLog?chequeId='+id,
        { headers }
      );
    }
    getChequeDetails(id: any): Observable<ApiResponse> {
      const headers = {
        Authorization: 'Bearer '+localStorage.getItem("token"),
      };
      return this.http.get<ApiResponse>(environment.apiUrl2+'/Cheques/GetChequeDetails?ChequeId='+id,
        { headers }
      );
    }
    actionOnCheques(data: any): Observable<ApiResponse> {
      const headers = {
        Authorization: 'Bearer '+localStorage.getItem("token"),
      };
      return this.http.post<ApiResponse>(urlJoin(environment.apiUrl2, '/Cheques/ActionsOnCheques'), data,{headers});
    }
    getChequeActionDetails(ChequeId: any,ActionId:any): Observable<ApiResponse> {
      const headers = {
        Authorization: 'Bearer '+localStorage.getItem("token"),
      };
      return this.http.get<ApiResponse>(urlJoin(environment.apiUrl2, '/Cheques/GetChequeActionDetails?ChequeId='+ChequeId+"&ActionId="+ActionId),{headers});
    }
    GetDashboardCard(): Observable<ApiResponse> {
      const headers = {
        Authorization: 'Bearer '+localStorage.getItem("token"),
      };
      return this.http.get<ApiResponse>(urlJoin(environment.apiUrl2, '/Dashboard/GetDashboardCards'), {headers});
    }
    GetChequesAgingList(filetr:any): Observable<ApiResponse> {
      const headers = {
        Authorization: 'Bearer '+localStorage.getItem("token"),
      };
      return this.http.get<ApiResponse>(
        toFilteringUrl(urlJoin(environment.apiUrl2, '/Dashboard/GetChequesAgingList'), filetr), {headers});
    }
    GetChequesAgingGraph(filetr:any): Observable<ApiResponse> {
      const headers = {
        Authorization: 'Bearer '+localStorage.getItem("token"),
      };
      return this.http.get<ApiResponse>(
        toFilteringUrl(urlJoin(environment.apiUrl2, '/Dashboard/GetChequesAgingTotals'),filetr), {headers});
    }
}
