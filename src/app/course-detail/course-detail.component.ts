import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

interface Section {
  _id: string;
  title: string;
  totalVideos: number;
  totalDuration: number;
  order: number;
  status: string;
}

interface Video {
  _id: string;
  sectionId: string;
  title: string;
  duration: string;
  videoUrl: string;
  status: string;
}

interface Course {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  price: number;
  access_type: string;
  level: string;
  totalDuration: number;
  url: string;
  thumbnail: string;
  learningPoints: string[];
  requirements: string[];
  status: string;
  instructorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  courseId: string = '';
  course: Course | null = null;
  sections: Section[] = [];
  videos: Video[] = [];
  isLoading = false;

  constructor(private route: ActivatedRoute, private http: HttpClient ,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCourseDetails();
  }

  loadCourseDetails() {
    this.isLoading = true;
    this.http.get(`http://localhost:5000/api/v1/admin/verificationDetails/${this.courseId}`, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          if (response?.data) {
            this.course = response.data.course;
            this.sections = response.data.sections;
            this.videos = response.data.videos;
          } else {
            this.toastr.error('Failed to load course details');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading course details:', error);
          this.toastr.error('Failed to load course details');
          this.isLoading = false;
        }
      });
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

  getVideosForSection(sectionId: string): Video[] {
    return this.videos.filter(video => video.sectionId === sectionId);
  }
}
