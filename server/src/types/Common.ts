import mongoose from "mongoose";

export interface FiltersAndSort<FilterOptions, SortOptions> {
    searchTerm?: string;
    filters?: FilterOptions;
    page?: number;
    pageSize?: number;
    sortBy?: SortOptions;
    sortOrder?: 'asc' | 'desc';
}

export type ObjectId = mongoose.Types.ObjectId;
