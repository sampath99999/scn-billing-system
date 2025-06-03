// Columns:
import type { Package } from '@/types/Package';
import type { ColumnDef } from '@tanstack/react-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import SortTableHeader from './sortTableHeader';
import { Checkbox } from '@/components/ui/checkbox';

function editPackage(packageData: Package) {
    // Logic to edit the package
    console.log('Edit package:', packageData);
}

function deletePackage(packageData: Package) {
    // Logic to delete the package
    console.log('Delete package:', packageData);
}

export const columns: ColumnDef<Package>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <SortTableHeader
                    column={column}
                    header="Name"
                />
            );
        },
    },
    {
        accessorKey: 'package_type',
        header: ({ column }) => {
            return (
                <SortTableHeader
                    column={column}
                    header="Package Type"
                />
            );
        },
    },
    {
        accessorKey: 'price_per_month',
        header: ({ column }) => {
            return (
                <SortTableHeader
                    column={column}
                    header="Price per Month"
                />
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('price_per_month'));
            const formatted = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
            }).format(amount);
            return <span>{formatted}</span>;
        },
    },
    {
        accessorKey: 'updatedAt',
        header: ({ column }) => {
            return (
                <SortTableHeader
                    column={column}
                    header="Last Updated At"
                />
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('updatedAt'));
            return <span>{date.toLocaleDateString('en-IN')}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const packageData = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => editPackage(packageData)}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => deletePackage(packageData)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
