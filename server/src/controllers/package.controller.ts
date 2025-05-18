import PackageService from '#services/packages.service.js';
import { NewPackageData } from '#types/Package.js';
import { TokenPayload } from '#utils/jwt.js';
import { Request, Response } from 'express';

export interface RequestWithUserAndBody extends Request {
    user: TokenPayload;
    body: NewPackageData;
}

export const PackageController = {
    async createPackage(req: RequestWithUserAndBody, res: Response) {
        const newPackageData = req.body;
        const result = await PackageService.createPackage(
            newPackageData,
            req.user.company_id,
        );
        res.status(201).json({
            message: 'Package created successfully',
            package: result,
        });
    },
};
