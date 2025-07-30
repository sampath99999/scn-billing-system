import { AccessoryFilterOptions, AccessorySortOptions } from '#types/Accessory.js';
import catchAsync from '#helpers/catchAsync.helper.js';
import AccessoryService from '#services/accessory.service.js';
import { FiltersAndSort } from '#types/Common.js';
import { NewAccessoryData } from '#types/Accessory.js';
import { RequestWithUserAndBody } from '#utils/jwt.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const AccessoryController = {
    createAccessory: catchAsync(async (req: Request, res: Response) => {
        const newAccessoryData = (req as RequestWithUserAndBody<NewAccessoryData>)
            .body;
        const result = await AccessoryService.createAccessory(
            newAccessoryData,
            (req as RequestWithUserAndBody<NewAccessoryData>).user.company_id,
        );
        res.status(201).json({
            message: 'Accessory created successfully',
            accessory: result,
        });
    }),

    getAllAccessories: catchAsync(async (req: Request, res: Response) => {
        // Extract query parameters and convert to proper types
        const filters: AccessoryFilterOptions = {};

        const queryData: FiltersAndSort<AccessoryFilterOptions, AccessorySortOptions> = {
            searchTerm: req.query.searchTerm as string,
            filters,
            page: req.query.page ? Number(req.query.page) : undefined,
            pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
            sortBy: req.query.sortBy as AccessorySortOptions,
            sortOrder: req.query.sortOrder as 'asc' | 'desc',
        };

        // Create request object with user and query data
        const requestWithData = {
            ...req,
            body: queryData,
        } as RequestWithUserAndBody<FiltersAndSort<AccessoryFilterOptions, AccessorySortOptions>>;

        const result = await AccessoryService.getAllAccessories(requestWithData);
        res.status(200).json({
            message: 'Accessories fetched successfully',
            data: result.accessories,
            pagination: result.pagination,
        });
    }),

    updateAccessory: catchAsync(async (req: Request, res: Response) => {
        const accessoryId = (req.params.id as unknown) as mongoose.Types.ObjectId;
        const newAccessoryData = (req as RequestWithUserAndBody<NewAccessoryData>)
            .body;
        const result = await AccessoryService.updateAccessory(
            accessoryId,
            newAccessoryData,
            (req as RequestWithUserAndBody<NewAccessoryData>).user.company_id,
        );
        res.status(200).json({
            message: 'Accessory updated successfully',
            accessory: result,
        });
    }),
};
