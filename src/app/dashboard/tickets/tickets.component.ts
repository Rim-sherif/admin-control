// tickets.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService, Ticket, TicketsResponse } from '../../services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './tickets.component.html',
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  user: any;
  selectedStatus: string = 'all';

  constructor(private adminService: AdminService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchTickets();
  }

  fetchTickets(): void {
    this.adminService.getAllTickets().subscribe({
      next: (response: TicketsResponse) => {
        console.log('Get All Tickets Response:', response);
        if (response.success && response.data) {
          this.tickets = response.data.tickets || [];
          this.user = response.data.user || null;
          this.applyFilter();
        } else {
          console.error('Failed to fetch tickets:', response.message || 'Unknown error');
          this.tickets = [];
          this.filteredTickets = [];
          this.user = null;
        }
      },
      error: (error) => {
        console.error('Error fetching tickets:', error);
        this.tickets = [];
        this.filteredTickets = [];
        this.user = null;
      }
    });
  }

  applyFilter(): void {
    if (this.selectedStatus === 'all') {
      this.filteredTickets = [...this.tickets];
    } else {
      this.filteredTickets = this.tickets.filter(
        (ticket) => ticket.status.toLowerCase() === this.selectedStatus
      );
    }
  }

  openTicketDialog(ticket: Ticket): void {
    if (!ticket?._id) {
      console.error('Invalid ticket ID:', ticket);
      return;
    }
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      width: '600px',
      data: { ticketId: ticket._id, user: this.user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchTickets(); // Refresh the ticket list after update
      }
    });
  }
}