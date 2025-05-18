import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async Express route handler to automatically catch and forward errors to the next middleware
 * @param fn The async route handler function
 * @returns A wrapped function that catches any errors and passes them to next()
 */
const catchAsync = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;
