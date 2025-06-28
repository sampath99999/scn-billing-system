import {
    AuthMiddleware,
    IsAdminMiddleware,
} from '#middlewares/auth.middleware.js';
import { CustomerController } from '#controllers/customer.controller.js';
import { createCustomerSchema, updateCustomerSchema, customerQuerySchema, updateCustomerStatusSchema } from '#schemas/customer.schema.js';
import validate from '#utils/validate.js';
import { Router } from 'express';

const CustomerRouter = Router();

// Create customer (Employees can create but need admin approval)
CustomerRouter.post(
    '/',
    AuthMiddleware,
    validate(createCustomerSchema),
    CustomerController.createCustomer,
);

// Get all customers with filtering, pagination, and search
CustomerRouter.get(
    '/all',
    AuthMiddleware,
    validate(customerQuerySchema),
    CustomerController.getAllCustomers
);

// Get pending customers for approval (Admin only)
CustomerRouter.get(
    '/pending-approval',
    AuthMiddleware,
    IsAdminMiddleware,
    CustomerController.getPendingCustomers,
);

// Get customers by status (approved/pending approval)
CustomerRouter.get(
    '/status/filter',
    AuthMiddleware,
    CustomerController.getCustomersByStatus,
);

// Get customers with due amounts
CustomerRouter.get(
    '/due/filter',
    AuthMiddleware,
    CustomerController.getCustomersWithDue,
);

// Bulk delete customers (Admin only)
CustomerRouter.post(
    '/bulk-delete',
    AuthMiddleware,
    IsAdminMiddleware,
    CustomerController.deleteMultipleCustomers,
);

// Get customer by ID
CustomerRouter.get(
    '/:id',
    AuthMiddleware,
    CustomerController.getCustomerById,
);

// Update customer (Admin only)
CustomerRouter.patch(
    '/:id',
    AuthMiddleware,
    IsAdminMiddleware,
    validate(updateCustomerSchema),
    CustomerController.updateCustomer,
);

// Delete customer (Admin only)
CustomerRouter.delete(
    '/:id',
    AuthMiddleware,
    IsAdminMiddleware,
    CustomerController.deleteCustomer,
);

// Approve customer (Admin only)
CustomerRouter.patch(
    '/:id/approve',
    AuthMiddleware,
    IsAdminMiddleware,
    CustomerController.approveCustomer,
);

// Reject customer (Admin only)
CustomerRouter.patch(
    '/:id/reject',
    AuthMiddleware,
    IsAdminMiddleware,
    CustomerController.rejectCustomer,
);

// Update customer status (Admin only) - for general active/inactive toggle
CustomerRouter.patch(
    '/:id/status',
    AuthMiddleware,
    IsAdminMiddleware,
    validate(updateCustomerStatusSchema),
    CustomerController.updateCustomerStatus,
);

export default CustomerRouter;
