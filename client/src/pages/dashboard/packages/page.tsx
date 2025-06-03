// Packages Page:
import { useEffect, useState, useCallback } from 'react';
import PackagesBreadcrumb from './components/breadcrumb';
import type { Package, PaginationMetadata } from '@/types/Package';
import PackageService from '@/services/packages.service';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';

export default function PackagesPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
    const [packageTypeFilter, setPackageTypeFilter] = useState<string | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [pagination, setPagination] = useState<PaginationMetadata>({
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
    });

    const fetchPackages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await PackageService.getPackages({
                searchTerm,
                packageType: packageTypeFilter,
                page: currentPage,
                pageSize: pageSize,
                sortBy,
                sortOrder,
            });
            setPackages(response.data);
            setPagination(response.pagination);
        } catch (error) {
            toast.error(
                (error as AxiosError<{ message: string }>).response?.data
                    ?.message ||
                    'Failed to fetch packages. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    }, [searchTerm, packageTypeFilter, currentPage, pageSize, sortBy, sortOrder]);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    const handleSearchTermChange = (term: string) => {
        setSearchTerm(term === '' ? undefined : term); // Set to undefined if empty string
        setCurrentPage(1); // Reset to first page on new search
    };

    const handlePackageTypeFilterChange = (type: string | undefined) => {
        setPackageTypeFilter(type);
        setCurrentPage(1); // Reset to first page on new filter
    };

    const handlePaginationChange = (pageIndex: number, newPageSize: number) => {
        setCurrentPage(pageIndex + 1); // Convert 0-indexed to 1-indexed
        setPageSize(newPageSize);
    };

    const handleSortingChange = (sortingState: unknown) => {
        if (Array.isArray(sortingState) && sortingState.length > 0) {
            const { id, desc } = sortingState[0];
            setSortBy(id);
            setSortOrder(desc ? 'desc' : 'asc');
        } else {
            setSortBy('name');
            setSortOrder('asc');
        }
        setCurrentPage(1);
    };

    return (
        <div className="bg-white p-3 rounded">
            <PackagesBreadcrumb />
            <div className="mt-3">
                <h3 className='text-lg font-semibold'>Packages</h3>
                <p className="text-sm text-gray-500">
                    Manage your packages here. You can create, update, and
                    delete packages.
                </p>
            </div>
            <DataTable
                columns={columns}
                data={packages}
                onSearchTermChange={handleSearchTermChange}
                onPackageTypeFilterChange={handlePackageTypeFilterChange}
                onPaginationChange={handlePaginationChange}
                onSortingChange={handleSortingChange}
                pagination={pagination}
                loading={loading}
            />
        </div>
    );
}
