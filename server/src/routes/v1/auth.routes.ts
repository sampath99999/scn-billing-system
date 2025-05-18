import { AuthController } from '#controllers/auth.controller.js';
import authSchema from '#schemas/auth.schema.js';
import validate from '#utils/validate.js';
import { Router } from 'express';

const authRouter = Router();

authRouter.post(
    '/login',
    validate(authSchema.loginSchema),
    AuthController.login,
);

export default authRouter;
