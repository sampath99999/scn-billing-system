import { Router } from 'express';
import authRouter from './auth.routes.js';
import PackageRouter from './package.routes.js';
import CustomerRouter from './customer.routes.js';
import AccessoryRouter from './accessory.routes.js';

const router = Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

router.use('/auth', authRouter);
router.use('/packages', PackageRouter);
router.use('/customers', CustomerRouter);
router.use('/accessories', AccessoryRouter);

export default router;
