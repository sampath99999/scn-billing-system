import { Router } from 'express';
import authRouter from './auth.routes.js';
import PackageRouter from './package.routes.js';

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

export default router;
