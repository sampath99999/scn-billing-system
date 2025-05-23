import mongoose, { Document, model, Schema } from 'mongoose';

export interface CustomerInterface extends Document {
    first_name: string;
    last_name: string;
    care_of: string;
    phone: string;
    address: string;
    box_no: string;
    note: string;
    latitude?: number;
    longitude?: number;
    old_due: number;
    company_id: mongoose.Types.ObjectId;
    is_active: boolean;
}

const CustomerSchema = new Schema<CustomerInterface>(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        care_of: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        box_no: {
            type: String,
            required: true,
        },
        note: {
            type: String,
            required: true,
        },
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
        old_due: {
            type: Number,
            default: 0,
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

export const Customer = model<CustomerInterface>('customers', CustomerSchema);
