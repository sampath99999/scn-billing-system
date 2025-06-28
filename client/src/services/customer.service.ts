import api from './api.service';
import type {
    Customer,
    CreateCustomerData,
    UpdateCustomerData,
    GetCustomersOptions,
    GetCustomersResponse
} from '@/types/Customer';

const CustomerService = {
    // Get all customers with filters
    getCustomers: async (options: GetCustomersOptions = {}): Promise<GetCustomersResponse> => {
        const params = new URLSearchParams();

        if (options.searchTerm) params.append('searchTerm', options.searchTerm);
        if (options.is_active !== undefined) params.append('is_active', options.is_active.toString());
        if (options.has_due !== undefined) params.append('has_due', options.has_due.toString());
        if (options.page) params.append('page', options.page.toString());
        if (options.pageSize) params.append('pageSize', options.pageSize.toString());
        if (options.sortBy) params.append('sortBy', options.sortBy);
        if (options.sortOrder) params.append('sortOrder', options.sortOrder);

        const response = await api.get(`/customers/all?${params.toString()}`);
        return response.data;
    },

    // Get customer by ID
    getCustomerById: async (id: string): Promise<{ message: string; customer: Customer }> => {
        const response = await api.get(`/customers/${id}`);
        return response.data;
    },

    // Create new customer
    createCustomer: async (customerData: CreateCustomerData): Promise<{ message: string; customer: Customer }> => {
        const response = await api.post('/customers', customerData);
        return response.data;
    },

    // Update customer
    updateCustomer: async (id: string, customerData: UpdateCustomerData): Promise<{ message: string; customer: Customer }> => {
        const response = await api.patch(`/customers/${id}`, customerData);
        return response.data;
    },

    // Delete customer
    deleteCustomer: async (id: string): Promise<{ message: string; result: boolean }> => {
        const response = await api.delete(`/customers/${id}`);
        return response.data;
    },

    // Delete multiple customers
    deleteMultipleCustomers: async (customerIds: string[]): Promise<{ message: string; result: unknown }> => {
        const response = await api.post('/customers/bulk-delete', { customerIds });
        return response.data;
    },

    // Get customers by status (for admin approval workflow)
    getCustomersByStatus: async (isActive: boolean): Promise<{ message: string; customers: Customer[] }> => {
        const response = await api.get(`/customers/status/filter?is_active=${isActive}`);
        return response.data;
    },

    // Get customers with due amounts
    getCustomersWithDue: async (): Promise<{ message: string; customers: Customer[] }> => {
        const response = await api.get('/customers/due/filter');
        return response.data;
    },

    // Get pending customers (admin only)
    getPendingCustomers: async (): Promise<{ message: string; customers: Customer[] }> => {
        const response = await api.get('/customers/pending-approval');
        return response.data;
    },

    // Approve customer (admin only)
    approveCustomer: async (id: string): Promise<{ message: string; customer: Customer }> => {
        const response = await api.patch(`/customers/${id}/approve`, {});
        return response.data;
    },

    // Reject customer (admin only)
    rejectCustomer: async (id: string): Promise<{ message: string; customer: Customer }> => {
        const response = await api.patch(`/customers/${id}/reject`, {});
        return response.data;
    },

    // Update customer status (admin only)
    updateCustomerStatus: async (id: string, isActive: boolean): Promise<{ message: string; customer: Customer }> => {
        const response = await api.patch(`/customers/${id}/status`, { is_active: isActive });
        return response.data;
    },
};

export default CustomerService;
