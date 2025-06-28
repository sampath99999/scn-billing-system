import { Customer } from '#models/customer.model.js';
import { FiltersAndSort } from '#types/Common.js';
import { NewCustomerData, UpdateCustomerData, CustomerFilterOptions, CustomerSortOptions } from '#types/Customer.js';
import { AppError } from '#utils/appError.js';
import { RequestWithUserAndBody } from '#utils/jwt.js';
import mongoose from 'mongoose';

const CustomerService = {
    createCustomer: async (customerData: NewCustomerData, companyId: mongoose.Types.ObjectId) => {
        const {
            first_name,
            last_name,
            care_of,
            phone,
            address,
            box_no,
            note,
            latitude,
            longitude,
            old_due = 0,
            is_active = false // Default to false - needs admin approval
        } = customerData;

        // Check if customer with same phone exists in the company
        await CustomerService.checkCustomerExists(phone, companyId);

        const newCustomer = await Customer.create({
            first_name,
            last_name,
            care_of,
            phone,
            address,
            box_no,
            note,
            latitude,
            longitude,
            old_due,
            is_active,
            company_id: companyId,
        });

        return newCustomer;
    },

    checkCustomerExists: async (phone: string, companyId: mongoose.Types.ObjectId, exceptId: mongoose.Types.ObjectId | null = null) => {
        const customerExists = await Customer.exists({
            phone,
            company_id: companyId,
            _id: { $ne: exceptId },
            is_deleted: false,
        });
        if (customerExists) {
            throw new AppError(
                `Customer with phone number ${phone} already exists`,
                400,
            );
        }
    },

    getAllCustomers: async (data: RequestWithUserAndBody<FiltersAndSort<CustomerFilterOptions, CustomerSortOptions>>) => {
        const searchTerm = data.body.searchTerm;
        const filters = data.body.filters;
        const page = data.body.page ?? 1;
        const pageSize = data.body.pageSize ?? 10;
        const sortBy = data.body.sortBy ?? 'first_name';
        const sortOrder = data.body.sortOrder ?? 'asc';

        const query: Record<string, unknown> = { company_id: data.user.company_id, is_deleted: false };

        if (searchTerm) {
            query.$or = [
                { first_name: { $regex: searchTerm, $options: 'i' } },
                { last_name: { $regex: searchTerm, $options: 'i' } },
                { phone: { $regex: searchTerm, $options: 'i' } },
                { address: { $regex: searchTerm, $options: 'i' } },
                { box_no: { $regex: searchTerm, $options: 'i' } },
                { care_of: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        if (filters) {
            // Handle filters as key-value pairs
            if (filters.is_active !== undefined) {
                query.is_active = filters.is_active;
            }
            if (filters.has_due !== undefined) {
                if (filters.has_due) {
                    query.old_due = { $gt: 0 };
                } else {
                    query.old_due = { $lte: 0 };
                }
            }
        }

        // Get total count for pagination
        const totalCount = await Customer.countDocuments(query);

        const customers = await Customer.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            customers,
            pagination: {
                currentPage: page,
                pageSize,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            },
        };
    },

    getCustomerById: async (customerId: mongoose.Types.ObjectId, companyId: mongoose.Types.ObjectId) => {
        const customer = await Customer.findOne({
            _id: customerId,
            company_id: companyId,
            is_deleted: false,
        });

        if (!customer) {
            throw new AppError('Customer not found', 404);
        }

        return customer;
    },

    updateCustomer: async (
        customerId: mongoose.Types.ObjectId,
        customerData: UpdateCustomerData,
        companyId: mongoose.Types.ObjectId,
    ) => {
        // First check if customer exists
        const customerExists = await Customer.exists({
            _id: customerId,
            company_id: companyId,
            is_deleted: false,
        });
        if (!customerExists) {
            throw new AppError('Customer not found', 404);
        }

        // If phone is being updated, check for conflicts
        if (customerData.phone) {
            await CustomerService.checkCustomerExists(customerData.phone, companyId, customerId);
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            customerId,
            customerData,
            { new: true },
        );
        return updatedCustomer;
    },

    deleteCustomer: async (customerId: mongoose.Types.ObjectId, companyId: mongoose.Types.ObjectId, deletedBy: mongoose.Types.ObjectId) => {
        const customerExists = await Customer.exists({
            _id: customerId,
            company_id: companyId,
            is_deleted: false,
        });
        if (!customerExists) {
            throw new AppError('Customer not found', 404);
        }

        await Customer.findByIdAndUpdate(
            customerId,
            {
                is_deleted: true,
                deleted_at: new Date(),
                deleted_by: deletedBy,
            },
            { new: true },
        );
        return true;
    },

    deleteMultipleCustomers: async (customerIds: mongoose.Types.ObjectId[], companyId: mongoose.Types.ObjectId, deletedBy: mongoose.Types.ObjectId) => {
        if (customerIds.length === 0) {
            throw new AppError('No customer IDs provided', 400);
        }
        const customers = await Customer.updateMany(
            {
                _id: { $in: customerIds },
                company_id: companyId,
                is_deleted: false,
            },
            {
                is_deleted: true,
                deleted_at: new Date(),
                deleted_by: deletedBy,
            },
        );
        if (customers.modifiedCount === 0) {
            throw new AppError('No customers found to delete', 404);
        }
        return customers;
    },

    getCustomersByStatus: async (isActive: boolean, companyId: mongoose.Types.ObjectId) => {
        const customers = await Customer.find({
            company_id: companyId,
            is_active: isActive,
            is_deleted: false,
        }).sort({ first_name: 1 });

        return customers;
    },

    getCustomersWithDue: async (companyId: mongoose.Types.ObjectId) => {
        const customers = await Customer.find({
            company_id: companyId,
            old_due: { $gt: 0 },
            is_deleted: false,
        }).sort({ old_due: -1 });

        return customers;
    },

    updateCustomerStatus: async (customerId: mongoose.Types.ObjectId, isActive: boolean, companyId: mongoose.Types.ObjectId) => {
        const customer = await Customer.findOneAndUpdate(
            {
                _id: customerId,
                company_id: companyId,
                is_deleted: false,
            },
            { is_active: isActive },
            { new: true },
        );

        if (!customer) {
            throw new AppError('Customer not found', 404);
        }

        return customer;
    },

    getPendingCustomers: async (companyId: mongoose.Types.ObjectId) => {
        const customers = await Customer.find({
            company_id: companyId,
            is_active: false, // Pending approval
            is_deleted: false,
        }).sort({ createdAt: -1 }); // Newest first

        return customers;
    },

    approveCustomer: async (customerId: mongoose.Types.ObjectId, companyId: mongoose.Types.ObjectId) => {
        const customer = await Customer.findOneAndUpdate(
            {
                _id: customerId,
                company_id: companyId,
                is_active: false, // Must be pending
                is_deleted: false,
            },
            { is_active: true },
            { new: true },
        );

        if (!customer) {
            throw new AppError('Pending customer not found', 404);
        }

        return customer;
    },

    rejectCustomer: async (customerId: mongoose.Types.ObjectId, companyId: mongoose.Types.ObjectId, deletedBy: mongoose.Types.ObjectId) => {
        const customer = await Customer.findOneAndUpdate(
            {
                _id: customerId,
                company_id: companyId,
                is_active: false, // Must be pending
                is_deleted: false,
            },
            {
                is_deleted: true,
                deleted_at: new Date(),
                deleted_by: deletedBy,
            },
            { new: true },
        );

        if (!customer) {
            throw new AppError('Pending customer not found', 404);
        }

        return customer;
    },
};

export default CustomerService;
