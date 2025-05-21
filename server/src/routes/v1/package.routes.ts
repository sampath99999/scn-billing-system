import {
    AuthMiddleware,
    IsAdminMiddleware,
} from '#middlewares/auth.middleware.js';
import { PackageController } from '#controllers/package.controller.js';
import { createPackageSchema } from '#schemas/package.schema.js';
import validate from '#utils/validate.js';
import { Router } from 'express';

const PackageRouter = Router();

PackageRouter.post(
    '/',
    AuthMiddleware,
    IsAdminMiddleware,
    validate(createPackageSchema),
    PackageController.createPackage,
);
PackageRouter.get('/', AuthMiddleware, PackageController.getAllPackages);
PackageRouter.patch(
    '/:id',
    AuthMiddleware,
    IsAdminMiddleware,
    validate(createPackageSchema),
    PackageController.updatePackage,
);

export default PackageRouter;
