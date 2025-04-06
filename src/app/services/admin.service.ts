// admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  verificationStatus: string;
  createdAt: string;
  backId: string;
  frontId: string;
  optionalVideo: string | null;
  requiredVideo: string;
  documents: {
    frontId: string;
    backId: string;
    requiredVideo: string;
    optionalVideo: string | null;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/api/v1/admin';

  constructor(private http: HttpClient) {}

  getPendingInstructors(): Observable<{ message: string; status: string; count: number; data: Instructor[] }> {
    return this.http.get<{ message: string; status: string; count: number; data: Instructor[] }>(
      `${this.apiUrl}/instructorsPending`,
      { withCredentials: true }
    );
  }

  approveInstructor(instructorId: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/approveIns/${instructorId}`,
      {},
      { withCredentials: true }
    );
  }

  rejectInstructor(instructorId: string, reason: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/rejectIns/${instructorId}`,
      { reason }, // Include reason in the request body
      { withCredentials: true }
    );
  }
}