import { Document, Model, Schema, model } from "mongoose";

export interface IUser {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    email_verified: boolean;
    email_verification_token: string | null;
    email_verification_token_expires: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {}

const UserSchema: Schema<IUserDocument> = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    email_verified: {
        type: Boolean,
        default: false,
    },
    email_verification_token: {
        type: String,
        unique: true,
        default: null,
    },
    email_verification_token_expires: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true
});

export const User: IUserModel = model<IUserDocument, IUserModel>("User", UserSchema);

export type UserRegister = {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
};