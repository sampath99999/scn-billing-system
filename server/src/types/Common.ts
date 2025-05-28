export interface FiltersAndSort<FilterOptions, SortOptions> {
    searchTerm?: string;
    filters?: FilterOptions;
    page?: number;
    pageSize?: number;
    sortBy?: SortOptions;
    sortOrder?: 'asc' | 'desc';
}
