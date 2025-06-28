import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import CustomerService from '#services/customer.service.js';
import { Customer } from '#models/customer.model.js';
import { Company, CompanyInterface } from '#models/company.model.js';
import mongoose from 'mongoose';
import { NewCustomerData, UpdateCustomerData, CustomerFilterOptions, CustomerSortOptions } from '#types/Customer.js';
import { connectTestDB } from '#utils/database.js';
import { RequestWithUserAndBody } from '#utils/jwt.js';
import { FiltersAndSort } from '#types/Common.js';

describe('Customer Service Tests', () => {
    let company: CompanyInterface & { _id: mongoose.Types.ObjectId };
    let testCustomerData: NewCustomerData;
    let adminUserId: mongoose.Types.ObjectId;
    let employeeUserId: mongoose.Types.ObjectId;

    // Helper function to create properly typed mock requests
    const createMockRequest = (
        companyId: mongoose.Types.ObjectId,
        body: FiltersAndSort<CustomerFilterOptions, CustomerSortOptions>,
        userType = 1
    ): RequestWithUserAndBody<FiltersAndSort<CustomerFilterOptions, CustomerSortOptions>> => {
        return {
            user: {
                _id: userType === 2 ? adminUserId : employeeUserId,
                user_type: userType,
                company_id: companyId,
            },
            body,
        } as RequestWithUserAndBody<FiltersAndSort<CustomerFilterOptions, CustomerSortOptions>>;
    };

    beforeAll(async () => {
        await connectTestDB();

        // Create user IDs for testing
        adminUserId = new mongoose.Types.ObjectId();
        employeeUserId = new mongoose.Types.ObjectId();

        // Create a test company
        company = (await Company.create({
            name: 'Test Company',
            address: 'Test Address',
            phone_no: '1234567890',
            owner_name: 'Test Owner',
            is_active: true,
        })) as CompanyInterface & { _id: mongoose.Types.ObjectId };

        // Create test customer data
        testCustomerData = {
            first_name: 'John',
            last_name: 'Doe',
            care_of: 'S/O Robert Doe',
            phone: '9876543210',
            address: '123 Test Street, Test City',
            box_no: 'BOX001',
            note: 'Test customer note',
            latitude: 12.9716,
            longitude: 77.5946,
            old_due: 0,
            is_active: false, // Default for new customers
        };
    });

    afterAll(async () => {
        // Clean up test data
        await Customer.deleteMany({});
        await Company.deleteMany({});
        await mongoose.connection.close();
    });

    describe('Create Customer', () => {
        it('should successfully create a new customer', async () => {
            const newCustomer = await CustomerService.createCustomer(
                testCustomerData,
                company._id,
            );

            expect(newCustomer).toHaveProperty('_id');
            expect(newCustomer.first_name).toBe(testCustomerData.first_name);
            expect(newCustomer.last_name).toBe(testCustomerData.last_name);
            expect(newCustomer.care_of).toBe(testCustomerData.care_of);
            expect(newCustomer.phone).toBe(testCustomerData.phone);
            expect(newCustomer.address).toBe(testCustomerData.address);
            expect(newCustomer.box_no).toBe(testCustomerData.box_no);
            expect(newCustomer.note).toBe(testCustomerData.note);
            expect(newCustomer.latitude).toBe(testCustomerData.latitude);
            expect(newCustomer.longitude).toBe(testCustomerData.longitude);
            expect(newCustomer.old_due).toBe(testCustomerData.old_due);
            expect(newCustomer.is_active).toBe(false); // Should be false by default
            expect(newCustomer.company_id.toString()).toBe(company._id.toString());
        });

        it('should fail when creating a customer with a duplicate phone number in the same company', async () => {
            await expect(
                CustomerService.createCustomer(testCustomerData, company._id),
            ).rejects.toThrow(/already exists/);
        });

        it('should allow creating customers with same phone in different companies', async () => {
            // Create another company
            const anotherCompany = await Company.create({
                name: 'Another Company',
                address: 'Another Address',
                phone_no: '0987654321',
                owner_name: 'Another Owner',
                is_active: true,
            }) as CompanyInterface & { _id: mongoose.Types.ObjectId };

            const newCustomer = await CustomerService.createCustomer(
                testCustomerData,
                anotherCompany._id,
            );

            expect(newCustomer).toHaveProperty('_id');
            expect(newCustomer.phone).toBe(testCustomerData.phone);
            expect(newCustomer.company_id.toString()).toBe(anotherCompany._id.toString());

            // Clean up
            await Customer.findByIdAndDelete(newCustomer._id);
            await Company.findByIdAndDelete(anotherCompany._id);
        });

        it('should create customer with minimal required fields', async () => {
            const minimalCustomerData: NewCustomerData = {
                first_name: 'Jane',
                last_name: 'Smith',
                care_of: 'D/O John Smith',
                phone: '8765432109',
                address: '456 Test Avenue',
                box_no: 'BOX002',
                note: 'Minimal customer data',
                old_due: 100,
            };

            const newCustomer = await CustomerService.createCustomer(
                minimalCustomerData,
                company._id,
            );

            expect(newCustomer.first_name).toBe(minimalCustomerData.first_name);
            expect(newCustomer.old_due).toBe(minimalCustomerData.old_due);
            expect(newCustomer.latitude).toBeUndefined();
            expect(newCustomer.longitude).toBeUndefined();
        });
    });

    describe('Get All Customers', () => {
        it('should get all customers for a company with filters and pagination', async () => {
            const mockRequest = createMockRequest(company._id, {
                page: 1,
                pageSize: 10,
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result).toHaveProperty('customers');
            expect(result).toHaveProperty('pagination');
            expect(Array.isArray(result.customers)).toBe(true);
            expect(result.customers.length).toBeGreaterThan(0);
            expect(result.pagination.totalCount).toBeGreaterThan(0);
            expect(result.pagination.currentPage).toBe(1);
        });

        it('should filter customers by active status', async () => {
            // Create an active customer
            await CustomerService.createCustomer(
                {
                    first_name: 'Active',
                    last_name: 'Customer',
                    care_of: 'D/O John Active',
                    phone: '7654321098',
                    address: '456 Active Street',
                    box_no: 'BOX003',
                    note: 'Active customer',
                    is_active: true,
                },
                company._id,
            );

            const mockRequest = createMockRequest(company._id, {
                filters: { is_active: true },
                page: 1,
                pageSize: 10,
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result.customers.length).toBeGreaterThan(0);
            expect(result.customers.every(customer => customer.is_active)).toBe(true);
        });

        it('should filter customers by inactive status', async () => {
            const mockRequest = createMockRequest(company._id, {
                filters: { is_active: false },
                page: 1,
                pageSize: 10,
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result.customers.length).toBeGreaterThan(0);
            expect(result.customers.every(customer => !customer.is_active)).toBe(true);
        });

        it('should search customers by name', async () => {
            const mockRequest = createMockRequest(company._id, {
                searchTerm: 'John',
                page: 1,
                pageSize: 10,
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result.customers.length).toBeGreaterThan(0);
            expect(result.customers.some(customer =>
                customer.first_name.includes('John') || customer.last_name.includes('John')
            )).toBe(true);
        });

        it('should search customers by phone', async () => {
            const mockRequest = createMockRequest(company._id, {
                searchTerm: '9876543210',
                page: 1,
                pageSize: 10,
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result.customers.length).toBe(1);
            expect(result.customers[0].phone).toBe('9876543210');
        });

        it('should filter customers with due amounts', async () => {
            // Create a customer with due
            await CustomerService.createCustomer(
                {
                    first_name: 'Due',
                    last_name: 'Customer',
                    care_of: 'S/O Someone',
                    phone: '6543210987',
                    address: '789 Due Street',
                    box_no: 'BOX004',
                    note: 'Customer with due',
                    old_due: 500,
                    is_active: true,
                },
                company._id,
            );

            const mockRequest = createMockRequest(company._id, {
                filters: { has_due: true },
                page: 1,
                pageSize: 10,
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result.customers.length).toBeGreaterThan(0);
            expect(result.customers.every(customer => customer.old_due > 0)).toBe(true);
        });

        it('should return empty array for a company with no customers', async () => {
            // Create another company with no customers
            const anotherCompany = await Company.create({
                name: 'Empty Company',
                address: 'Empty Address',
                phone_no: '1111111111',
                owner_name: 'Empty Owner',
                is_active: true,
            }) as CompanyInterface & { _id: mongoose.Types.ObjectId };

            const mockRequest = createMockRequest(anotherCompany._id, {
                page: 1,
                pageSize: 10,
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(Array.isArray(result.customers)).toBe(true);
            expect(result.customers.length).toBe(0);
            expect(result.pagination.totalCount).toBe(0);

            // Clean up
            await Company.findByIdAndDelete(anotherCompany._id);
        });
    });

    describe('Get Customer By ID', () => {
        it('should successfully get a customer by ID', async () => {
            // Get an existing customer
            const mockRequest = createMockRequest(company._id, {
                page: 1,
                pageSize: 10
            });
            const result = await CustomerService.getAllCustomers(mockRequest);
            const customerId = result.customers[0]._id as mongoose.Types.ObjectId;

            const customer = await CustomerService.getCustomerById(customerId, company._id);
            expect(customer).not.toBeNull();
            expect(customer.first_name).toBeDefined();
            expect(customer.phone).toBeDefined();
            expect(customer.company_id.toString()).toBe(company._id.toString());
        });

        it('should throw error for non-existent customer', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();

            await expect(
                CustomerService.getCustomerById(nonExistentId, company._id)
            ).rejects.toThrow(/not found/);
        });
    });

    describe('Update Customer', () => {
        it('should successfully update a customer', async () => {
            // First, get the existing customer
            const mockRequest = createMockRequest(company._id, {
                page: 1,
                pageSize: 10
            });
            const result = await CustomerService.getAllCustomers(mockRequest);
            const customerId = result.customers[0]._id as mongoose.Types.ObjectId;

            const updatedData: UpdateCustomerData = {
                first_name: 'Updated John',
                last_name: 'Updated Doe',
                care_of: 'S/O Updated Robert',
                phone: '9999999999',
                address: 'Updated Address',
                old_due: 100,
            };

            const updatedCustomer = await CustomerService.updateCustomer(
                customerId,
                updatedData,
                company._id,
            );

            expect(updatedCustomer?.first_name).toBe(updatedData.first_name);
            expect(updatedCustomer?.last_name).toBe(updatedData.last_name);
            expect(updatedCustomer?.care_of).toBe(updatedData.care_of);
            expect(updatedCustomer?.phone).toBe(updatedData.phone);
            expect(updatedCustomer?.address).toBe(updatedData.address);
            expect(updatedCustomer?.old_due).toBe(updatedData.old_due);
        });

        it('should fail when updating to a phone that already exists', async () => {
            // Get two different customers
            const mockRequest = createMockRequest(company._id, {
                page: 1,
                pageSize: 10
            });
            const result = await CustomerService.getAllCustomers(mockRequest);

            if (result.customers.length < 2) {
                // Create another customer for testing conflict
                await CustomerService.createCustomer(
                    {
                        first_name: 'Another',
                        last_name: 'Customer',
                        care_of: 'S/O Someone',
                        phone: '5555555555',
                        address: 'Another Address',
                        box_no: 'BOX005',
                        note: 'Another customer',
                    },
                    company._id,
                );

                const updatedResult = await CustomerService.getAllCustomers(mockRequest);
                const customerId = updatedResult.customers[updatedResult.customers.length - 1]._id as mongoose.Types.ObjectId;

                await expect(
                    CustomerService.updateCustomer(
                        customerId,
                        {
                            phone: result.customers[0].phone, // Use existing phone
                        },
                        company._id,
                    )
                ).rejects.toThrow(/already exists/);
            }
        });

        it('should fail when customer does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();

            await expect(
                CustomerService.updateCustomer(
                    nonExistentId,
                    { first_name: 'Updated' },
                    company._id,
                )
            ).rejects.toThrow(/not found/);
        });
    });

    describe('Delete Customer', () => {
        it('should successfully soft delete a customer', async () => {
            // Create a customer to delete
            const customerToDelete = await CustomerService.createCustomer(
                {
                    first_name: 'Delete',
                    last_name: 'Me',
                    care_of: 'S/O Someone',
                    phone: '1111111111',
                    address: 'Delete Address',
                    box_no: 'DEL001',
                    note: 'To be deleted',
                },
                company._id,
            );

            const result = await CustomerService.deleteCustomer(
                customerToDelete._id as mongoose.Types.ObjectId,
                company._id,
                adminUserId
            );

            expect(result).toBe(true);

            // Verify customer is soft deleted but still exists in DB
            const deletedCustomer = await Customer.findById(customerToDelete._id);
            expect(deletedCustomer?.is_deleted).toBe(true);
            expect(deletedCustomer?.deleted_by).toEqual(adminUserId);
            expect(deletedCustomer?.deleted_at).toBeDefined();
        });

        it('should fail when customer does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();

            await expect(
                CustomerService.deleteCustomer(
                    nonExistentId,
                    company._id,
                    adminUserId
                )
            ).rejects.toThrow(/not found/);
        });
    });

    describe('Delete Multiple Customers', () => {
        it('should successfully delete multiple customers', async () => {
            // Create customers to delete
            const customer1 = await CustomerService.createCustomer(
                {
                    first_name: 'Multi1',
                    last_name: 'Delete',
                    care_of: 'S/O Someone',
                    phone: '2222222222',
                    address: 'Multi Delete Address 1',
                    box_no: 'MULTI001',
                    note: 'Multi delete 1',
                },
                company._id,
            );

            const customer2 = await CustomerService.createCustomer(
                {
                    first_name: 'Multi2',
                    last_name: 'Delete',
                    care_of: 'S/O Someone',
                    phone: '3333333333',
                    address: 'Multi Delete Address 2',
                    box_no: 'MULTI002',
                    note: 'Multi delete 2',
                },
                company._id,
            );

            const customerIds = [
                customer1._id as mongoose.Types.ObjectId,
                customer2._id as mongoose.Types.ObjectId
            ];

            const result = await CustomerService.deleteMultipleCustomers(
                customerIds,
                company._id,
                adminUserId
            );

            expect(result.modifiedCount).toBe(2);

            // Verify customers are soft deleted
            const deletedCustomers = await Customer.find({ _id: { $in: customerIds } });
            expect(deletedCustomers.every(customer => customer.is_deleted)).toBe(true);
        });

        it('should fail with empty array', async () => {
            await expect(
                CustomerService.deleteMultipleCustomers(
                    [],
                    company._id,
                    adminUserId
                )
            ).rejects.toThrow(/No customer IDs provided/);
        });
    });

    describe('Customer Status Management', () => {
        it('should get customers by active status', async () => {
            const activeCustomers = await CustomerService.getCustomersByStatus(
                true,
                company._id
            );
            expect(Array.isArray(activeCustomers)).toBe(true);

            if (activeCustomers.length > 0) {
                expect(activeCustomers.every(customer => customer.is_active)).toBe(true);
            }
        });

        it('should get customers by inactive status', async () => {
            const inactiveCustomers = await CustomerService.getCustomersByStatus(
                false,
                company._id
            );
            expect(Array.isArray(inactiveCustomers)).toBe(true);

            if (inactiveCustomers.length > 0) {
                expect(inactiveCustomers.every(customer => !customer.is_active)).toBe(true);
            }
        });

        it('should update customer status', async () => {
            // Get an inactive customer
            const inactiveCustomers = await CustomerService.getCustomersByStatus(
                false,
                company._id
            );

            if (inactiveCustomers.length > 0) {
                const customerId = inactiveCustomers[0]._id as mongoose.Types.ObjectId;

                const updatedCustomer = await CustomerService.updateCustomerStatus(
                    customerId,
                    true,
                    company._id
                );

                expect(updatedCustomer.is_active).toBe(true);
            }
        });
    });

    describe('Customers with Due', () => {
        it('should get customers with due amounts', async () => {
            const customersWithDue = await CustomerService.getCustomersWithDue(company._id);
            expect(Array.isArray(customersWithDue)).toBe(true);

            if (customersWithDue.length > 0) {
                expect(customersWithDue.every(customer => customer.old_due > 0)).toBe(true);
            }
        });
    });

    describe('Customer Approval Workflow', () => {
        it('should get pending customers', async () => {
            const pendingCustomers = await CustomerService.getPendingCustomers(company._id);
            expect(Array.isArray(pendingCustomers)).toBe(true);

            if (pendingCustomers.length > 0) {
                expect(pendingCustomers.every(customer => !customer.is_active)).toBe(true);
            }
        });

        it('should approve a customer', async () => {
            // Create a pending customer
            const pendingCustomer = await CustomerService.createCustomer(
                {
                    first_name: 'Pending',
                    last_name: 'Approval',
                    care_of: 'S/O Someone',
                    phone: '4444444444',
                    address: 'Pending Address',
                    box_no: 'PEND001',
                    note: 'Pending approval',
                    is_active: false,
                },
                company._id,
            );

            const approvedCustomer = await CustomerService.approveCustomer(
                pendingCustomer._id as mongoose.Types.ObjectId,
                company._id
            );

            expect(approvedCustomer.is_active).toBe(true);
        });

        it('should reject a customer', async () => {
            // Create a customer to reject
            const customerToReject = await CustomerService.createCustomer(
                {
                    first_name: 'Reject',
                    last_name: 'Me',
                    care_of: 'S/O Someone',
                    phone: '5555555555',
                    address: 'Reject Address',
                    box_no: 'REJ001',
                    note: 'To be rejected',
                    is_active: false,
                },
                company._id,
            );

            const rejectedCustomer = await CustomerService.rejectCustomer(
                customerToReject._id as mongoose.Types.ObjectId,
                company._id,
                adminUserId
            );

            expect(rejectedCustomer.is_deleted).toBe(true);
            expect(rejectedCustomer.deleted_by).toEqual(adminUserId);
        });

        it('should fail to approve non-existent customer', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();

            await expect(
                CustomerService.approveCustomer(nonExistentId, company._id)
            ).rejects.toThrow(/not found/);
        });

        it('should fail to reject non-existent customer', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();

            await expect(
                CustomerService.rejectCustomer(nonExistentId, company._id, adminUserId)
            ).rejects.toThrow(/not found/);
        });
    });

    describe('Sort Customers', () => {
        beforeAll(async () => {
            // Create customers with names that will sort alphabetically
            await CustomerService.createCustomer(
                {
                    first_name: 'Adam',
                    last_name: 'Anderson',
                    care_of: 'S/O Someone',
                    phone: '6666666666',
                    address: 'Adam Address',
                    box_no: 'SORT001',
                    note: 'Sort test customer',
                    is_active: true,
                },
                company._id,
            );

            await CustomerService.createCustomer(
                {
                    first_name: 'Zara',
                    last_name: 'Zimmerman',
                    care_of: 'D/O Someone',
                    phone: '7777777777',
                    address: 'Zara Address',
                    box_no: 'SORT002',
                    note: 'Sort test customer 2',
                    is_active: true,
                },
                company._id,
            );
        });

        it('should sort customers by first_name in ascending order', async () => {
            const mockRequest = createMockRequest(company._id, {
                page: 1,
                pageSize: 10,
                sortBy: 'first_name',
                sortOrder: 'asc'
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result.customers.length).toBeGreaterThan(2);

            // Check if sorting is working by comparing adjacent elements
            for (let i = 1; i < result.customers.length; i++) {
                expect(result.customers[i-1].first_name.localeCompare(result.customers[i].first_name)).toBeLessThanOrEqual(0);
            }
        });

        it('should sort customers by first_name in descending order', async () => {
            const mockRequest = createMockRequest(company._id, {
                page: 1,
                pageSize: 10,
                sortBy: 'first_name',
                sortOrder: 'desc'
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result.customers.length).toBeGreaterThan(2);

            // Check if sorting is working by comparing adjacent elements
            for (let i = 1; i < result.customers.length; i++) {
                expect(result.customers[i-1].first_name.localeCompare(result.customers[i].first_name)).toBeGreaterThanOrEqual(0);
            }
        });

        it('should sort customers by old_due in ascending order', async () => {
            const mockRequest = createMockRequest(company._id, {
                page: 1,
                pageSize: 10,
                sortBy: 'old_due',
                sortOrder: 'asc'
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result.customers.length).toBeGreaterThan(0);

            // Verify sorting (first customer should have lowest due)
            for (let i = 1; i < result.customers.length; i++) {
                expect(result.customers[i-1].old_due).toBeLessThanOrEqual(result.customers[i].old_due);
            }
        });

        it('should sort customers by createdAt in descending order', async () => {
            const mockRequest = createMockRequest(company._id, {
                page: 1,
                pageSize: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result.customers.length).toBeGreaterThan(0);

            // Verify sorting (newest customers first)
            for (let i = 1; i < result.customers.length; i++) {
                const prevDate = new Date(result.customers[i-1].createdAt ?? new Date());
                const currDate = new Date(result.customers[i].createdAt ?? new Date());
                expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
            }
        });
    });

    describe('Pagination Tests', () => {
        it('should handle pagination correctly', async () => {
            const mockRequest = createMockRequest(company._id, {
                page: 1,
                pageSize: 2,
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result.customers.length).toBeLessThanOrEqual(2);
            expect(result.pagination.currentPage).toBe(1);
            expect(result.pagination.pageSize).toBe(2);

            if (result.pagination.totalCount > 2) {
                expect(result.pagination.totalPages).toBeGreaterThan(1);
            }
        });

        it('should handle second page correctly', async () => {
            const mockRequest = createMockRequest(company._id, {
                page: 2,
                pageSize: 2,
            });

            const result = await CustomerService.getAllCustomers(mockRequest);
            expect(result.pagination.currentPage).toBe(2);

            if (result.pagination.totalCount <= 2) {
                expect(result.customers.length).toBe(0);
            }
        });
    });
});
