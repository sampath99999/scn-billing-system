import {
    useReactTable,
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    type RowSelectionState,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CornerDownLeft, Trash2 } from 'lucide-react';
import { PACKAGE_TYPES } from '@/types/Package';
import { useEffect, useState } from 'react';
import CreatePackageDrawer from './createPackageDrawer';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onSearchTermChange: (searchTerm: string) => void;
    onPackageTypeFilterChange: (packageType: string | undefined) => void;
    onPaginationChange: (pageIndex: number, pageSize: number) => void;
    onSortingChange: (sorting: SortingState) => void;
    pagination: {
        currentPage: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
    loading: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onSearchTermChange,
    onPackageTypeFilterChange,
    onPaginationChange,
    onSortingChange,
    pagination,
    loading,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [packageTypeFilter, setPackageTypeFilter] = useState<string | undefined>(undefined);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        manualPagination: true,
        manualSorting: true,
        state: {
            sorting,
            rowSelection,
            pagination: {
                pageIndex: pagination.currentPage - 1,
                pageSize: pagination.pageSize,
            },
        },
    });

    const handleSearch = () => {
        onSearchTermChange(searchTerm);
    };

    const handlePackageTypeFilter = (value: string) => {
        const filterValue = value === 'all' ? undefined : value;
        setPackageTypeFilter(filterValue);
        onPackageTypeFilterChange(filterValue);
    };

    const handlePageChange = (pageIndex: number) => {
        onPaginationChange(pageIndex, pagination.pageSize);
    };

    const handlePageSizeChange = (pageSize: number) => {
        onPaginationChange(0, pageSize);
    };

    const handleDeleteSelected = () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const selectedPackages = selectedRows.map(row => row.original);
        console.log('Delete selected packages:', selectedPackages);
        // TODO: Implement delete functionality
        // Reset selection after delete
        setRowSelection({});
    };

    useEffect(() => {
        onSortingChange(sorting);
    }, [sorting, onSortingChange]);


    return (
        <div>
            <div className="flex items-center py-4 gap-4">
                <div className="relative max-w-3xs">
                    <Input
                        placeholder="Search by name or price..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        className="pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <div className="flex items-center justify-center w-6 h-6 bg-muted rounded border text-muted-foreground text-xs">
                            <CornerDownLeft className="h-3 w-3" />
                        </div>
                    </div>
                </div>

                <Select onValueChange={handlePackageTypeFilter} value={packageTypeFilter || 'all'}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Package Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Package Types</SelectItem>
                        {Object.values(PACKAGE_TYPES).map((type) => (
                            <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {table.getSelectedRowModel().rows.length > 0 && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteSelected}
                        className="ml-auto"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected ({table.getSelectedRowModel().rows.length})
                    </Button>
                )}
                <CreatePackageDrawer />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Loading packages...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} packages)
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
        </div>
    );
}
