import { Package } from '#models/packages.model.js';
import { NewPackageData } from '#types/Package.js';
import { ObjectId } from 'mongoose';

const PackageService = {
    createPackage: async (packageData: NewPackageData, companyId: ObjectId) => {
        const { name, package_type, price_per_month } = packageData;
        const newPackage = await Package.create({
            name,
            package_type,
            price_per_month,
            company: companyId,
        });

        return newPackage;
    },

    getAllPackages: async (companyId: ObjectId) => {
        const packages = await Package.find({ company: companyId });
        return packages;
    }
};

export default PackageService;
