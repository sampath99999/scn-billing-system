import { Accessory } from '#models/accessory.model.js';
import { FiltersAndSort } from '#types/Common.js';
import { NewAccessoryData, AccessoryFilterOptions, AccessorySortOptions } from '#types/Accessory.js';
import { AppError } from '#utils/appError.js';
import { RequestWithUserAndBody } from '#utils/jwt.js';
import mongoose from 'mongoose';

const AccessoryService = {
    createAccessory: async (accessoryData: NewAccessoryData, companyId: mongoose.Types.ObjectId) => {
        const { name, cost } = accessoryData;
        await AccessoryService.checkAccessoryExists(name, companyId);
        const newAccessory = await Accessory.create({
            name,
            cost,
            company_id: companyId,
        });

        return newAccessory;
    },

    checkAccessoryExists: async (name: string, companyId: mongoose.Types.ObjectId, exceptId: mongoose.Types.ObjectId | null = null) => {
        const accessoryExists = await Accessory.exists({
            name,
            company_id: companyId,
            _id: { $ne: exceptId },
        });
        if (accessoryExists) {
            throw new AppError(
                `Accessory with name ${name} already exists`,
                400,
            );
        }
    },

    getAllAccessories: async (data: RequestWithUserAndBody<FiltersAndSort<AccessoryFilterOptions, AccessorySortOptions>>) => {
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
                ...(isNaN(Number(searchTerm)) ? [] : [{ cost: Number(searchTerm) }])
            ];
        }

        if (filters) {
            // Handle filters as key-value pairs if needed
        }

        // Get total count for pagination
        const totalCount = await Accessory.countDocuments(query);

        const accessories = await Accessory.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        return {
            accessories,
            pagination: {
                currentPage: page,
                pageSize,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            },
        };
    },

    updateAccessory: async (
        accessoryId: mongoose.Types.ObjectId,
        accessoryData: NewAccessoryData,
        companyId: mongoose.Types.ObjectId,
    ) => {
        const { name, cost } = accessoryData;

        // First check if accessory exists
        const accessoryExists = await Accessory.exists({
            _id: accessoryId,
            company_id: companyId,
        });
        if (!accessoryExists) {
            throw new AppError('Accessory not found', 404);
        }

        // Then check for name conflicts
        await AccessoryService.checkAccessoryExists(name, companyId, accessoryId);

        const updatedAccessory = await Accessory.findByIdAndUpdate(
            accessoryId,
            {
                name,
                cost,
            },
            { new: true },
        );
        return updatedAccessory;
    }
};

export default AccessoryService;
