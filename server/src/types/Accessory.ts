export interface NewAccessoryData {
    name: string;
    cost: number;
}

export interface AccessoryFilterOptions {
    // Add any specific filter options if needed
}

export type AccessorySortOptions = "name" | "cost" | "createdAt" | "updatedAt";

export interface PaginationMetadata {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
