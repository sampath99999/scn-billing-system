import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private apiService: ApiService) { }

  getAllPackages(searchTerm: string = '', filter: any, sortBy: string = 'name', sortOrder: 'asc' | 'desc' = 'asc') {
    return this.apiService.get('/packages', {
      params: {
        search: searchTerm,
        filter: JSON.stringify(filter),
        sortBy,
        sortOrder
      }
    });
  }
}
