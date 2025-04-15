import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  showAdminError: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      this.showAdminError = false;
      this.errorMessage = '';
      
      this.authService.login(email, password).subscribe({
        next: () => {
          this.isLoading = false;
          // Redirect handled in AuthService
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.handleError(error);
        }
      });
    }
  }

  private handleError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.errorMessage = 'Service unavailable. Please try again later.';
      console.error('Endpoint not found:', error.message);
      return;
    }

    if (error.error?.code === 'non_admin_user') {
      this.showAdminError = true;
      this.errorMessage = '';
      return;
    }

    this.showAdminError = false;
    this.errorMessage = error.error?.message || 'Invalid email or password';
    
    // Handle network errors
    if (error.status === 0) {
      this.errorMessage = 'Network error. Check your connection.';
      console.error('Network error:', error.message);
    }
  }
}