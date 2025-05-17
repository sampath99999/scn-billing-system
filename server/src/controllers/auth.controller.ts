import { AuthService } from '#services/auth.service.js';
import { Request, Response } from 'express';

export const AuthController = {
    async login(req: Request, res: Response) {
        const { username, password } = req.body as {
            username: string;
            password: string;
        };
        try {
            const response = await AuthService.login(username, password);
            res.status(200).json({
                message: 'LoggedIn Successfully!',
                data: response,
            });
        } catch (error) {
            res.status(401).json({
                message: 'Login failed',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    },
};
