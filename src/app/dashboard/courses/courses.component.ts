import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Course {
  id: number;
  title: string;
  description: string;
  status: 'published' | 'pending' | 'rejected';
  instructor: string;
  createdAt: Date;
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
  
  // Sample data - in a real app, this would come from a service
  publishedCourses: Course[] = [
    {
      id: 1,
      title: 'Angular Masterclass',
      description: 'Learn Angular from scratch to advanced',
      status: 'published',
      instructor: 'John Doe',
      createdAt: new Date('2023-01-15')
    },
    {
      id: 2,
      title: 'React Fundamentals',
      description: 'Master the basics of React',
      status: 'published',
      instructor: 'Jane Smith',
      createdAt: new Date('2023-02-20')
    }
  ];

  courseRequests: Course[] = [
    {
      id: 3,
      title: 'Advanced TypeScript',
      description: 'Deep dive into TypeScript features',
      status: 'pending',
      instructor: 'Mike Johnson',
      createdAt: new Date('2023-03-10')
    },
    {
      id: 4,
      title: 'Node.js Backend Development',
      description: 'Build scalable backend services',
      status: 'pending',
      instructor: 'Sarah Williams',
      createdAt: new Date('2023-03-15')
    }
  ];

  filteredPublishedCourses(): Course[] {
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

  approveCourse(courseId: number): void {
    const courseIndex = this.courseRequests.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      const course = this.courseRequests[courseIndex];
      course.status = 'published';
      this.publishedCourses.push(course);
      this.courseRequests.splice(courseIndex, 1);
      // In a real app, you would call a service here to update the backend
    }
  }

  rejectCourse(courseId: number): void {
    const courseIndex = this.courseRequests.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      const course = this.courseRequests[courseIndex];
      course.status = 'rejected';
      this.courseRequests.splice(courseIndex, 1);
      // In a real app, you would call a service here to update the backend
    }
  }

  deleteCourse(courseId: number): void {
    const courseIndex = this.publishedCourses.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      this.publishedCourses.splice(courseIndex, 1);
      // In a real app, you would call a service here to update the backend
    }
  }
}