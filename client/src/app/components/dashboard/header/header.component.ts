import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service/auth.service';
import { User, UserTypes } from '../../../types/User';
import { toast } from 'ngx-sonner';

@Component({
	selector: 'app-header',
	imports: [CommonModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
	standalone: true,
})
export class HeaderComponent {
	@Input() sidebarCollapsed = false;
	@Output() toggleSidebarEvent = new EventEmitter<void>();

	protected isAuthLoading = false;
	protected userDetails: User | null = null;
	protected UserTypes = UserTypes;

	constructor(private authService: AuthService) {
		this.initFunc();
	}

	get iconWithFirstTwoLetters() {
		if (!this.userDetails) return '';

		const nameParts = this.userDetails.name.split(' ');
		if (nameParts.length >= 2) {
			return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
		} else {
			return (this.userDetails.name.substring(0, 2)).toUpperCase();
		}
	}

	initFunc() {
		this.authService
			.getUserDetails()
			.then(() => {
				console.log('User details fetched successfully');
			})
			.catch((error) => {
				toast.error('Failed to fetch user details', {
					description:
						error.message ||
						'An error occurred while fetching user details.',
				});
			});
		this.authService.isAuthLoading.subscribe((loading) => {
			this.isAuthLoading = loading;
		});
		this.authService.authDetails.subscribe((user) => {
			this.userDetails = user;
		});
	}

	toggleSidebar() {
		this.toggleSidebarEvent.emit();
	}

	logout() {
		this.authService
			.logout()
			.then(() => {
				console.log('Logout successful');
			})
			.catch((error) => {
				console.error('Logout failed', error);
			});
	}
}
