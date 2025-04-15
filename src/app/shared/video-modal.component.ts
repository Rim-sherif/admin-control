import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black opacity-50" (click)="close()"></div>
      
      <!-- Modal -->
      <div class="relative bg-white rounded-lg w-[90vw] h-[90vh] z-50">
        <!-- Close button -->
        <button 
          (click)="close()"
          class="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Video player -->
        <div class="w-full h-full">
          <video 
            #videoPlayer
            [src]="videoUrl" 
            class="w-full h-full" 
            controls
            autoplay>
          </video>
        </div>
      </div>
    </div>
  `
})
export class VideoModalComponent {
  @Input() videoUrl: string = '';
  @Input() isOpen: boolean = false;

  close() {
    this.isOpen = false;
  }
}
