import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  courseId: string = '';
  course: any; 

  constructor(private route: ActivatedRoute, private http: HttpClient ,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchCourse();
  }

  fetchCourse() {
    this.http.get(`http://localhost:5000/api/v1/course/${this.courseId}`)
      .subscribe(
        (data: any) => {
          this.course = data.course;
        },
        (error) => {
          console.error('Error fetching course details:', error);
        }
      );
  }

  approveCourse() {
    this.http.put(`http://localhost:5000/api/v1/admin/approveCourse/${this.courseId}`, {} , {withCredentials: true})
      .subscribe({
        next: (response) => {
          console.log('Course approved:', response);
          this.toastr.success((response as any).message);
        },
        error: (error) => {
          console.log(error);
          this.toastr.error((error as any)?.error?.message);
          console.error('Error approving course:', error);
        }
      });
  };

  rejectCourse() {
    Swal.fire({
      title: 'Reject Course',
      input: 'text',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'Enter reason here...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'You must write a reason!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value;
        
        this.http.put(
          `http://localhost:5000/api/v1/admin/rejectCourse/${this.courseId}`,
          { reason }, 
          { withCredentials: true }
        ).subscribe({
          next: (response: any) => {
            console.log('Course rejected:', response);
            this.toastr.success(response.message || 'Course rejected successfully.');
          },
          error: (error) => {
            console.error('Error rejecting course:', error);
            this.toastr.error((error as any)?.error?.message || 'Failed to reject course.');
          }
        });
      }
    });
  }

}
