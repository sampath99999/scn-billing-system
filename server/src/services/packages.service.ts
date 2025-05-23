import { Package } from '#models/packages.model.js';
import { NewPackageData } from '#types/Package.js';
import { AppError } from '#utils/appError.js';
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

    getAllPackages: async (companyId: mongoose.Types.ObjectId) => {
        const packages = await Package.find({ company_id: companyId });
        return packages;
    },

    updatePackage: async (
        packageId: mongoose.Types.ObjectId,
        packageData: NewPackageData,
        companyId: mongoose.Types.ObjectId,
    ) => {
        const { name, package_type, price_per_month } = packageData;
        await PackageService.checkPackageExists(name, companyId, packageId);
        const packageExists = await Package.exists({
            _id: packageId,
            company_id: companyId,
        });
        if (!packageExists) {
            throw new AppError('Package not found', 404);
        }
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
