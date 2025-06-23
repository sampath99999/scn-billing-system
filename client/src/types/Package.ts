export type Package = {
    _id: string;
    name: string;
    package_type: string;
    price_per_month: number;
    createdAt: string;
    updatedAt: string;
}

export const PACKAGE_TYPES = {
    ADD_ON: 'add_on',
    PACKAGE: 'package',
};

export interface PaginationMetadata {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

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
