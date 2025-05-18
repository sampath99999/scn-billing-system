import catchAsync from '#helpers/catchAsync.helper.js';
import PackageService from '#services/packages.service.js';
import { NewPackageData } from '#types/Package.js';
import { RequestWithUserAndBody } from '#utils/jwt.js';
import { Request, Response } from 'express';

export const PackageController = {
    createPackage: catchAsync(async (req: Request, res: Response) => {
        const newPackageData = (req as RequestWithUserAndBody<NewPackageData>)
            .body;
        const result = await PackageService.createPackage(
            newPackageData,
            (req as RequestWithUserAndBody<NewPackageData>).user.company_id,
        );
        res.status(201).json({
            message: 'Package created successfully',
            package: result,
        });
    }),

    getAllPackages: catchAsync(async (req: Request, res: Response) => {
        const packages = await PackageService.getAllPackages(
            (req as RequestWithUserAndBody<NewPackageData>).user.company_id,
        );
        res.status(200).json({
            message: 'Packages fetched successfully',
            packages,
        });
    }),
};
