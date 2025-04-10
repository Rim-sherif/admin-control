// ticket-dialog.component.ts (updated)
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService, Ticket } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './ticket-dialog.component.html',
})
export class TicketDialogComponent implements OnInit {
  ticket: Ticket | null = null;
  errorMessage: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ticketId: string, user: any },
    private adminService: AdminService,
    public dialogRef: MatDialogRef<TicketDialogComponent>
  ) {}

  ngOnInit(): void {
    this.fetchTicket();
  }

  fetchTicket(): void {
    if (!this.data.ticketId) {
      this.errorMessage = 'Invalid ticket ID';
      return;
    }

    this.adminService.getTicketById(this.data.ticketId).subscribe({
      next: (response) => {
        if (response.success && response.data.ticket) {
          this.ticket = response.data.ticket;
          this.errorMessage = '';
        } else {
          this.errorMessage = response.message || 'Failed to load ticket details';
          this.ticket = null;
        }
      },
      error: (error) => {
        console.error('Error fetching ticket:', error);
        this.errorMessage = error.message || 'Error fetching ticket';
        this.ticket = null;
      }
    });
  }

  updateTicket(): void {
    if (!this.ticket?._id) {
      this.errorMessage = 'Cannot update: No ticket loaded';
      return;
    }

    const updateData: Partial<Ticket> = {
      status: this.ticket.status,
      priority: this.ticket.priority,
      resolution: this.ticket.resolution || undefined,
      assignedTo: this.ticket.assignedTo || undefined
    };

    this.adminService.updateTicket(this.ticket._id, updateData).subscribe({
      next: (response) => {
        if (response.success && response.data.ticket) {
          this.ticket = response.data.ticket;
          this.dialogRef.close(true);
        } else {
          this.errorMessage = response.message || 'Failed to update ticket';
        }
      },
      error: (error) => {
        console.error('Error updating ticket:', error);
        this.errorMessage = error.message || 'Error updating ticket';
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}