// services/accessory.service.ts
import type { GetAccessoriesOptions, GetAccessoriesResponse, Accessory } from '@/types/Accessory';
import { GET, POST, DELETE, PATCH } from './api.service';
import type { CreateAccessoryData } from '@/schemas/accessory.schema';

export default class AccessoryService {
    static async getAccessories(options: GetAccessoriesOptions = {}): Promise<GetAccessoriesResponse> {
        const params = new URLSearchParams();

        if (options.searchTerm) {
            params.append('searchTerm', options.searchTerm);
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
        const url = `/accessories${queryString ? `?${queryString}` : ''}`;

        return GET<GetAccessoriesResponse>(url);
    }

    static async createAccessory(newAccessoryData: CreateAccessoryData): Promise<Accessory> {
        return POST<Accessory, CreateAccessoryData>('/accessories', newAccessoryData);
    }

    static async updateAccessory(id: string, accessoryData: Partial<CreateAccessoryData>): Promise<Accessory> {
        return PATCH<Accessory, Partial<CreateAccessoryData>>(`/accessories/${id}`, accessoryData);
    }

    static async deleteAccessory(id: string): Promise<void> {
        return DELETE<void>(`/accessories/${id}`);
    }

    static async deleteMultipleAccessories(accessoryIds: string[]): Promise<void> {
        return POST<void, { accessoryIds: string[] }>('/accessories/bulk-delete', { accessoryIds });
    }
}
