import type { Package } from "@/types/Package";
import type { Column } from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

export default function SortTableHeader({column, header}: {column: Column<Package>, header: string}) {
    const sortDirection = column.getIsSorted();

    return (
        <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {header}
            {sortDirection === 'asc' ? (
                <ChevronUp className="ml-2 h-4 w-4" />
            ) : sortDirection === 'desc' ? (
                <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
        </div>
    );
}
