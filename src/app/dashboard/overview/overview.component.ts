import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
})
export class OverviewComponent {
 
  faChartLine = faChartLine;
  faUsers = faUsers;
  faGraduationCap = faGraduationCap;
  faMoneyBill = faMoneyBill;

  stats = {
    totalStudents: 1234,
    totalCourses: 45,
    totalRevenue: 54321,
    completionRate: 78
  };
} 