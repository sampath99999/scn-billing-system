import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import PackageService from '#services/packages.service.js';
import { Package } from '#models/packages.model.js';
import { Company, CompanyInterface } from '#models/company.model.js';
import mongoose from 'mongoose';
import { PACKAGE_TYPES, PackageFilterOptions, PackageSortOptions } from '#types/Package.js';
import { connectTestDB } from '#utils/database.js';
import { RequestWithUserAndBody } from '#utils/jwt.js';
import { FiltersAndSort } from '#types/Common.js';

describe('Package Service Tests', () => {
    let company: CompanyInterface & { _id: mongoose.Types.ObjectId };
    let testPackageData: {
        name: string;
        package_type: string;
        price_per_month: number;
    };

    // Helper function to create properly typed mock requests
    const createMockRequest = (
        companyId: mongoose.Types.ObjectId,
        body: FiltersAndSort<PackageFilterOptions, PackageSortOptions>
    ): RequestWithUserAndBody<FiltersAndSort<PackageFilterOptions, PackageSortOptions>> => {
        return {
            user: {
                _id: new mongoose.Types.ObjectId(),
                user_type: 1,
                company_id: companyId,
            },
            body,
        } as RequestWithUserAndBody<FiltersAndSort<PackageFilterOptions, PackageSortOptions>>;
    };

    beforeAll(async () => {
        await connectTestDB();
        // Create a test company
        company = (await Company.create({
            name: 'Test Company',
            address: 'Test Address',
            phone_no: '1234567890',
            owner_name: 'Test Owner',
            is_active: true,
        })) as CompanyInterface & { _id: mongoose.Types.ObjectId };

        // Create test package data
        testPackageData = {
            name: 'Test Package',
            package_type: PACKAGE_TYPES.PACKAGE,
            price_per_month: 999,
        };
    });

    afterAll(async () => {
        // Clean up test data
        await Package.deleteMany({});
        await Company.deleteMany({});
        await mongoose.connection.close();
    });

    describe('Create Package', () => {
        it('should successfully create a new package', async () => {
            const newPackage = await PackageService.createPackage(
                testPackageData,
                company._id,
            );
            expect(newPackage).toHaveProperty('_id');
            expect(newPackage.name).toBe(testPackageData.name);
            expect(newPackage.package_type).toBe(testPackageData.package_type);
            expect(newPackage.price_per_month).toBe(testPackageData.price_per_month);
            expect(newPackage.company_id.toString()).toBe(company._id.toString());
        });

        it('should fail when creating a package with a duplicate name in the same company', async () => {
            await expect(
                PackageService.createPackage(testPackageData, company._id),
            ).rejects.toThrow(/already exists/);
        });
    });

    describe('Get All Packages', () => {
        it('should get all packages for a company with filters and pagination', async () => {
            const mockRequest = createMockRequest(company._id, {
                page: 1,
                pageSize: 10,
            });

            const result = await PackageService.getAllPackages(mockRequest);
            expect(result).toHaveProperty('packages');
            expect(result).toHaveProperty('pagination');
            expect(Array.isArray(result.packages)).toBe(true);
            expect(result.packages.length).toBe(1);
            expect(result.packages[0].name).toBe(testPackageData.name);
            expect(result.pagination.totalCount).toBe(1);
            expect(result.pagination.currentPage).toBe(1);
        });

        it('should filter packages by package_type', async () => {
            // Create an add-on package
            await PackageService.createPackage(
                {
                    name: 'Test Add-on',
                    package_type: PACKAGE_TYPES.ADD_ON,
                    price_per_month: 199,
                },
                company._id,
            );

            const mockRequest = createMockRequest(company._id, {
                filters: { package_type: PACKAGE_TYPES.ADD_ON },
                page: 1,
                pageSize: 10,
            });

            const result = await PackageService.getAllPackages(mockRequest);
            expect(result.packages.length).toBe(1);
            expect(result.packages[0].package_type).toBe(PACKAGE_TYPES.ADD_ON);
        });

        it('should search packages by name', async () => {
            const mockRequest = createMockRequest(company._id, {
                searchTerm: 'Test',
                page: 1,
                pageSize: 10,
            });

            const result = await PackageService.getAllPackages(mockRequest);
            expect(result.packages.length).toBeGreaterThan(0);
            expect(result.packages.some(pkg => pkg.name.includes('Test'))).toBe(true);
        });

        it('should return empty array for a company with no packages', async () => {
            // Create another company with no packages
            const anotherCompany = await Company.create({
                name: 'Another Company',
                address: 'Another Address',
                phone_no: '0987654321',
                owner_name: 'Another Owner',
                is_active: true,
            }) as CompanyInterface & { _id: mongoose.Types.ObjectId };

            const mockRequest = createMockRequest(anotherCompany._id, {
                page: 1,
                pageSize: 10,
            });

            const result = await PackageService.getAllPackages(mockRequest);
            expect(Array.isArray(result.packages)).toBe(true);
            expect(result.packages.length).toBe(0);
            expect(result.pagination.totalCount).toBe(0);

            // Clean up
            await Company.findByIdAndDelete(anotherCompany._id);
        });
    });

    describe('Update Package', () => {
        it('should successfully update a package', async () => {
            // First, get the existing package
            const mockRequest = createMockRequest(company._id, {
                page: 1,
                pageSize: 10
            });
            const result = await PackageService.getAllPackages(mockRequest);
            const packageId = result.packages[0]._id as mongoose.Types.ObjectId;

            const updatedData = {
                name: 'Updated Package Name',
                package_type: PACKAGE_TYPES.ADD_ON,
                price_per_month: 1499,
            };

            const updatedPackage = await PackageService.updatePackage(
                packageId,
                updatedData,
                company._id,
            );

            expect(updatedPackage?.name).toBe(updatedData.name);
            expect(updatedPackage?.package_type).toBe(updatedData.package_type);
            expect(updatedPackage?.price_per_month).toBe(updatedData.price_per_month);
        });

        it('should fail when updating to a name that already exists', async () => {
            // Create another package
            const anotherPackage = await PackageService.createPackage(
                {
                    name: 'Another Package',
                    package_type: PACKAGE_TYPES.PACKAGE,
                    price_per_month: 799,
                },
                company._id,
            );
            await expect(
                PackageService.updatePackage(
                    anotherPackage._id as mongoose.Types.ObjectId,
                    {
                        name: 'Updated Package Name',
                        package_type: PACKAGE_TYPES.PACKAGE,
                        price_per_month: 799,
                    },
                    company._id,
                )
            ).rejects.toThrow(/already exists/);
        });

        it('should fail when package does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();

            await expect(
                PackageService.updatePackage(
                    nonExistentId,
                    testPackageData,
                    company._id,
                )
            ).rejects.toThrow(/not found/);
        });
    });
});
