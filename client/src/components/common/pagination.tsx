import { Button } from '@/components/ui/button';

interface PaginationMetadata {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

interface PaginationProps {
    pagination: PaginationMetadata;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({ pagination, onPageChange, onPageSizeChange }: PaginationProps) {
    const { currentPage, totalPages, pageSize, totalCount } = pagination;

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
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }
    }

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
                Showing{' '}
                {pageSize * (currentPage - 1) + 1} to{' '}
                {Math.min(pageSize * currentPage, totalCount)}{' '}
                of {totalCount} entries
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
                    value={pageSize}
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
}
