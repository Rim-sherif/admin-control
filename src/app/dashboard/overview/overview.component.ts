import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartLine,
  faGraduationCap,
  faMoneyBill,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  faChartLine = faChartLine;
  faUsers = faUsers;
  faGraduationCap = faGraduationCap;
  faMoneyBill = faMoneyBill;

  dashboardData: any = {
    approvedCourse: 0,
    pendingCourse: 0,
    rejectedCourse: 0,
    instructorCount: 0,
    userCount: 0,
    adminCount: 0,
    totalEnrollments: 0,
    totalAdminEarnings: 0,
    totalInstructorEarnings: 0,
  };

  instructors: any[] = [];
  approvedInstructors: number = 0;
  rejectedInstructors: number = 0;
  averageRating: number = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadInstructorsData();
  }

  loadDashboardData(): void {
    this.dashboardService.getAdminSummary().subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboardData = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      },
    });
  }

  loadInstructorsData(): void {
    this.dashboardService.getAllInstructors().subscribe({
      next: (response) => {
        if (response.success) {
          this.instructors = response.data;
          this.calculateInstructorStats();
        }
      },
      error: (error) => {
        console.error('Error loading instructors data:', error);
      },
    });
  }

  calculateInstructorStats(): void {
    this.approvedInstructors = this.instructors.filter(
      (instructor) => instructor.verificationStatus === 'approved'
    ).length;
    this.rejectedInstructors = this.instructors.filter(
      (instructor) => instructor.verificationStatus === 'rejected'
    ).length;

    const instructorsWithRating = this.instructors.filter(
      (instructor) => instructor.rating > 0
    );
    if (instructorsWithRating.length > 0) {
      this.averageRating =
        instructorsWithRating.reduce(
          (sum, instructor) => sum + instructor.rating,
          0
        ) / instructorsWithRating.length;
    }
  }
}
