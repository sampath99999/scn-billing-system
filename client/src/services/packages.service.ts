// services/package.service.ts
import type { Package } from '@/types/Package';
import api from './api.service';

export interface GetPackagesOptions {
    searchTerm?: string;
    packageType?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PackagePaginationMetadata {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface GetPackagesResponse {
    message: string;
    data: Package[];
    pagination: PackagePaginationMetadata;
}

export default class PackageService {
    static API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    static async getPackages(options: GetPackagesOptions = {}): Promise<GetPackagesResponse> {
        const params = new URLSearchParams();

        if (options.searchTerm) {
            params.append('searchTerm', options.searchTerm);
        }
        if (options.packageType) {
            params.append('package_type', options.packageType);
        }
        if (options.page) {
            params.append('page', options.page.toString());
        }
        if (options.pageSize) {
            params.append('pageSize', options.pageSize.toString());
        }
        if (options.sortBy) {
            params.append('sortBy', options.sortBy);
        }
        if (options.sortOrder) {
            params.append('sortOrder', options.sortOrder);
        }

        const queryString = params.toString();
        const url = `${this.API_BASE_URL}/packages/all${queryString ? `?${queryString}` : ''}`;

        const response = await api.get(url);
        return response.data;
    }
}
