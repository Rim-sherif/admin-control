import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LocalInstructor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  verificationStatus: string;
  frontId?: string;
  backId?: string;
  requiredVideo?: string;
  optionalVideo?: string;
  documents?: {
    frontId?: string;
    backId?: string;
    requiredVideo?: string;
    optionalVideo?: string | null;
  } | null;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  instructors: LocalInstructor[] = [];
  filteredInstructors: LocalInstructor[] = [];
  selectedInstructorId: string | null = null;
  rejectionReason: string = '';
  customRejectionReason: string = '';
  rejectionReasons: string[] = [
    'Incomplete Documentation',
    'Invalid Credentials',
    'Failed Video Verification',
    'Other',
  ];
  showMediaModal: boolean = false;
  selectedMediaUrl: string | null = null;
  isVideo: boolean = false;
  selectedFilter: string = 'all';

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.loadAllInstructors();
    } else {
      console.warn('User not authenticated. Redirecting to login...');
      this.authService.logout();
    }
  }

  loadAllInstructors(): void {
    this.adminService.getAllInstructors().subscribe({
      next: (response) => {
        this.instructors = response.data.map((instructor: LocalInstructor) => ({
          ...instructor,
          verificationStatus: this.normalizeStatus(instructor.verificationStatus)
        }));
        this.applyFilter();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching all instructors:', error);
        if (error.status === 401 || error.status === 400) {
          this.authService.logout();
        }
      },
    });
  }

  private normalizeStatus(status: string): string {
    const validStatuses = ['approved', 'rejected', 'pending'];
    return validStatuses.includes(status.toLowerCase()) ? status.toLowerCase() : 'pending';
  }

  applyFilter(): void {
    if (this.selectedFilter === 'all') {
      this.filteredInstructors = [...this.instructors];
    } else {
      this.filteredInstructors = this.instructors.filter(
        (instructor) =>
          instructor.verificationStatus.toLowerCase() === this.selectedFilter
      );
    }
  }

  approveInstructor(instructorId: string): void {
    this.adminService.approveInstructor(instructorId).subscribe({
      next: (response) => {
        console.log('Instructor approved:', response);
        this.updateInstructorStatus(instructorId, 'approved');
        this.applyFilter();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error approving instructor:', error);
        if (error.status === 401 || error.status === 400) {
          this.authService.logout();
        }
      },
    });
  }

  initiateRejectInstructor(instructorId: string): void {
    this.selectedInstructorId = instructorId;
    this.rejectionReason = this.rejectionReasons[0];
    this.customRejectionReason = '';
  }

  rejectInstructor(): void {
    if (this.selectedInstructorId && this.rejectionReason) {
      const finalReason =
        this.rejectionReason === 'Other' && this.customRejectionReason
          ? this.customRejectionReason
          : this.rejectionReason;

      this.adminService
        .rejectInstructor(this.selectedInstructorId, finalReason)
        .subscribe({
          next: (response) => {
            console.log('Instructor rejected:', response);
            this.updateInstructorStatus(this.selectedInstructorId, 'rejected');
            this.cancelReject();
            this.applyFilter();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error rejecting instructor:', error);
            if (error.status === 401 || error.status === 400) {
              this.authService.logout();
            }
          },
        });
    }
  }

  cancelReject(): void {
    this.selectedInstructorId = null;
    this.rejectionReason = '';
    this.customRejectionReason = '';
  }

  showMedia(
    url: string | undefined,
    type: string,
    instructor: LocalInstructor
  ): void {
    let mediaUrl = '';
    if (
      instructor.documents &&
      instructor.documents[type as keyof typeof instructor.documents]
    ) {
      mediaUrl = instructor.documents[
        type as keyof typeof instructor.documents
      ] as string;
    } else if (instructor[type as keyof LocalInstructor]) {
      mediaUrl = instructor[type as keyof LocalInstructor] as string;
    } else if (url) {
      mediaUrl = url;
    }

    if (mediaUrl) {
      this.selectedMediaUrl = mediaUrl;
      this.isVideo = type === 'requiredVideo' || type === 'optionalVideo';
      this.showMediaModal = true;
    }
  }

  closeMediaModal(): void {
    this.showMediaModal = false;
    this.selectedMediaUrl = null;
    this.isVideo = false;
  }

  private updateInstructorStatus(instructorId: string, status: string): void {
    const instructor = this.instructors.find((i) => i._id === instructorId);
    if (instructor) {
      instructor.verificationStatus = this.normalizeStatus(status);
    }
  }
}