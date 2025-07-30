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
import type { Accessory, AccessoryPaginationMetadata } from '@/types/Accessory';
import SortableHeader from './sortable-header';

interface AccessoriesTableProps {
    accessories: Accessory[];
    loading: boolean;
    selectedAccessories: string[];
    pagination: AccessoryPaginationMetadata;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSelectAccessory: (id: string, isSelected: boolean) => void;
    onSelectAll: (isSelected: boolean) => void;
    onEditAccessory: (accessory: Accessory) => void;
    onDeleteAccessory: (accessory: Accessory) => void;
    onSortChange: (field: string) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export function AccessoriesTable({
    accessories,
    loading,
    selectedAccessories,
    pagination,
    sortBy,
    sortOrder,
    onSelectAccessory,
    onSelectAll,
    onEditAccessory,
    onDeleteAccessory,
    onSortChange,
    onPageChange,
    onPageSizeChange,
}: AccessoriesTableProps) {
    const isAllSelected =
        accessories.length > 0 && selectedAccessories.length === accessories.length;
    const isIndeterminate =
        selectedAccessories.length > 0 &&
        selectedAccessories.length < accessories.length;

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
                    Showing{' '}
                    {pagination.pageSize * (pagination.currentPage - 1) + 1} to{' '}
                    {Math.min(
                        pagination.pageSize * pagination.currentPage,
                        pagination.totalCount
                    )}{' '}
                    of {pagination.totalCount} entries
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

                        {pageNumbers.map((page, index) =>
                            page === '...' ? (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2"
                                >
                                    ...
                                </span>
                            ) : (
                                <Button
                                    key={page}
                                    variant={
                                        page === currentPage
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => onPageChange(page as number)}
                                >
                                    {page}
                                </Button>
                            )
                        )}

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
                        value={pagination.pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="text-sm border rounded px-2 py-1"
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Skeleton className="h-4 w-4" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-24" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-20" />
                            </TableHead>
                            <TableHead className="w-24">
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Skeleton className="h-4 w-4" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-32" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-16" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox
                                checked={isAllSelected}
                                data-state={
                                    isIndeterminate
                                        ? 'indeterminate'
                                        : isAllSelected
                                        ? 'checked'
                                        : 'unchecked'
                                }
                                onCheckedChange={onSelectAll}
                                aria-label="Select all accessories"
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
                                label="Cost"
                                sortField="cost"
                                currentSortField={sortBy}
                                currentSortOrder={sortOrder}
                                onSort={() => onSortChange('cost')}
                            />
                        </TableHead>
                        <TableHead>
                            <SortableHeader
                                label="Created At"
                                sortField="createdAt"
                                currentSortField={sortBy}
                                currentSortOrder={sortOrder}
                                onSort={() => onSortChange('createdAt')}
                            />
                        </TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accessories.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center py-8 text-muted-foreground"
                            >
                                No accessories found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        accessories.map((accessory) => (
                            <TableRow key={accessory._id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedAccessories.includes(accessory._id)}
                                        onCheckedChange={(checked) =>
                                            onSelectAccessory(accessory._id, !!checked)
                                        }
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {accessory.name}
                                </TableCell>
                                <TableCell>₹{accessory.cost}</TableCell>
                                <TableCell>
                                    {new Date(accessory.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEditAccessory(accessory)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDeleteAccessory(accessory)}
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

            {accessories.length > 0 && renderPagination()}
        </div>
    );
}
