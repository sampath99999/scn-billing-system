import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Search, Trash2, UserCheck, Clock } from 'lucide-react';
import PageBreadcrumb from '@/components/common/page-breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import type { Customer, GetCustomersOptions, CreateCustomerData, UpdateCustomerData } from '@/types/Customer';
import CustomerService from '@/services/customer.service';
import { CustomerFormModal } from './components/customer-form-modal';
import { CustomerSingleView } from './components/customer-single-view';
import { CustomersTable } from './components/customers-table';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Master Data', href: '/dashboard/master-data' },
  { label: 'Customers', isCurrentPage: true },
];

export default function CustomersPage() {
  // State for customers data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pendingCustomers, setPendingCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });

  // State for filters
  const [filters, setFilters] = useState<GetCustomersOptions>({
    page: 1,
    pageSize: 10,
    sortBy: 'first_name',
    sortOrder: 'asc',
  });

  // State for selected customers (for bulk delete)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // State for dialogs
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  // Current tab
  const [activeTab, setActiveTab] = useState('all');

  // Load customers
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await CustomerService.getCustomers(filters);
      setCustomers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load customers:', error);
      toast.error('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load pending customers (for admin approval)
  const loadPendingCustomers = async () => {
    setPendingLoading(true);
    try {
      const response = await CustomerService.getPendingCustomers();
      setPendingCustomers(response.customers);
    } catch (error) {
      console.error('Failed to load pending customers:', error);
      toast.error('Failed to load pending customers. Please try again.');
    } finally {
      setPendingLoading(false);
    }
  };

  // Load customers on initial render and when filters change
  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Load pending customers when switching to pending tab
  useEffect(() => {
    if (activeTab === 'pending') {
      loadPendingCustomers();
    }
  }, [activeTab]);

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

  // Handle filter by status
  const handleFilterByStatus = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      is_active: status === 'all' ? undefined : status === 'active'
    }));
  };

  // Handle filter by due status
  const handleFilterByDue = (hasDue: string) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      has_due: hasDue === 'all' ? undefined : hasDue === 'with_due'
    }));
  };

  // Handle checkbox selection
  const handleSelectCustomer = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCustomers((prev) => [...prev, id]);
    } else {
      setSelectedCustomers((prev) => prev.filter((customerId) => customerId !== id));
    }
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedCustomers(customers.map((customer) => customer._id));
    } else {
      setSelectedCustomers([]);
    }
  };

  // Handle add new customer
  const handleAddNewCustomer = () => {
    setCurrentCustomer(null);
    setIsAddEditDialogOpen(true);
  };

  // Handle edit customer
  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsAddEditDialogOpen(true);
  };

  // Handle view customer details
  const handleViewCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDetailsDialogOpen(true);
  };

  // Handle delete customer
  const handleDeleteCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedCustomers.length > 0) {
      setIsBulkDeleteDialogOpen(true);
    }
  };

  // Handle approve customer
  const handleApproveCustomer = async (customer: Customer) => {
    try {
      await CustomerService.approveCustomer(customer._id);
      toast.success('Customer approved successfully');
      loadPendingCustomers();
      loadCustomers(); // Refresh main list
    } catch (error) {
      console.error('Failed to approve customer:', error);
      toast.error('Failed to approve customer. Please try again.');
    }
  };

  // Handle reject customer
  const handleRejectCustomer = async (customer: Customer) => {
    try {
      await CustomerService.rejectCustomer(customer._id);
      toast.success('Customer rejected successfully');
      loadPendingCustomers();
    } catch (error) {
      console.error('Failed to reject customer:', error);
      toast.error('Failed to reject customer. Please try again.');
    }
  };

  // Confirm delete customer
  const confirmDeleteCustomer = async () => {
    if (!currentCustomer) return;

    try {
      await CustomerService.deleteCustomer(currentCustomer._id);
      toast.success('Customer deleted successfully');
      loadCustomers();
      setSelectedCustomers((prev) => prev.filter((id) => id !== currentCustomer._id));
    } catch (error) {
      console.error('Failed to delete customer:', error);
      toast.error('Failed to delete customer. Please try again.');
    } finally {
      setIsDeleteDialogOpen(false);
      setCurrentCustomer(null);
    }
  };

  // Confirm bulk delete
  const confirmBulkDelete = async () => {
    try {
      await CustomerService.deleteMultipleCustomers(selectedCustomers);
      toast.success(`${selectedCustomers.length} customers deleted successfully`);
      loadCustomers();
      setSelectedCustomers([]);
    } catch (error) {
      console.error('Failed to delete customers:', error);
      toast.error('Failed to delete customers. Please try again.');
    } finally {
      setIsBulkDeleteDialogOpen(false);
    }
  };

  // Handle save customer (add or edit)
  const handleSaveCustomer = async (data: CreateCustomerData | UpdateCustomerData) => {
    try {
      setLoading(true);

      if (currentCustomer) {
        // Update existing customer
        await CustomerService.updateCustomer(currentCustomer._id, data as UpdateCustomerData);
        toast.success('Customer updated successfully!');
      } else {
        // Create new customer
        await CustomerService.createCustomer(data as CreateCustomerData);
        toast.success('Customer created successfully and is pending approval!');
      }

      // Refresh the customer lists
      await loadCustomers();
      await loadPendingCustomers();

      // Close the modal
      setIsAddEditDialogOpen(false);
      setCurrentCustomer(null);

    } catch (error: unknown) {
      console.error('Error saving customer:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Failed to save customer. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageBreadcrumb items={breadcrumbItems} />

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            Manage cable TV customers, approve new registrations, and track customer information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                All Customers
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Approval
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {/* Filters and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Select
                    value={filters.is_active === undefined ? 'all' : filters.is_active ? 'active' : 'pending'}
                    onValueChange={handleFilterByStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.has_due === undefined ? 'all' : filters.has_due ? 'with_due' : 'no_due'}
                    onValueChange={handleFilterByDue}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by due" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="with_due">With Due</SelectItem>
                      <SelectItem value="no_due">No Due</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-2">
                  {selectedCustomers.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({selectedCustomers.length})
                    </Button>
                  )}

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      className="pl-8"
                      value={filters.searchTerm || ''}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleAddNewCustomer}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Customers Table */}
              <CustomersTable
                customers={customers}
                loading={loading}
                selectedCustomers={selectedCustomers}
                pagination={pagination}
                sortOrder={filters.sortOrder || 'asc'}
                sortBy={filters.sortBy || 'first_name'}
                onSelectCustomer={handleSelectCustomer}
                onSelectAll={handleSelectAll}
                onEditCustomer={handleEditCustomer}
                onViewCustomer={handleViewCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                onSortChange={handleSortChange}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <CustomersTable
                customers={pendingCustomers}
                loading={pendingLoading}
                selectedCustomers={[]}
                pagination={{ currentPage: 1, pageSize: 10, totalCount: pendingCustomers.length, totalPages: 1 }}
                sortOrder="asc"
                sortBy="createdAt"
                onSelectCustomer={() => {}}
                onSelectAll={() => {}}
                onEditCustomer={() => {}}
                onViewCustomer={handleViewCustomer}
                onDeleteCustomer={() => {}}
                onSortChange={() => {}}
                onPageChange={() => {}}
                onPageSizeChange={() => {}}
                isPendingView={true}
                onApproveCustomer={handleApproveCustomer}
                onRejectCustomer={handleRejectCustomer}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Customer Modal */}
      <CustomerFormModal
        open={isAddEditDialogOpen}
        onClose={() => setIsAddEditDialogOpen(false)}
        onSubmit={handleSaveCustomer}
        customer={currentCustomer}
        loading={loading}
      />

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View detailed information about this customer.
            </DialogDescription>
          </DialogHeader>

          {currentCustomer && (
            <CustomerSingleView
              customer={currentCustomer}
              onBack={() => setIsDetailsDialogOpen(false)}
              onEdit={() => {
                setIsDetailsDialogOpen(false);
                setIsAddEditDialogOpen(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer
              "{currentCustomer?.first_name} {currentCustomer?.last_name}" and remove all their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCustomer}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedCustomers.length} customers
              and remove all their data from our servers.
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
