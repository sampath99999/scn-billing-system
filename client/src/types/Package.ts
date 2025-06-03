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

export const PACKAGE_TYPES_ARRAY: string[] = Object.values(PACKAGE_TYPES);
