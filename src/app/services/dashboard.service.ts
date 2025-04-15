import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `http://localhost:5000/api/v1`;

  constructor(private http: HttpClient) {}

  getAdminSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/summary/admin`, {
      withCredentials: true,
    });
  }

  getAllInstructors(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/user/allinstructors?select=firstName,lastName,role,jobTitle,verificationStatus,rating,totalRating,avatar`,
      { withCredentials: true }
    );
  }

  getTopCourses(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/course/all?page=1&size=5&sort=purchaseCount:desc&select=title,price,purchaseCount,thumbnail,instructor`,
      { withCredentials: true }
    );
  }
}
