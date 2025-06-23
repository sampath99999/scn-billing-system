// services/package.service.ts
import type { GetPackagesOptions, GetPackagesResponse, Package } from '@/types/Package';
import { GET, POST, PUT, DELETE, PATCH } from './api.service';
import type { CreatePackageData } from '@/schemas/package.schema';

export default class PackageService {
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
        const url = `/packages/all${queryString ? `?${queryString}` : ''}`;

        return GET<GetPackagesResponse>(url);
    }

    static async createPackage(newPackageData: CreatePackageData): Promise<Package> {
        return POST<Package, CreatePackageData>('/packages', newPackageData);
    }

    static async updatePackage(id: string, packageData: Partial<CreatePackageData>): Promise<Package> {
        return PATCH<Package, Partial<CreatePackageData>>(`/packages/${id}`, packageData);
    }

    static async deletePackage(id: string): Promise<void> {
        return DELETE<void>(`/packages/${id}`);
    }

    static async deleteMultiplePackages(packageIds: string[]): Promise<void> {
        return POST<void, { packageIds: string[] }>('/packages/bulk-delete', { packageIds });
    }
}
