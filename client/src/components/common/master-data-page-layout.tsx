import type { ReactNode } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import PageBreadcrumb from '@/components/common/page-breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface MasterDataPageLayoutProps {
  title: string;
  description: string;
  breadcrumbItems: BreadcrumbItem[];
  children: ReactNode;
  selectedCount: number;
  onAdd: () => void;
  onBulkDelete: () => void;
  onSearch: (searchTerm: string) => void;
  cardTitle: string;
  cardDescription: string;
  addButtonText: string;
  searchPlaceholder: string;
}

export function MasterDataPageLayout({
  title,
  description,
  breadcrumbItems,
  children,
  selectedCount,
  onAdd,
  onBulkDelete,
  onSearch,
  cardTitle,
  cardDescription,
  addButtonText,
  searchPlaceholder,
}: MasterDataPageLayoutProps) {
  return (
    <div className="p-6 space-y-6">
      <PageBreadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{cardTitle}</CardTitle>
              <CardDescription>{cardDescription}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {selectedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedCount})
                </Button>
              )}
              <Button onClick={onAdd} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {addButtonText}
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-10"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
