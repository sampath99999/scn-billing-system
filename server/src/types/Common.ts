export interface FiltersAndSort{
    searchTerm?: string;
    filters?: Record<string, string | number | boolean>;
    page?: number;
    pageSize?: number;
    sortBy?: 'name' | 'price';
    sortOrder?: 'asc' | 'desc';
}
