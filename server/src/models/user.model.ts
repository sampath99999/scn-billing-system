import { UserTypes } from '#types/UserTypes.js';
import mongoose, { Document, Schema, model } from 'mongoose';

export interface UserInterface extends Document {
    name: string;
    username: string;
    password: string;
    phone_no: string;
    user_type: number;
    company_id: mongoose.Types.ObjectId;
    is_active: boolean;
}

const UserSchema = new Schema<UserInterface>(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        phone_no: {
            type: String,
            required: true,
        },
        user_type: {
            type: Number,
            default: UserTypes.EMPLOYEE,
            required: true,
        },
        company_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'companies',
        },
        is_active: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const User = model<UserInterface>('users', UserSchema);
