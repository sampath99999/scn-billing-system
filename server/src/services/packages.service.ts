import { Package } from '#models/packages.model.js';
import { FiltersAndSort } from '#types/Common.js';
import { NewPackageData, PackageFilterOptions, PackageSortOptions } from '#types/Package.js';
import { AppError } from '#utils/appError.js';
import { RequestWithUserAndBody } from '#utils/jwt.js';
import mongoose from 'mongoose';

const PackageService = {
    createPackage: async (packageData: NewPackageData, companyId: mongoose.Types.ObjectId) => {
        const { name, package_type, price_per_month } = packageData;
        await PackageService.checkPackageExists(name, companyId);
        const newPackage = await Package.create({
            name,
            package_type,
            price_per_month,
            company_id: companyId,
        });

        return newPackage;
    },

    checkPackageExists: async (name: string, companyId: mongoose.Types.ObjectId, exceptId: mongoose.Types.ObjectId | null = null) => {
        const packageExists = await Package.exists({
            name,
            company_id: companyId,
            _id: { $ne: exceptId },
        });
        if (packageExists) {
            throw new AppError(
                `Package / Add On with name ${name} already exists`,
                400,
            );
        }
    },

    getAllPackages: async (data: RequestWithUserAndBody<FiltersAndSort<PackageFilterOptions, PackageSortOptions>>) => {
        const searchTerm = data.body.searchTerm;
        const filters = data.body.filters;
        const page = data.body.page ?? 1;
        const pageSize = data.body.pageSize ?? 10;
        const sortBy = data.body.sortBy ?? 'name';
        const sortOrder = data.body.sortOrder ?? 'asc';

        const query: Record<string, unknown> = { company_id: data.user.company_id };

        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                ...(isNaN(Number(searchTerm)) ? [] : [{ price_per_month: Number(searchTerm) }])
            ];
        }

        if (filters) {
            // Handle filters as key-value pairs
            if (filters.package_type) {
                query.package_type = filters.package_type;
            }
        }

        // Get total count for pagination
        const totalCount = await Package.countDocuments(query);

        const packages = await Package.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            packages,
            pagination: {
                currentPage: page,
                pageSize,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            },
        };
    },

    updatePackage: async (
        packageId: mongoose.Types.ObjectId,
        packageData: NewPackageData,
        companyId: mongoose.Types.ObjectId,
    ) => {
        const { name, package_type, price_per_month } = packageData;

        // First check if package exists
        const packageExists = await Package.exists({
            _id: packageId,
            company_id: companyId,
        });
        if (!packageExists) {
            throw new AppError('Package not found', 404);
        }

        // Then check for name conflicts
        await PackageService.checkPackageExists(name, companyId, packageId);

        const updatedPackage = await Package.findByIdAndUpdate(
            packageId,
            {
                name,
                package_type,
                price_per_month,
            },
            { new: true },
        );
        return updatedPackage;
    }
};

export default PackageService;
