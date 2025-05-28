export interface NewPackageData {
    name: string;
    package_type: string;
    price_per_month: number;
}

export const PACKAGE_TYPES = {
    ADD_ON: 'add_on',
    PACKAGE: 'package',
};

export interface PackageFilterOptions {
    package_type?: string;
}

export type PackageSortOptions = "name" | "price_per_month" | "createdAt" | "updatedAt";

export interface PaginationMetadata {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
