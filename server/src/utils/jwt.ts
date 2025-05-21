import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from './appError.js';
import mongoose from 'mongoose';
import { Request } from 'express';

const SECRET_KEY: string = process.env.JWT_SECRET ?? 'your_default_secret';
const DEFAULT_EXPIRES_IN: SignOptions['expiresIn'] = '1d';

export interface TokenPayload {
    _id: mongoose.Types.ObjectId;
    user_type: number;
    company_id: mongoose.Types.ObjectId;
    [key: string]: unknown;
}

export interface TokenValidationResult {
    valid: boolean;
    decoded?: TokenPayload;
    error?: string;
}
export interface RequestWithUserAndBody<T> extends Omit<Request, 'body'> {
    user: TokenPayload;
    body: T;
}

export const JWT = {
    generateToken(
        payload: TokenPayload,
        expiresIn: SignOptions['expiresIn'] = DEFAULT_EXPIRES_IN,
    ): string {
        return jwt.sign(payload, SECRET_KEY, { expiresIn });
    },

    validateToken(token: string): TokenValidationResult {
        try {
            const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;
            return { valid: true, decoded };
        } catch (error: unknown) {
            console.log('JWT Error:', error);
            throw new AppError('Unauthorized!', 401);
        }
    },
};
