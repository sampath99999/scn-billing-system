import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from './appError.js';
import { ObjectId } from 'mongoose';

const SECRET_KEY: string = process.env.JWT_SECRET ?? 'your_default_secret';
const DEFAULT_EXPIRES_IN: SignOptions['expiresIn'] = '1d';

export interface TokenPayload {
  _id: ObjectId;
  user_type: number,
  [key: string]: any;
}

export interface TokenValidationResult {
  valid: boolean;
  decoded?: TokenPayload;
  error?: string;
}

export class JWT {
  static generateToken(
    payload: TokenPayload,
    expiresIn: SignOptions['expiresIn'] = DEFAULT_EXPIRES_IN
  ): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  }

  static validateToken(token: string): TokenValidationResult {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;
      return { valid: true, decoded };
    } catch (error: any) {
      throw new AppError('Unauthroized!', 401);
    }
  }
}
