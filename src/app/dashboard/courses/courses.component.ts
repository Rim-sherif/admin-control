import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';

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
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './courses.component.html',
})
export class CoursesComponent {
  activeTab: 'published' | 'requests' = 'published';
  searchTerm: string = '';
  publishedCourses: Course[] = [];
  courseRequests: Course[] = []; // إضافتها للكورسات pending


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
  
  // courseRequests: Course[] = [
  //   {
  //     id: 3,
  //     title: 'Advanced TypeScript',
  //     description: 'Deep dive into TypeScript features',
  //     status: 'pending',
  //     instructor: 'Mike Johnson',
  //     createdAt: new Date('2023-03-10')
  //   },
  //   {
  //     id: 4,
  //     title: 'Node.js Backend Development',
  //     description: 'Build scalable backend services',
  //     status: 'pending',
  //     instructor: 'Sarah Williams',
  //     createdAt: new Date('2023-03-15')
  //   }
  // ];

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

  // approveCourse(courseId: string): void {
  //   const courseIndex = this.courseRequests.findIndex(c => c._id === courseId);
  //   if (courseIndex !== -1) {
  //     const course = this.courseRequests[courseIndex];
  //     // course.status = 'published';
  //     this.publishedCourses.push(course);
  //     this.courseRequests.splice(courseIndex, 1);
  //     // In a real app, you would call a service here to update the backend
  //   }
  // }

  // rejectCourse(courseId: string): void {
  //   const courseIndex = this.courseRequests.findIndex(c => c._id === courseId);
  //   if (courseIndex !== -1) {
  //     const course = this.courseRequests[courseIndex];
  //     // course.status = 'rejected';
  //     this.courseRequests.splice(courseIndex, 1);
  //     // In a real app, you would call a service here to update the backend
  //   }
  // }

  // deleteCourse(courseId: string): void {
  //   const courseIndex = this.publishedCourses.findIndex(c => c._id === courseId);
  //   if (courseIndex !== -1) {
  //     this.publishedCourses.splice(courseIndex, 1);
  //     // In a real app, you would call a service here to update the backend
  //   }
  // }
}