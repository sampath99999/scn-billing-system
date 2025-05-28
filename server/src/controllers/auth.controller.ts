import catchAsync from '#helpers/catchAsync.helper.js';
import AuthService from '#services/auth.service.js';
import { RequestWithUserAndBody } from '#utils/jwt.js';
import { Request, Response } from 'express';

export const AuthController = {
    login: catchAsync(async (req: Request, res: Response) => {
        const { username, password } = req.body as {
            username: string;
            password: string;
        };
        const response = await AuthService.login(username, password);
        res.status(200).json({
            message: 'LoggedIn Successfully!',
            data: response,
        });
    }),

    getUserDetails: catchAsync(async (req: Request, res: Response) => {
        const user = await AuthService.getUserDetails(
            (req as RequestWithUserAndBody<unknown>).user._id,
        );
        res.status(200).json({
            message: 'User details fetched successfully',
            user,
        });
    })
};
