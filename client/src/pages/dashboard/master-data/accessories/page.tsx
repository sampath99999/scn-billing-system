import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Search, Trash2 } from 'lucide-react';
import PageBreadcrumb from '@/components/common/page-breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { Accessory, GetAccessoriesOptions } from '@/types/Accessory';
import AccessoryService from '@/services/accessory.service';
import { AccessoriesTable } from './components/accessories-table';
import { AddEditAccessoryForm } from './components/add-edit-accessory-form';

export default function AccessoriesPage() {
  // State for accessories data
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });

  // State for filters
  const [filters, setFilters] = useState<GetAccessoriesOptions>({
    page: 1,
    pageSize: 10,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // State for selected accessories (for bulk delete)
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  // State for dialogs
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [currentAccessory, setCurrentAccessory] = useState<Accessory | null>(null);

  // Load accessories
  const loadAccessories = async () => {
    setLoading(true);
    try {
      const response = await AccessoryService.getAccessories(filters);
      setAccessories(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load accessories:', error);
      toast.error('Failed to load accessories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load accessories on initial render and when filters change
  useEffect(() => {
    loadAccessories();
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
    setFilters((prev) => ({ ...prev, searchTerm, page: 1 }));
  };

  // Handle select accessory
  const handleSelectAccessory = (id: string, isSelected: boolean) => {
    setSelectedAccessories((prev) =>
      isSelected ? [...prev, id] : prev.filter((accessoryId) => accessoryId !== id)
    );
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    setSelectedAccessories(isSelected ? accessories.map((accessory) => accessory._id) : []);
  };

  // Handle add accessory
  const handleAddAccessory = () => {
    setCurrentAccessory(null);
    setIsAddEditDialogOpen(true);
  };

  // Handle edit accessory
  const handleEditAccessory = (accessory: Accessory) => {
    setCurrentAccessory(accessory);
    setIsAddEditDialogOpen(true);
  };

  // Handle delete accessory
  const handleDeleteAccessory = (accessory: Accessory) => {
    setCurrentAccessory(accessory);
    setIsDeleteDialogOpen(true);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedAccessories.length === 0) {
      toast.error('Please select accessories to delete.');
      return;
    }
    setIsBulkDeleteDialogOpen(true);
  };

  // Confirm delete accessory
  const confirmDeleteAccessory = async () => {
    if (!currentAccessory) return;

    try {
      await AccessoryService.deleteAccessory(currentAccessory._id);
      toast.success('Accessory deleted successfully');
      setIsDeleteDialogOpen(false);
      setCurrentAccessory(null);
      await loadAccessories();
    } catch (error) {
      console.error('Failed to delete accessory:', error);
      toast.error('Failed to delete accessory. Please try again.');
    }
  };

  // Confirm bulk delete
  const confirmBulkDelete = async () => {
    try {
      await AccessoryService.deleteMultipleAccessories(selectedAccessories);
      toast.success(`${selectedAccessories.length} accessories deleted successfully`);
      setIsBulkDeleteDialogOpen(false);
      setSelectedAccessories([]);
      await loadAccessories();
    } catch (error) {
      console.error('Failed to delete accessories:', error);
      toast.error('Failed to delete accessories. Please try again.');
    }
  };

  // Handle save accessory
  const handleSaveAccessory = async () => {
    setIsAddEditDialogOpen(false);
    setCurrentAccessory(null);
    await loadAccessories();
  };

  return (
    <>
      <PageBreadcrumb 
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Master Data', href: '/dashboard/master-data' },
          { label: 'Accessories', isCurrentPage: true },
        ]} 
      />
      <Card>
        <CardHeader>
          <CardTitle>Accessories</CardTitle>
          <CardDescription>
            Manage your accessories inventory with ease.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accessories..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {selectedAccessories.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected ({selectedAccessories.length})
                </Button>
              )}
              <Button onClick={handleAddAccessory}>
                <Plus className="mr-2 h-4 w-4" />
                Add Accessory
              </Button>
            </div>
          </div>
          <Separator />
          <AccessoriesTable
            accessories={accessories}
            loading={loading}
            selectedAccessories={selectedAccessories}
            pagination={pagination}
            sortBy={filters.sortBy || 'name'}
            sortOrder={filters.sortOrder || 'asc'}
            onSelectAccessory={handleSelectAccessory}
            onSelectAll={handleSelectAll}
            onEditAccessory={handleEditAccessory}
            onDeleteAccessory={handleDeleteAccessory}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentAccessory ? 'Edit Accessory' : 'Add New Accessory'}
            </DialogTitle>
            <DialogDescription>
              {currentAccessory
                ? 'Update the accessory details below.'
                : 'Fill in the information to create a new accessory.'}
            </DialogDescription>
          </DialogHeader>
          <AddEditAccessoryForm
            accessoryData={currentAccessory}
            onSave={handleSaveAccessory}
            onCancel={() => setIsAddEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              accessory "{currentAccessory?.name}" from your account and remove
              the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAccessory}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              {selectedAccessories.length} selected accessories from your account
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
