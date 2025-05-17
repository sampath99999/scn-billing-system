import { Package } from '#models/packages.model.js';
import { AuthInterface } from '#types/Auth.js';
import { NewPackageData } from '#types/Package.js';
import { AppError } from '#utils/appError.js';

export const PackageService = {
    async getAllPackages(companyId: string) {
        const packages = await Package.find({
            company_id: companyId,
        }).select('-__v -createdAt -updatedAt');
        return packages;
    },

    async createPackage(
        packageDetails: NewPackageData,
        userDetails: AuthInterface,
    ) {
        const existingPackage = await Package.findOne({
            name: packageDetails.name,
            company_id: userDetails.company_id,
        });
        if (existingPackage) {
            throw new AppError(
                'Package with this name already exists for this company',
                400,
            );
        }
        const newPackage = new Package({
            ...packageDetails,
            company_id: userDetails.company_id,
        });
        await newPackage.save();
        return newPackage;
    },

    async updatePackage(
        packageId: string,
        updatedPackageData: NewPackageData,
        companyId: string,
    ) {
        const updatedPackage = await Package.findOneAndUpdate(
            { _id: packageId, company_id: companyId },
            updatedPackageData,
            { new: true },
        );
        return updatedPackage;
    },
};
