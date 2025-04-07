import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  url: string;
}

export interface Category {
  _id: string;
  title: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  subTitle: string;
  price: number;
  rating: number;
  thumbnail: string;
  url: string;
  totalSections: number;
  totalVideos: number;
  totalDuration: number;
  purchaseCount: number;
  learningPoints: string[];
  access_type: 'free' | 'paid';
  level: string;
  requirements: string[];
  createdAt: string;
  updatedAt: string;
  instructor: Instructor;
  category: Category;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule , RouterModule],
  templateUrl: './courses.component.html',
})
export class CoursesComponent {
  activeTab: 'published' | 'requests' = 'published';
  searchTerm: string = '';
  publishedCourses: Course[] = [];
  courseRequests: Course[] = [];


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:5000/api/v1/course/all')
      .subscribe(
        (data) => {
          this.publishedCourses = data.courses;
        },
        (error) => {
          console.error('Error fetching courses:', error);
        }
      );


      this.http.get<any>('http://localhost:5000/api/v1/course/allPending')
      .subscribe(
        (data) => {
          this.courseRequests = data.courses;
        },
        (error) => {
          console.error('Error fetching pending courses:', error);
        }
      );

  }
  
 
  get filteredPublishedCourses(): Course[] {
    return this.publishedCourses.filter(course => 
      course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filteredCourseRequests(): Course[] {
    return this.courseRequests.filter(course => 
      course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


}