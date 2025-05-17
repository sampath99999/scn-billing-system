import { Document, model, Schema } from 'mongoose';

export interface CompanyInterface extends Document {
    name: string;
    address: string;
    phone_no: string;
    email?: string;
    owner_name: string;
    is_active: boolean;
}

const CompanySchema = new Schema<CompanyInterface>(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone_no: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        owner_name: {
            type: String,
            required: true,
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

export const Company = model<CompanyInterface>('companies', CompanySchema);
