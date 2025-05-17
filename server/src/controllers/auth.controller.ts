import AuthService from '#services/auth.service.js';
import { Request, Response, NextFunction } from 'express';

export default class AuthController {
    static async login(req: Request, res: Response) {
        const { username, password } = req.body;
        const response = await AuthService.login(username, password);
        res.status(200).json({
            message: "LoggedIn Successfully!",
            data: response
        });
    }
}
