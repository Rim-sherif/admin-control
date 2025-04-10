import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faBell,
  faBook,
  faChartLine,
  faCog,
  faHome,
  faShieldAlt,
  faSignOutAlt,
  faTasks,
  faTimes,
  faUser,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  faBars = faBars;
  faTimes = faTimes;
  faHome = faHome;
  faBook = faBook;
  faUsers = faUsers;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faShieldAlt = faShieldAlt;
  faBell = faBell;
  faUser = faUser;
  faChartLine = faChartLine;
  faTasks = faTasks;

  isSidebarOpen = false;

  constructor(private authService: AuthService) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth < 1024) { 
      this.isSidebarOpen = false;
    }
  }

  logout() {
    this.authService.logout();
  }
}