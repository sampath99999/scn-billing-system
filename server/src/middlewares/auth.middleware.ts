// filepath: /home/sampath/Documents/sampath/cable-billing/server/src/middlewares/auth.middleware.ts
import { UserTypes } from '#types/UserTypes.js';
import { JWT, TokenPayload } from '#utils/jwt.js';
import { Request, Response, NextFunction } from 'express';

export type RequestWithUser = Request & {
    user: TokenPayload;
};

export const AuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    let token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: 'Authentication token is required' });
        return;
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    const result = JWT.validateToken(token);
    if (!result.valid) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
    if (!result.decoded) {
        res.status(401).json({ message: 'Token is missing payload' });
        return;
    }

    (req as RequestWithUser).user = result.decoded;
    next();
};

export const IsAdminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    if ((req as RequestWithUser).user.user_type !== UserTypes.ADMIN) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    next();
};
