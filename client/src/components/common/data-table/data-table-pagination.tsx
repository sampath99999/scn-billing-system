import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { PaginationMetadata } from '@/types/Package';

interface DataTablePaginationProps {
    pagination: PaginationMetadata;
    onPaginationChange: (pageIndex: number, pageSize: number) => void;
    itemName?: string;
}

export function DataTablePagination({
    pagination,
    onPaginationChange,
    itemName = 'items',
}: DataTablePaginationProps) {
    const handlePageChange = (pageIndex: number) => {
        onPaginationChange(pageIndex, pagination.pageSize);
    };

    const handlePageSizeChange = (pageSize: number) => {
        onPaginationChange(0, pageSize);
    };

    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages} (
                {pagination.totalCount} {itemName})
            </div>
            <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                >
                    Next
                </Button>
            </div>
            <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Page Size" />
                </SelectTrigger>
                <SelectContent>
                    {[10, 20, 30, 40, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                            {size}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
