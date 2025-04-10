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
  createdAt: Date;
  updatedAt: Date;
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

// Category interface
export interface Category {
  _id: string;
  title: string;
  courseCount: number;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  url?: string;
}

// Response interfaces

export interface TicketsResponse {
  success: boolean;
  message?: string;
  data: {
    tickets: Ticket[];
    user?: any;
  };
}

export interface TicketResponse {
  success: boolean;
  ticket?: Ticket;
}

export interface UpdateTicketResponse {
  success: boolean;
  message?: string;
  data: {
    ticket: Ticket;
    user?: any;
  };
}

export interface InstructorsResponse {
  success: boolean;
  message?: string;
  data: Instructor[];
}

// Category response interfaces
export interface AddCategoryResponse {
  success: boolean;
  message: string;
  statusCode: number;
  course: Category;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  statusCode: number;
  categories: Category[];
}

export interface UpdateCategoryResponse {
  success: boolean;
  message: string;
  statusCode: number;
  category: Category;
}

export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private customerSupportUrl = 'http://localhost:5000/api/v1/customersupport';
  private adminUrl = 'http://localhost:5000/api/v1/admin';
  private categoryUrl = 'http://localhost:5000/api/v1/category'; 

  constructor(private http: HttpClient) {}

  // Ticket-related methods
  getAllTickets(): Observable<TicketsResponse> {
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

  // Category-related methods
  addCategory(formData: FormData): Observable<AddCategoryResponse> {
    return this.http.post<AddCategoryResponse>(
      `${this.categoryUrl}/add`,
      formData,
      { withCredentials: true }
    );
  }

  getAllCategories(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(
      `${this.categoryUrl}/all`,
      { withCredentials: true }
    );
  }

  updateCategory(categoryId: string, formData: FormData): Observable<UpdateCategoryResponse> {
    return this.http.put<UpdateCategoryResponse>(
      `${this.categoryUrl}/${categoryId}`,
      formData,
      { withCredentials: true }
    );
  }

  deleteCategory(categoryId: string): Observable<DeleteCategoryResponse> {
    return this.http.delete<DeleteCategoryResponse>(
      `${this.categoryUrl}/${categoryId}`,
      { withCredentials: true }
    );
  }
}