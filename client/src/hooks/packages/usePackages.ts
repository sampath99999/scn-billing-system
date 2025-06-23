import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { Package, PaginationMetadata } from '@/types/Package';
import type { CreatePackageData } from '@/schemas/package.schema';
import PackageService from '@/services/packages.service';

interface PackageFilters {
  searchTerm?: string;
  packageType?: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface UsePackagesReturn {
  packages: Package[];
  loading: boolean;
  pagination: PaginationMetadata;
  filters: PackageFilters;
  setSearchTerm: (term: string) => void;
  setPackageType: (type: string | undefined) => void;
  setPagination: (page: number, pageSize: number) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  createPackage: (data: CreatePackageData) => Promise<Package | null>;
  updatePackage: (id: string, data: Partial<CreatePackageData>) => Promise<Package | null>;
  deletePackage: (id: string) => Promise<boolean>;
  deleteMultiplePackages: (ids: string[]) => Promise<boolean>;
  refreshPackages: () => Promise<void>;
}

const defaultPagination: PaginationMetadata = {
  currentPage: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 1,
};

export function usePackages(): UsePackagesReturn {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PackageFilters>({
    page: 1,
    pageSize: 10,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [pagination, setPaginationState] = useState<PaginationMetadata>(defaultPagination);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await PackageService.getPackages({
        searchTerm: filters.searchTerm,
        packageType: filters.packageType,
        page: filters.page,
        pageSize: filters.pageSize,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setPackages(response.data);
      setPaginationState(response.pagination);
    } catch (error) {
      toast.error(
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        'Failed to fetch packages. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Setter functions for filters that automatically trigger a refetch
  const setSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: term === '' ? undefined : term,
      page: 1 // Reset to first page on new search
    }));
  }, []);

  const setPackageType = useCallback((type: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      packageType: type,
      page: 1 // Reset to first page on new filter
    }));
  }, []);

  const setPagination = useCallback((page: number, pageSize: number) => {
    setFilters(prev => ({
      ...prev,
      page,
      pageSize
    }));
  }, []);

  const setSorting = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1 // Reset to first page on sort change
    }));
  }, []);

  // CRUD operations
  const createPackage = useCallback(async (data: CreatePackageData): Promise<Package | null> => {
    try {
      const newPackage = await PackageService.createPackage(data);
      toast.success('Package created successfully!');
      fetchPackages(); // Refresh the list
      return newPackage;
    } catch (error) {
      toast.error(
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        'Failed to create package. Please try again later.'
      );
      return null;
    }
  }, [fetchPackages]);

  const updatePackage = useCallback(async (id: string, data: Partial<CreatePackageData>): Promise<Package | null> => {
    try {
      const updatedPackage = await PackageService.updatePackage(id, data);
      toast.success('Package updated successfully!');
      fetchPackages(); // Refresh the list
      return updatedPackage;
    } catch (error) {
      toast.error(
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        'Failed to update package. Please try again later.'
      );
      return null;
    }
  }, [fetchPackages]);

  const deletePackage = useCallback(async (id: string): Promise<boolean> => {
    try {
      await PackageService.deletePackage(id);
      toast.success('Package deleted successfully!');
      fetchPackages(); // Refresh the list
      return true;
    } catch (error) {
      toast.error(
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        'Failed to delete package. Please try again later.'
      );
      return false;
    }
  }, [fetchPackages]);

  const deleteMultiplePackages = useCallback(async (ids: string[]): Promise<boolean> => {
    try {
      await PackageService.deleteMultiplePackages(ids);
      toast.success(`${ids.length} packages deleted successfully!`);
      fetchPackages(); // Refresh the list
      return true;
    } catch (error) {
      toast.error(
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        'Failed to delete packages. Please try again later.'
      );
      return false;
    }
  }, [fetchPackages]);  // Initial fetch and when filters change
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    loading,
    pagination,
    filters,
    setSearchTerm,
    setPackageType,
    setPagination,
    setSorting,
    createPackage,
    updatePackage,
    deletePackage,
    deleteMultiplePackages,
    refreshPackages: fetchPackages
  };
}
