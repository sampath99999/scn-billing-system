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
import { useEffect, useState } from 'react';
import type { PaginationMetadata } from '@/types/Package';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onSearchTermChange: (searchTerm: string) => void;
    onFilterChange?: (filter: string | undefined) => void;
    onPaginationChange: (pageIndex: number, pageSize: number) => void;
    onSortingChange: (sorting: SortingState) => void;
    pagination: PaginationMetadata;
    loading: boolean;
    filterOptions?: {
        name: string;
        options: { value: string; label: string }[];
    };
    searchPlaceholder?: string;
    onDeleteSelected?: (selectedItems: TData[]) => void;
    createComponent?: React.ReactNode;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onSearchTermChange,
    onFilterChange,
    onPaginationChange,
    onSortingChange,
    pagination,
    loading,
    filterOptions,
    searchPlaceholder = "Search...",
    onDeleteSelected,
    createComponent,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
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

    const handleDeleteSelected = () => {
        if (onDeleteSelected) {
            const selectedRows = table.getSelectedRowModel().rows;
            const selectedItems = selectedRows.map((row) => row.original);
            onDeleteSelected(selectedItems);
            setRowSelection({});
        }
    };

    useEffect(() => {
        onSortingChange(sorting);
    }, [sorting, onSortingChange]);

    return (
        <div>
            <DataTableToolbar
                table={table}
                onSearchTermChange={onSearchTermChange}
                onFilterChange={onFilterChange}
                filterOptions={filterOptions}
                searchPlaceholder={searchPlaceholder}
                onDeleteSelected={handleDeleteSelected}
                createComponent={createComponent}
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Loading data...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
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

            <DataTablePagination
                pagination={pagination}
                onPaginationChange={onPaginationChange}
            />
        </div>
    );
}
