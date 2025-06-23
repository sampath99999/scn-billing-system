import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Search, Trash2 } from 'lucide-react';
import PageBreadcrumb from '@/components/common/page-breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PACKAGE_TYPES } from '@/types/Package';
import type { Package, GetPackagesOptions } from '@/types/Package';
import PackageService from '@/services/packages.service';
import { PackagesTable } from './components/packages-table';
import { AddEditPackageForm } from './components/add-edit-package-form';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Master Data', href: '/dashboard/master-data' },
  { label: 'Packages', isCurrentPage: true },
];

export default function PackagesPage() {
  // State for packages data
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });

  // State for filters
  const [filters, setFilters] = useState<GetPackagesOptions>({
    page: 1,
    pageSize: 10,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // State for selected packages (for bulk delete)
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  // State for dialogs
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);

  // Load packages
  const loadPackages = async () => {
    setLoading(true);
    try {
      const response = await PackageService.getPackages(filters);
      setPackages(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load packages:', error);
      toast.error('Failed to load packages. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // Load packages on initial render and when filters change
  useEffect(() => {
    loadPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle page size change
  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, page: 1, pageSize }));
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, page: 1, searchTerm }));
  };

  // Handle filter by package type
  const handleFilterByType = (packageType: string) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      packageType: packageType === 'all' ? undefined : packageType
    }));
  };

  // Handle checkbox selection
  const handleSelectPackage = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPackages((prev) => [...prev, id]);
    } else {
      setSelectedPackages((prev) => prev.filter((packageId) => packageId !== id));
    }
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedPackages(packages.map((pkg) => pkg._id));
    } else {
      setSelectedPackages([]);
    }
  };

  // Handle add new package
  const handleAddNewPackage = () => {
    setCurrentPackage(null);
    setIsAddEditDialogOpen(true);
  };

  // Handle edit package
  const handleEditPackage = (pkg: Package) => {
    setCurrentPackage(pkg);
    setIsAddEditDialogOpen(true);
  };

  // Handle delete package
  const handleDeletePackage = (pkg: Package) => {
    setCurrentPackage(pkg);
    setIsDeleteDialogOpen(true);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedPackages.length > 0) {
      setIsBulkDeleteDialogOpen(true);
    }
  };

  // Confirm delete package
  const confirmDeletePackage = async () => {
    if (!currentPackage) return;

    try {
      await PackageService.deletePackage(currentPackage._id);
      toast.success('Package deleted successfully');
      loadPackages();
      setSelectedPackages((prev) => prev.filter((id) => id !== currentPackage._id));
    } catch (error) {
      console.error('Failed to delete package:', error);
      toast.error('Failed to delete package. Please try again.');
    } finally {
      setIsDeleteDialogOpen(false);
      setCurrentPackage(null);
    }
  };

  // Confirm bulk delete
  const confirmBulkDelete = async () => {
    try {
      await PackageService.deleteMultiplePackages(selectedPackages);
      toast.success(`${selectedPackages.length} packages deleted successfully`);
      loadPackages();
      setSelectedPackages([]);
    } catch (error) {
      console.error('Failed to delete packages:', error);
      toast.error('Failed to delete packages. Please try again.');
    } finally {
      setIsBulkDeleteDialogOpen(false);
    }
  };

  // Handle save package (add or edit)
  const handleSavePackage = () => {
    loadPackages();
    setIsAddEditDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />

      <Card>
        <CardHeader>
          <CardTitle>Packages</CardTitle>
          <CardDescription>
            Manage cable TV and internet packages offered to customers.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Select
                value={filters.packageType || 'all'}
                onValueChange={handleFilterByType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={PACKAGE_TYPES.PACKAGE}>Package</SelectItem>
                  <SelectItem value={PACKAGE_TYPES.ADD_ON}>Add On</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              {selectedPackages.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedPackages.length})
                </Button>
              )}

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search packages..."
                  className="pl-8"
                  value={filters.searchTerm || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <Button onClick={handleAddNewPackage}>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Packages Table */}
          <PackagesTable
            packages={packages}
            loading={loading}
            selectedPackages={selectedPackages}
            pagination={pagination}
            sortOrder={filters.sortOrder || 'asc'}
            sortBy={filters.sortBy || 'name'}
            onSelectPackage={handleSelectPackage}
            onSelectAll={handleSelectAll}
            onEditPackage={handleEditPackage}
            onDeletePackage={handleDeletePackage}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Package Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            <DialogDescription>
              {currentPackage
                ? 'Update the package details below.'
                : 'Fill in the package details below to create a new package.'}
            </DialogDescription>
          </DialogHeader>

          <AddEditPackageForm
            packageData={currentPackage}
            onSave={handleSavePackage}
            onCancel={() => setIsAddEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the package
              "{currentPackage?.name}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePackage}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedPackages.length} packages
              and remove them from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete}>Delete All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
