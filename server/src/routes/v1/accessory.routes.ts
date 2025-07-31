import {
    AuthMiddleware,
    IsAdminMiddleware,
} from '#middlewares/auth.middleware.js';
import { AccessoryController } from '#controllers/accessory.controller.js';
import { createAccessorySchema, accessoryQuerySchema } from '#schemas/accessory.schema.js';
import validate from '#utils/validate.js';
import { Router } from 'express';

const AccessoryRouter = Router();

AccessoryRouter.post(
    '/',
    AuthMiddleware,
    IsAdminMiddleware,
    validate(createAccessorySchema),
    AccessoryController.createAccessory,
);
AccessoryRouter.get(
    '/',
    AuthMiddleware,
    validate(accessoryQuerySchema),
    AccessoryController.getAllAccessories
);
AccessoryRouter.patch(
    '/:id',
    AuthMiddleware,
    IsAdminMiddleware,
    validate(createAccessorySchema),
    AccessoryController.updateAccessory,
);
AccessoryRouter.delete(
    '/:id',
    AuthMiddleware,
    IsAdminMiddleware,
    AccessoryController.deleteAccessory,
);
AccessoryRouter.post(
    '/bulk-delete',
    AuthMiddleware,
    IsAdminMiddleware,
    AccessoryController.deleteMultipleAccessories,
);

export default AccessoryRouter;
