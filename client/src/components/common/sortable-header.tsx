import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

interface SortableHeaderProps {
    label: string;
    sortField: string;
    currentSortField: string;
    currentSortOrder: 'asc' | 'desc';
    onSort: () => void;
}

export default function SortableHeader({
    label,
    sortField,
    currentSortField,
    currentSortOrder,
    onSort
}: SortableHeaderProps) {
    const isActive = currentSortField === sortField;

    return (
        <div
            className="flex items-center cursor-pointer"
            onClick={onSort}
        >
            {label}
            {isActive ? (
                currentSortOrder === 'asc' ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                )
            ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
        </div>
    );
}
