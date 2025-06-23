import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CornerDownLeft, Trash2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Table } from '@tanstack/react-table';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    onSearchTermChange: (value: string) => void;
    onFilterChange?: (value: string | undefined) => void;
    filterOptions?: {
        name: string;
        options: { value: string; label: string }[];
    };
    searchPlaceholder?: string;
    onDeleteSelected?: () => void;
    createComponent?: React.ReactNode;
}

export function DataTableToolbar<TData>({
    table,
    onSearchTermChange,
    onFilterChange,
    filterOptions,
    searchPlaceholder = 'Search...',
    onDeleteSelected,
    createComponent,
}: DataTableToolbarProps<TData>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValue, setFilterValue] = useState<string | undefined>(
        undefined
    );

    const handleSearch = () => {
        onSearchTermChange(searchTerm);
    };

    const handleFilterChange = (value: string) => {
        const newValue = value === 'all' ? undefined : value;
        setFilterValue(newValue);
        if (onFilterChange) {
            onFilterChange(newValue);
        }
    };

    return (
        <div className="flex items-center py-4 gap-4">
            <div className="relative max-w-3xs">
                <Input
                    placeholder={searchPlaceholder}
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

            {filterOptions && (
                <Select
                    onValueChange={handleFilterChange}
                    value={filterValue || 'all'}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={`Filter by ${filterOptions.name}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All {filterOptions.name}s</SelectItem>
                        {filterOptions.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            <div className="ms-auto flex items-center gap-2">
                {table.getSelectedRowModel().rows.length > 0 && onDeleteSelected && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={onDeleteSelected}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected ({table.getSelectedRowModel().rows.length})
                    </Button>
                )}
                {createComponent}
            </div>
        </div>
    );
}
