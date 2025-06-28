export type Customer = {
    _id: string;
    first_name: string;
    last_name: string;
    care_of: string;
    phone: string;
    address: string;
    box_no: string;
    note: string;
    latitude?: number;
    longitude?: number;
    old_due: number;
    company_id: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export const CUSTOMER_STATUS = {
    ACTIVE: true,
    PENDING: false,
};

export interface CustomerPaginationMetadata {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface GetCustomersOptions {
    searchTerm?: string;
    is_active?: boolean;
    has_due?: boolean;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface GetCustomersResponse {
    message: string;
    data: Customer[];
    pagination: CustomerPaginationMetadata;
}

export interface CreateCustomerData {
    first_name: string;
    last_name: string;
    care_of: string;
    phone: string;
    address: string;
    box_no: string;
    note: string;
    latitude?: number;
    longitude?: number;
    old_due?: number;
}

export interface UpdateCustomerData {
    first_name?: string;
    last_name?: string;
    care_of?: string;
    phone?: string;
    address?: string;
    box_no?: string;
    note?: string;
    latitude?: number;
    longitude?: number;
    old_due?: number;
    is_active?: boolean;
}
