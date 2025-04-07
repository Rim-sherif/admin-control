import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

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
}
