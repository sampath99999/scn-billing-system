export type Accessory = {
    _id: string;
    name: string;
    cost: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationMetadata {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface GetAccessoriesOptions {
    searchTerm?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface AccessoryPaginationMetadata {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface GetAccessoriesResponse {
    message: string;
    data: Accessory[];
    pagination: AccessoryPaginationMetadata;
}
