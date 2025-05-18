import { JWT, TokenPayload } from '#utils/jwt.js';
import { Request, Response, NextFunction } from 'express';

export type RequestWithUser = Request & {
    user: TokenPayload;
};

export function AuthMiddleware(
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
) {
    let token = req.headers.authorization;
    if (!token) {
        return res
            .status(401)
            .json({ message: 'Authentication token is required' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    const result = JWT.validateToken(token);
    if (!result.valid) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    if (!result.decoded) {
        return res.status(401).json({ message: 'Token is missing payload' });
    }
    req.user = result.decoded;
    next();
}
