import { Edit, Trash2, Eye, Check, X, MapPin, Phone, CreditCard } from 'lucide-react';
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
import { Badge } from '../../../../../components/ui/badge';
import type { Customer, CustomerPaginationMetadata } from '@/types/Customer';
import { cn } from '@/lib/utils';
import SortableHeader from '../../packages/components/sortable-header';

interface CustomersTableProps {
    customers: Customer[];
    loading: boolean;
    selectedCustomers: string[];
    pagination: CustomerPaginationMetadata;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSelectCustomer: (id: string, isSelected: boolean) => void;
    onSelectAll: (isSelected: boolean) => void;
    onEditCustomer: (customer: Customer) => void;
    onViewCustomer: (customer: Customer) => void;
    onDeleteCustomer: (customer: Customer) => void;
    onSortChange: (field: string) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    isPendingView?: boolean;
    onApproveCustomer?: (customer: Customer) => void;
    onRejectCustomer?: (customer: Customer) => void;
}

export function CustomersTable({
    customers,
    loading,
    selectedCustomers,
    pagination,
    sortBy,
    sortOrder,
    onSelectCustomer,
    onSelectAll,
    onEditCustomer,
    onViewCustomer,
    onDeleteCustomer,
    onSortChange,
    onPageChange,
    isPendingView = false,
    onApproveCustomer,
    onRejectCustomer,
}: CustomersTableProps) {
    const isAllSelected =
        customers.length > 0 && selectedCustomers.length === customers.length;

    const renderStatusBadge = (isActive: boolean) => {
        return (
            <Badge
                variant={isActive ? "default" : "secondary"}
                className={cn(
                    isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                )}
            >
                {isActive ? 'Active' : 'Pending'}
            </Badge>
        );
    };

    const renderDueBadge = (oldDue: number) => {
        if (oldDue > 0) {
            return (
                <Badge variant="destructive" className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    ₹{oldDue.toLocaleString()}
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="text-green-600 border-green-200">
                No Due
            </Badge>
        );
    };

    const renderPagination = () => {
        const { currentPage, totalPages } = pagination;

        if (totalPages <= 1) return null;

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

            // Show ellipsis if current page is far from end
            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
            }

            // Always show last page if it's not already included
            if (totalPages > 1) {
                pageNumbers.push(totalPages);
            }
        }

        return (
            <div className="flex items-center justify-between px-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * pagination.pageSize) + 1} to{' '}
                    {Math.min(currentPage * pagination.pageSize, pagination.totalCount)} of{' '}
                    {pagination.totalCount} customers
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>

                    {pageNumbers.map((pageNumber, index) => (
                        <Button
                            key={index}
                            variant={pageNumber === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => typeof pageNumber === 'number' && onPageChange(pageNumber)}
                            disabled={pageNumber === '...'}
                            className={pageNumber === '...' ? 'cursor-default' : ''}
                        >
                            {pageNumber}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Skeleton className="h-4 w-4" />
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Box No</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Due Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
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
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-40" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-20" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Skeleton className="h-8 w-8" />
                                            <Skeleton className="h-8 w-8" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {!isPendingView && (
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={onSelectAll}
                                        aria-label="Select all customers"
                                    />
                                </TableHead>
                            )}
                            <TableHead>
                                <SortableHeader
                                    label="Name"
                                    sortField="first_name"
                                    currentSortField={sortBy}
                                    currentSortOrder={sortOrder}
                                    onSort={() => onSortChange('first_name')}
                                />
                            </TableHead>
                            <TableHead>
                                <SortableHeader
                                    label="Contact"
                                    sortField="phone"
                                    currentSortField={sortBy}
                                    currentSortOrder={sortOrder}
                                    onSort={() => onSortChange('phone')}
                                />
                            </TableHead>
                            <TableHead>
                                <SortableHeader
                                    label="Address"
                                    sortField="address"
                                    currentSortField={sortBy}
                                    currentSortOrder={sortOrder}
                                    onSort={() => onSortChange('address')}
                                />
                            </TableHead>
                            <TableHead>
                                <SortableHeader
                                    label="Box No"
                                    sortField="box_no"
                                    currentSortField={sortBy}
                                    currentSortOrder={sortOrder}
                                    onSort={() => onSortChange('box_no')}
                                />
                            </TableHead>
                            <TableHead>
                                <SortableHeader
                                    label="Status"
                                    sortField="is_active"
                                    currentSortField={sortBy}
                                    currentSortOrder={sortOrder}
                                    onSort={() => onSortChange('is_active')}
                                />
                            </TableHead>
                            <TableHead>
                                <SortableHeader
                                    label="Due Amount"
                                    sortField="old_due"
                                    currentSortField={sortBy}
                                    currentSortOrder={sortOrder}
                                    onSort={() => onSortChange('old_due')}
                                />
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={isPendingView ? 7 : 8}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    {isPendingView ? 'No pending customers found.' : 'No customers found.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow key={customer._id}>
                                    {!isPendingView && (
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedCustomers.includes(customer._id)}
                                                onCheckedChange={(checked) =>
                                                    onSelectCustomer(customer._id, checked as boolean)
                                                }
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium">
                                                {customer.first_name} {customer.last_name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                c/o {customer.care_of}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Phone className="h-3 w-3" />
                                            {customer.phone}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-start gap-1 text-sm max-w-xs">
                                            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                            <span className="truncate">{customer.address}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-sm">{customer.box_no}</span>
                                    </TableCell>
                                    <TableCell>
                                        {renderStatusBadge(customer.is_active)}
                                    </TableCell>
                                    <TableCell>
                                        {renderDueBadge(customer.old_due)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onViewCustomer(customer)}
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            {isPendingView && onApproveCustomer && onRejectCustomer ? (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onApproveCustomer(customer)}
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        title="Approve Customer"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onRejectCustomer(customer)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        title="Reject Customer"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEditCustomer(customer)}
                                                        title="Edit Customer"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDeleteCustomer(customer)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        title="Delete Customer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {!isPendingView && renderPagination()}
        </div>
    );
}
