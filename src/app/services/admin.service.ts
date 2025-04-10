import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Ticket interface
export interface Ticket {
  _id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  resolution?: string;
  assignedTo?: string;
}

// Instructor interface
export interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  verificationStatus: string;
  createdAt: string;
  backId?: string;
  frontId?: string;
  optionalVideo?: string | null;
  requiredVideo?: string;
  documents?: {
    frontId?: string;
    backId?: string;
    requiredVideo?: string;
    optionalVideo?: string | null;
  };
}

// Response interfaces

export interface TicketsResponse {
  success: boolean;
  message?: string;
  data: {
    tickets: Ticket[]; // Array of tickets
    user?: any;        // Optional user data
  };
}
export interface TicketResponse {
  success: boolean;
  ticket?: Ticket; // ticket is directly under data
}

export interface UpdateTicketResponse {
  success: boolean;
  message?: string;
  data: {
    ticket: Ticket; // ticket is required here
    user?: any; // user is optional
  };
}

export interface InstructorsResponse {
  success: boolean;
  message?: string;
  data: Instructor[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private customerSupportUrl = 'http://localhost:5000/api/v1/customersupport';
  private adminUrl = 'http://localhost:5000/api/v1/admin';

  constructor(private http: HttpClient) {}

  // Ticket-related methods
  getAllTickets(): Observable<TicketResponse> {
    return this.http.get<TicketsResponse>(`${this.customerSupportUrl}/tickets`, {
      withCredentials: true,
    });
  }

  getTicketById(ticketId: string): Observable<TicketResponse> {
    return this.http.get<TicketResponse>(
      `${this.customerSupportUrl}/ticket/${ticketId}`,
      { withCredentials: true }
    );
  }

  updateTicket(
    ticketId: string,
    updateData: Partial<Ticket>
  ): Observable<UpdateTicketResponse> {
    return this.http.put<UpdateTicketResponse>(
      `${this.customerSupportUrl}/ticket/${ticketId}`,
      updateData,
      { withCredentials: true }
    );
  }

  // Instructor-related methods
  getAllInstructors(): Observable<InstructorsResponse> {
    return this.http.get<InstructorsResponse>(
      `${this.adminUrl}/allInstructors`,
      { withCredentials: true }
    );
  }

  approveInstructor(instructorId: string): Observable<any> {
    return this.http.put(
      `${this.adminUrl}/approveIns/${instructorId}`,
      {},
      { withCredentials: true }
    );
  }

  rejectInstructor(instructorId: string, reason: string): Observable<any> {
    return this.http.put(
      `${this.adminUrl}/rejectIns/${instructorId}`,
      { reason },
      { withCredentials: true }
    );
  }
}
