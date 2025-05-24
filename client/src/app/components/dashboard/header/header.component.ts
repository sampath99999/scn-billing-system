import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent {
  @Input() sidebarCollapsed = false;
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  logout() {
    // Implement your logout logic here
    console.log('Logout clicked');
  }
}
