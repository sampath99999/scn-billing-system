import { Package } from '#models/packages.model.js';
import { NewPackageData } from '#types/Package.js';
import { AppError } from '#utils/appError.js';
import { ObjectId } from 'mongoose';

const PackageService = {
    createPackage: async (packageData: NewPackageData, companyId: ObjectId) => {
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

    checkPackageExists: async (name: string, companyId: ObjectId) => {
        const packageExists = await Package.exists({
            name,
            company_id: companyId,
        });
        if (packageExists) {
            throw new AppError(
                `Package / Add On with name ${name} already exists`,
                400,
            );
        }
    },

    getAllPackages: async (companyId: ObjectId) => {
        const packages = await Package.find({ company_id: companyId });
        return packages;
    },

    updatePackage: async (
        packageId: ObjectId,
        packageData: NewPackageData,
        companyId: ObjectId,
    ) => {
        const { name, package_type, price_per_month } = packageData;
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
