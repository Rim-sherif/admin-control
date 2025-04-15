import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartLine,
  faGraduationCap,
  faMoneyBill,
  faUsers,
  faStar,
  faClock,
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
  faStar = faStar;
  faClock = faClock;

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
  topCourses: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadInstructorsData();
    this.loadTopCourses();
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

  loadTopCourses(): void {
    console.log('Starting to load top courses...');
    this.dashboardService.getTopCourses().subscribe({
      next: (response) => {
        console.log('Top Courses API Response:', response);
        console.log('Response Type:', typeof response);
        console.log('Is Response an Object:', response instanceof Object);
        console.log('Response Keys:', Object.keys(response));

        if (response.success) {
          console.log(
            'Success is true, setting topCourses to:',
            response.courses
          );
          this.topCourses = response.courses;
          console.log('topCourses after setting:', this.topCourses);
        } else {
          console.log('Success is false, response:', response);
        }
      },
      error: (error) => {
        console.error('Error loading top courses:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
        });
      },
      complete: () => {
        console.log('Top courses API call completed');
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
