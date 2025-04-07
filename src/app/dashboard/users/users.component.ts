// users.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService, Instructor } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  instructors: Instructor[] = [];
  selectedInstructorId: string | null = null;
  rejectionReason: string = '';
  customRejectionReason: string = '';
  rejectionReasons: string[] = [
    'Incomplete Documentation',
    'Invalid Credentials',
    'Failed Video Verification',
    'Other'
  ];
  showMediaModal: boolean = false;
  selectedMediaUrl: string | null = null;
  isVideo: boolean = false;

  constructor(private adminService: AdminService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPendingInstructors();
  }

  loadPendingInstructors(): void {
    this.adminService.getPendingInstructors().subscribe({
      next: (response) => {
        this.instructors = response.data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching pending instructors:', error);
        if (error.status === 401) {
          this.authService.logout();
        }
      }
    });
  }

  approveInstructor(instructorId: string): void {
    this.adminService.approveInstructor(instructorId).subscribe({
      next: (response) => {
        console.log('Instructor approved:', response);
        this.updateInstructorStatus(instructorId, 'Approved');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error approving instructor:', error);
        if (error.status === 401) {
          this.authService.logout();
        }
      }
    });
  }

  initiateRejectInstructor(instructorId: string): void {
    this.selectedInstructorId = instructorId;
    this.rejectionReason = this.rejectionReasons[0];
    this.customRejectionReason = '';
  }

  rejectInstructor(): void {
    if (this.selectedInstructorId && this.rejectionReason) {
      const finalReason = this.rejectionReason === 'Other' && this.customRejectionReason 
        ? this.customRejectionReason 
        : this.rejectionReason;
      
      this.adminService.rejectInstructor(this.selectedInstructorId, finalReason).subscribe({
        next: (response) => {
          console.log('Instructor rejected:', response);
          this.updateInstructorStatus(this.selectedInstructorId, 'Rejected');
          this.cancelReject();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error rejecting instructor:', error);
          if (error.status === 401) {
            this.authService.logout();
          }
        }
      });
    } else {
      console.warn('Cannot reject instructor: missing ID or reason');
    }
  }

  cancelReject(): void {
    this.selectedInstructorId = null;
    this.rejectionReason = '';
    this.customRejectionReason = '';
  }

  showMedia(url: string, isVideo: boolean = false): void {
    this.selectedMediaUrl = url;
    this.isVideo = isVideo;
    this.showMediaModal = true;
  }

  closeMediaModal(): void {
    this.showMediaModal = false;
    this.selectedMediaUrl = null;
    this.isVideo = false;
  }

  private updateInstructorStatus(instructorId: string, status: string): void {
    const instructor = this.instructors.find(i => i._id === instructorId);
    if (instructor) {
      instructor.verificationStatus = status;
    }
  }
}