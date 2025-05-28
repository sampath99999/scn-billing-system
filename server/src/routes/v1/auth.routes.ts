import { AuthController } from '#controllers/auth.controller.js';
import { AuthMiddleware } from '#middlewares/auth.middleware.js';
import authSchema from '#schemas/auth.schema.js';
import validate from '#utils/validate.js';
import { Router } from 'express';

const authRouter = Router();

authRouter.post(
    '/login',
    validate(authSchema.loginSchema),
    AuthController.login,
);
authRouter.get('/user', AuthMiddleware, AuthController.getUserDetails);

export default authRouter;
