import { UserTypes } from '#types/UserTypes.js';
import { Document, Model, ObjectId, Schema, model } from 'mongoose';

export interface UserInterface {
    name: string;
    username: string;
    password: string;
    phone_no: string;
    user_type: ObjectId;
    company_id: ObjectId;
    is_active: boolean
}

export interface UserDocumentInterface extends UserInterface, Document {}
export interface UserModelInterface extends Model<UserDocumentInterface> {}

const UserSchema: Schema<UserDocumentInterface> = new Schema(
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
        },
        phone_no: {
            type: String,
            required: true,
        },
        user_type: {
            type: Number,
            default: UserTypes.EMPLOYEE,
            required: true
        },
        company_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'companies',
        },
        is_active: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    {
        timestamps: true,
    },
);

export const User: UserModelInterface = model<
    UserDocumentInterface,
    UserModelInterface
>('users', UserSchema);
