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
import SortableHeader from '@/components/common/sortable-header';
import { Pagination } from '@/components/common/pagination';

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
        return (
            <Pagination
                pagination={pagination}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
            />
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
