import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//Update imports based on deployment environment
//import { environment } from '../environments/development';
//import { environment } from '../environments/staging';
import { environment } from '../environments/production';

export interface PrivacyMonitor {
  name: string;
  isActive: boolean;
  activeApps: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MonitorService {
  // Combines central environment origin with resource endpoint path configurations
  private readonly apiUrl = `${environment.apiUrl}`; //development
//private readonly apiUrl = `https://pb8vwqhw-44357.use2.devtunnels.ms/api/privacystatus`; //devtunnels


  constructor(private http: HttpClient) {}

  public getPrivacyStatus(): Observable<PrivacyMonitor[]> {
    return this.http.get<PrivacyMonitor[]>(this.apiUrl);
  }
}