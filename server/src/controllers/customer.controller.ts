import { AuthBodyAndCustomerId, NewCustomerType, UpdateCustomerType, CustomerFilterOptions, CustomerSortOptions } from '#types/Customer.js';
import catchAsync from '#helpers/catchAsync.helper.js';
import CustomerService from '#services/customer.service.js';
import { FiltersAndSort, ObjectId } from '#types/Common.js';
import { RequestWithUserAndBody } from '#utils/jwt.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const CustomerController = {
    createCustomer: catchAsync(async (req: Request, res: Response) => {
        const newCustomerData = (req as NewCustomerType).body;
        const companyId = (req as NewCustomerType).user.company_id;
        const result = await CustomerService.createCustomer(
            newCustomerData,
            companyId,
        );
        res.status(201).json({
            message: 'Customer created successfully and pending approval',
            customer: result,
        });
    }),

    getAllCustomers: catchAsync(async (req: Request, res: Response) => {
        const filters: CustomerFilterOptions = {};

        if (req.query.is_active !== undefined) {
            filters.is_active = req.query.is_active === 'true';
        }

        if (req.query.has_due !== undefined) {
            filters.has_due = req.query.has_due === 'true';
        }

        const queryData: FiltersAndSort<CustomerFilterOptions, CustomerSortOptions> = {
            searchTerm: req.query.searchTerm as string,
            filters,
            page: req.query.page ? Number(req.query.page) : undefined,
            pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
            sortBy: req.query.sortBy as CustomerSortOptions,
            sortOrder: req.query.sortOrder as 'asc' | 'desc',
        };

        const requestWithData = {
            ...req,
            body: queryData,
        } as RequestWithUserAndBody<FiltersAndSort<CustomerFilterOptions, CustomerSortOptions>>;

        const result = await CustomerService.getAllCustomers(requestWithData);
        res.status(200).json({
            message: 'Customers fetched successfully',
            data: result.customers,
            pagination: result.pagination,
        });
    }),

    getCustomerById: catchAsync(async (req: Request, res: Response) => {
        const customerId = req.params.id as unknown as mongoose.Types.ObjectId;
        const companyId = (req as NewCustomerType).user.company_id;
        const result = await CustomerService.getCustomerById(customerId, companyId);
        res.status(200).json({
            message: 'Customer fetched successfully',
            customer: result,
        });
    }),

    updateCustomer: catchAsync(async (req: Request, res: Response) => {
        const customerId = req.params.id as unknown as mongoose.Types.ObjectId;
        const updateCustomerData = (req as UpdateCustomerType).body;
        const companyId = (req as UpdateCustomerType).user.company_id;
        const result = await CustomerService.updateCustomer(
            customerId,
            updateCustomerData,
            companyId,
        );
        res.status(200).json({
            message: 'Customer updated successfully',
            customer: result,
        });
    }),

    deleteCustomer: catchAsync(async (req: Request, res: Response) => {
        const customerId = req.params.id as unknown as ObjectId;
        const companyId = (req as NewCustomerType).user.company_id;
        const deletedBy = (req as NewCustomerType).user._id;
        const result = await CustomerService.deleteCustomer(
            customerId,
            companyId,
            deletedBy,
        );
        res.status(200).json({
            message: 'Customer deleted successfully',
            result: result,
        });
    }),

    deleteMultipleCustomers: catchAsync(async (req: Request, res: Response) => {
        const { customerIds } = (req as AuthBodyAndCustomerId).body;
        const companyId = (req as AuthBodyAndCustomerId).user.company_id;
        const deletedBy = (req as AuthBodyAndCustomerId).user._id;
        const result = await CustomerService.deleteMultipleCustomers(
            customerIds,
            companyId,
            deletedBy,
        );
        res.status(200).json({
            message: 'Customers deleted successfully',
            result: result,
        });
    }),

    getCustomersByStatus: catchAsync(async (req: Request, res: Response) => {
        const isActive = req.query.is_active === 'true';
        const companyId = (req as NewCustomerType).user.company_id;
        const result = await CustomerService.getCustomersByStatus(isActive, companyId);
        res.status(200).json({
            message: `${isActive ? 'Active' : 'Inactive'} customers fetched successfully`,
            customers: result,
        });
    }),

    getCustomersWithDue: catchAsync(async (req: Request, res: Response) => {
        const companyId = (req as NewCustomerType).user.company_id;
        const result = await CustomerService.getCustomersWithDue(companyId);
        res.status(200).json({
            message: 'Customers with due amounts fetched successfully',
            customers: result,
        });
    }),

    updateCustomerStatus: catchAsync(async (req: Request, res: Response) => {
        const customerId = req.params.id as unknown as mongoose.Types.ObjectId;
        const { is_active } = req.body as { is_active: boolean };
        const companyId = (req as NewCustomerType).user.company_id;
        const result = await CustomerService.updateCustomerStatus(
            customerId,
            is_active,
            companyId,
        );
        res.status(200).json({
            message: `Customer ${is_active ? 'activated' : 'deactivated'} successfully`,
            customer: result,
        });
    }),

    getPendingCustomers: catchAsync(async (req: Request, res: Response) => {
        const companyId = (req as NewCustomerType).user.company_id;
        const result = await CustomerService.getPendingCustomers(companyId);
        res.status(200).json({
            message: 'Pending customers fetched successfully',
            customers: result,
        });
    }),

    approveCustomer: catchAsync(async (req: Request, res: Response) => {
        const customerId = req.params.id as unknown as mongoose.Types.ObjectId;
        const companyId = (req as NewCustomerType).user.company_id;
        const result = await CustomerService.approveCustomer(customerId, companyId);
        res.status(200).json({
            message: 'Customer approved successfully',
            customer: result,
        });
    }),

    rejectCustomer: catchAsync(async (req: Request, res: Response) => {
        const customerId = req.params.id as unknown as mongoose.Types.ObjectId;
        const companyId = (req as NewCustomerType).user.company_id;
        const deletedBy = (req as NewCustomerType).user._id;
        const result = await CustomerService.rejectCustomer(customerId, companyId, deletedBy);
        res.status(200).json({
            message: 'Customer rejected successfully',
            customer: result,
        });
    }),
};
