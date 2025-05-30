import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';

@Injectable({
	providedIn: 'root',
})
export class PackageService {
	constructor(private apiService: ApiService) {}

	getAllPackages(
		searchTerm: string = '',
		filter: any,
		sortBy: string = 'name',
		sortOrder: 'asc' | 'desc' = 'asc',
		page: number = 1,
		pageSize: number = 10
	) {
		return this.apiService.get('/packages', {
			params: {
				search: searchTerm,
				filter: JSON.stringify(filter),
				sortBy,
				sortOrder,
				page,
				pageSize,
			},
		});
	}

	createPackage(
		name: string,
		packageType: string,
		pricePerMonth: number
	) {
		return this.apiService.post('/packages', {
			name,
			package_type: packageType,
			price_per_month: pricePerMonth,
		});
	}
}
