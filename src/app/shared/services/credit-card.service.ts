import { Observable } from "rxjs";
import { ApiResponse } from "../models";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { toFilteringUrl } from "../utility";
import urlJoin from "url-join";

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  constructor(private http: HttpClient) {}

  GetProviders(filter: any): Observable<ApiResponse> {
    const headers = {
      Authorization: 'Bearer '+localStorage.getItem("authToken"),
    };
    return this.http.get<ApiResponse>(
      toFilteringUrl(urlJoin(environment.apiUrl2, 'TerminalProviders/GetProviders'), filter),
      { headers }
    );
  }

  GetCards(): Observable<ApiResponse> {

    const headers = {
      Authorization: 'Bearer '+localStorage.getItem("token"),
    };
    return this.http.get<ApiResponse>(
      (urlJoin(environment.apiUrl2, 'CreditCardType/GetCreditCardTypes')),
      { headers }
    );
  }

  getPortals(): Observable<ApiResponse> {
    const headers = {
      Authorization: 'Bearer '+localStorage.getItem("token"),
    };
    return this.http.get<ApiResponse>(
      (urlJoin(environment.apiUrl2, 'User/GetUserPortals')),
      { headers }
    );
  }

  GetBranch(filter: any): Observable<ApiResponse> {
    const headers = {
      Authorization: 'Bearer '+localStorage.getItem("token"),
    };
    return this.http.get<ApiResponse>(
      (urlJoin(environment.apiUrl2, 'Branches/GetBranches?Status=2001&sort=1&PageNo=0&PageSize=2000')),
      { headers }
    );
  }

  GetRegister(filter: any): Observable<ApiResponse> {
    const headers = {
      Authorization: 'Bearer '+localStorage.getItem("token"),
    };
    return this.http.get<ApiResponse>(
      toFilteringUrl(urlJoin(environment.apiUrl2, 'Register/GetRegisters'),filter),
      { headers }
    );
  }
  GetTable(filter: any): Observable<ApiResponse>{
    const headers = {
      Authorization: 'Bearer '+localStorage.getItem("token"),
    };
    return this.http.get<ApiResponse>(
      toFilteringUrl(urlJoin(environment.apiUrl2, 'CreditCardService/GetSettledCreditCardsPayments'),filter),
      { headers }
    );
  }

  Getcard(): Observable<ApiResponse> {
    const headers = {
      Authorization: 'Bearer '+localStorage.getItem("token"),
    };
    return this.http.get<ApiResponse>(
      (urlJoin(environment.apiUrl2, 'CreditCardService/GetAllCardsPayments')),
      { headers }
    );
  }

  // Reconciliation History

  GetReconHistory(filter: any):Observable<any>{
    const headers = {
      Authorization: 'Bearer '+localStorage.getItem("token"),
    };

    return this.http.get<ApiResponse>(
      toFilteringUrl(urlJoin(environment.apiUrl2, 'CreditCardService/GetSettledCreditCardsPayments'),filter),
      { headers }
    );
  }

  // Get Reconciliation History
  GetReconciliationHistory(filter:any):Observable<any>{
    const headers = {
      Authorization: 'Bearer '+localStorage.getItem("token"),
    };

    return this.http.get<ApiResponse>(
      toFilteringUrl(urlJoin(environment.apiUrl2, 'CreditCardService/GetReconciliationHistory'),filter),
      { headers }
    );
  }


  ReconcilationIds(onSelectString: any):Observable<any>{
    const headers = {
      Authorization: 'Bearer '+localStorage.getItem("token"),
    };
    const formData = new FormData();
    formData.append('ReconcilationIds', onSelectString);

    return this.http.post<ApiResponse>(
      (urlJoin(environment.apiUrl2, 'CreditCardService/ReconciliationCards')),
      formData,
      { headers}
    );
  }



  ReconciledTransactionsList(filter:any):Observable<any>{
    const headers = {
      Authorization: 'Bearer '+localStorage.getItem("token"),
    };

    return this.http.get<ApiResponse>(
      toFilteringUrl(urlJoin(environment.apiUrl2, 'CreditCardService/GetReconciliationDetails'),filter),
      { headers }
    );
  }

  getCardsCollectionDetial(filter:any):Observable<any>{
   const headers = {
      Authorization: 'Bearer '+localStorage.getItem("token"),
    };

    return this.http.get<ApiResponse>(
      toFilteringUrl(urlJoin(environment.apiUrl2, 'CreditCardService/GetOrderCardsCollectionDetails'),filter),
      { headers }
    );
  }
}
