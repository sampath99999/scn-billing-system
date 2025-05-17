import { PackageService } from '#services/packages.service.js';
import { NewPackageData } from '#types/Package.js';
import { Request, Response } from 'express';

export const PackageController = {
    async createPackage(req: Request, res: Response) {
        const newPackageData: NewPackageData = {
            name: req.body.name,
            package_type: req.body.package_type,
            price_per_month: req.body.price_per_month,
        };
        try {
            const response = await PackageService.createPackage(newPackageData);
            res.status(200).json({
                message: 'Package created successfully!',
                data: response,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to create package',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    },
};
