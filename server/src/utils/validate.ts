import { Schema, ZodError } from 'zod';
import { AppError } from './appError.js';
import { Request, Response, NextFunction } from 'express';

export default function validate(schema: Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body);
            await schema.parseAsync({
                ...req.body,
                ...req.query,
                ...req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const message =
                    error.errors[0]?.message || 'Invalid request data';
                next(new AppError(message, 400));
                return;
            }
            next(error);
        }
    };
}
