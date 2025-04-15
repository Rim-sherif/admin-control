import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `http://localhost:5000/api/v1/user/summary/admin`;

  constructor(private http: HttpClient) {}

  getAdminSummary(): Observable<any> {
    return this.http.get(this.apiUrl, { withCredentials: true });
  }
}
