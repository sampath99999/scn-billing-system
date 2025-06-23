import { Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { PACKAGE_TYPES } from '@/types/Package';
import type { Package, PackagePaginationMetadata } from '@/types/Package';
import { cn } from '@/lib/utils';
import SortableHeader from './sortable-header';

interface PackagesTableProps {
  packages: Package[];
  loading: boolean;
  selectedPackages: string[];
  pagination: PackagePaginationMetadata;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSelectPackage: (id: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onEditPackage: (pkg: Package) => void;
  onDeletePackage: (pkg: Package) => void;
  onSortChange: (field: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function PackagesTable({
  packages,
  loading,
  selectedPackages,
  pagination,
  sortBy,
  sortOrder,
  onSelectPackage,
  onSelectAll,
  onEditPackage,
  onDeletePackage,
  onSortChange,
  onPageChange,
  onPageSizeChange,
}: PackagesTableProps) {
  const isAllSelected = packages.length > 0 && selectedPackages.length === packages.length;
  const isIndeterminate = selectedPackages.length > 0 && selectedPackages.length < packages.length;

  const renderPackageTypeBadge = (type: string) => {
    const isAddOn = type === PACKAGE_TYPES.ADD_ON;
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          isAddOn
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-blue-100 text-blue-800'
        )}
      >
        {isAddOn ? 'Add On' : 'Package'}
      </span>
    );
  };

  const renderPagination = () => {
    const { currentPage, totalPages } = pagination;

    // Generate page numbers to display
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Show ellipsis if current page is more than 3
      if (currentPage > 3) {
        pageNumbers.push('...');
      }

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Show ellipsis if current page is less than totalPages - 2
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {pagination.pageSize * (pagination.currentPage - 1) + 1} to{' '}
          {Math.min(pagination.pageSize * pagination.currentPage, pagination.totalCount)} of{' '}
          {pagination.totalCount} entries
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </Button>

            {pageNumbers.map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2">...</span>
              ) : (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              )
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>

          <select
            className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
            value={pagination.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-8 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                data-state={isIndeterminate ? "indeterminate" : isAllSelected ? "checked" : "unchecked"}
                onCheckedChange={onSelectAll}
                aria-label="Select all packages"
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Name"
                sortField="name"
                currentSortField={sortBy}
                currentSortOrder={sortOrder}
                onSort={() => onSortChange('name')}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Price"
                sortField="price_per_month"
                currentSortField={sortBy}
                currentSortOrder={sortOrder}
                onSort={() => onSortChange('price_per_month')}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Type"
                sortField="package_type"
                currentSortField={sortBy}
                currentSortOrder={sortOrder}
                onSort={() => onSortChange('package_type')}
              />
            </TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No packages found.
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow key={pkg._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPackages.includes(pkg._id)}
                    onCheckedChange={(checked) => onSelectPackage(pkg._id, !!checked)}
                    aria-label={`Select ${pkg.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{pkg.name}</TableCell>
                <TableCell>₹{pkg.price_per_month.toFixed(2)}</TableCell>
                <TableCell>{renderPackageTypeBadge(pkg.package_type)}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditPackage(pkg)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeletePackage(pkg)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination.totalCount > 0 && renderPagination()}
    </div>
  );
}
