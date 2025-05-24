import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true
})
export class SidebarComponent implements OnChanges {
  @Input() isCollapsed = false;
  @Output() toggleSidebarEvent = new EventEmitter<boolean>();

  // For screen size detection
  isMobile = window.innerWidth < 992;

  constructor() {
    // Listen for window resize to detect mobile
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 992;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // If isCollapsed changed
    if (changes['isCollapsed']) {
      // We don't need to do anything here, the template will update
    }
  }
  toggleSidebar() {
    // Emit event to toggle sidebar
    this.toggleSidebarEvent.emit();
  }

  logout() {
    // Implement your logout logic here
    console.log('Logout clicked');
  }
}
