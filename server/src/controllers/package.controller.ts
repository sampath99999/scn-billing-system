import { AuthBodyAndPackageId, NewPackageType, PackageFilterOptions, PackageSortOptions } from '#types/Package.js';
import catchAsync from '#helpers/catchAsync.helper.js';
import PackageService from '#services/packages.service.js';
import { FiltersAndSort, ObjectId } from '#types/Common.js';
import { RequestWithUserAndBody } from '#utils/jwt.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const PackageController = {
    createPackage: catchAsync(async (req: Request, res: Response) => {
        const newPackageData = (req as NewPackageType)
            .body;
        newPackageData.company_id = (req as NewPackageType).user.company_id;
        const result = await PackageService.createPackage(
            newPackageData,
        );
        res.status(201).json({
            message: 'Package created successfully',
            package: result,
        });
    }),

    getAllPackages: catchAsync(async (req: Request, res: Response) => {
        const filters: PackageFilterOptions = {};

        if (req.query.package_type) {
            filters.package_type = req.query.package_type as string;
        }

        const queryData: FiltersAndSort<PackageFilterOptions, PackageSortOptions> = {
            searchTerm: req.query.searchTerm as string,
            filters,
            page: req.query.page ? Number(req.query.page) : undefined,
            pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
            sortBy: req.query.sortBy as PackageSortOptions,
            sortOrder: req.query.sortOrder as 'asc' | 'desc',
        };

        const requestWithData = {
            ...req,
            body: queryData,
        } as RequestWithUserAndBody<FiltersAndSort<PackageFilterOptions, PackageSortOptions>>;

        const result = await PackageService.getAllPackages(requestWithData);
        res.status(200).json({
            message: 'Packages fetched successfully',
            data: result.packages,
            pagination: result.pagination,
        });
    }),

    updatePackage: catchAsync(async (req: Request, res: Response) => {
        const packageId = (req.params.id as unknown) as mongoose.Types.ObjectId;
        const newPackageData = (req as NewPackageType)
            .body;
        const result = await PackageService.updatePackage(
            packageId,
            newPackageData,
            (req as NewPackageType).user.company_id,
        );
        res.status(200).json({
            message: 'Package updated successfully',
            package: result,
        });
    }),

    deletePackage: catchAsync(async (req: Request, res: Response) => {
        const packageId = (req.params.id as unknown) as ObjectId;
        const result = await PackageService.deletePackage(
            packageId,
            (req as NewPackageType).user.company_id,
        );
        res.status(200).json({
            message: 'Package deleted successfully',
            package: result,
        });
    }),

    deleteMultiplePackages: catchAsync(async (req: Request, res: Response) => {
        const { packageIds } = (req as AuthBodyAndPackageId).body;
        const result = await PackageService.deleteMultiplePackages(
            packageIds,
            (req as AuthBodyAndPackageId).user.company_id,
        );
        res.status(200).json({
            message: 'Packages deleted successfully',
            packages: result,
        });
    }),
};
