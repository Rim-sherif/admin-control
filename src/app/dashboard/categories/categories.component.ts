import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { AdminService, Category } from '../../services/admin.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;

  categories: Category[] = [];
  isModalOpen = false;
  isEditing = false;
  currentCategory: Category = {
    _id: '',
    title: '',
    courseCount: 0,
    thumbnail: '',
    createdAt: '',
    updatedAt: '',
    __v: 0
  };
  selectedFile: File | null = null;

  // Delete confirmation popup state
  isDeleteConfirmOpen = false;
  categoryIdToDelete: string | null = null;

  // Message popup state
  isMessagePopupOpen = false;
  messagePopupTitle = '';
  messagePopupContent = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.categories;
        }
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.showMessagePopup('Error', 'Failed to load categories');
      }
    });
  }

  openAddModal() {
    this.isModalOpen = true;
    this.isEditing = false;
    this.currentCategory = {
      _id: '',
      title: '',
      courseCount: 0,
      thumbnail: '',
      createdAt: '',
      updatedAt: '',
      __v: 0
    };
    this.selectedFile = null;
  }

  openEditModal(category: Category) {
    this.isModalOpen = true;
    this.isEditing = true;
    this.currentCategory = { ...category };
    this.selectedFile = null;
  }

  closeModal() {
    this.isModalOpen = false;
    this.currentCategory = {
      _id: '',
      title: '',
      courseCount: 0,
      thumbnail: '',
      createdAt: '',
      updatedAt: '',
      __v: 0
    };
    this.selectedFile = null;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.currentCategory.title);
    if (this.selectedFile) {
      formData.append('thumbnail', this.selectedFile);
    }

    if (this.isEditing) {
      this.adminService.updateCategory(this.currentCategory._id, formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCategories();
            this.closeModal();
            this.showMessagePopup('Success', 'Category updated successfully');
          }
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.showMessagePopup('Error', 'Failed to update category');
        }
      });
    } else {
      this.adminService.addCategory(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCategories();
            this.closeModal();
            this.showMessagePopup('Success', 'Category added successfully');
          }
        },
        error: (error) => {
          console.error('Error adding category:', error);
          this.showMessagePopup('Error', 'Failed to add category');
        }
      });
    }
  }

  // Delete confirmation popup methods
  openDeleteConfirmModal(categoryId: string) {
    this.categoryIdToDelete = categoryId;
    this.isDeleteConfirmOpen = true;
  }

  closeDeleteConfirmModal() {
    this.isDeleteConfirmOpen = false;
    this.categoryIdToDelete = null;
  }

  confirmDelete() {
    if (this.categoryIdToDelete) {
      this.adminService.deleteCategory(this.categoryIdToDelete).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCategories();
            this.closeDeleteConfirmModal();
            this.showMessagePopup('Success', 'Category deleted successfully');
          } else {
            this.closeDeleteConfirmModal();
            this.showMessagePopup('Error', response.message || 'Cannot delete category with existing courses.');
          }
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.closeDeleteConfirmModal();
          this.showMessagePopup('Error', 'Cannot delete category with existing courses.');
        }
      });
    }
  }

  // Message popup methods
  showMessagePopup(title: string, content: string) {
    this.messagePopupTitle = title;
    this.messagePopupContent = content;
    this.isMessagePopupOpen = true;
  }

  closeMessagePopup() {
    this.isMessagePopupOpen = false;
    this.messagePopupTitle = '';
    this.messagePopupContent = '';
  }
}