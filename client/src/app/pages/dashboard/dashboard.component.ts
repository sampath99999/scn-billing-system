import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/dashboard/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/dashboard/header/header.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true
})
export class DashboardComponent {
  // Default to not collapsed on desktop, collapsed on mobile
  sidebarCollapsed = window.innerWidth < 992;

  // Listen for window resize
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Auto-collapse sidebar on small screens
    if (event.target.innerWidth < 992) {
      this.sidebarCollapsed = true;
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
