import { CustomError } from '#types/CustomError.js';

export class AppError extends Error implements CustomError {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
