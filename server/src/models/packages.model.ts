import { PACKAGE_TYPES } from '#types/Package.js';
import { Document, model, Schema, Types } from 'mongoose';

export interface PackageInterface extends Document {
    name: string;
    package_type: string;
    price_per_month: number;
    company_id: Types.ObjectId;
}
const PackageSchema = new Schema<PackageInterface>(
    {
        name: {
            type: String,
            required: true,
        },
        package_type: {
            type: String,
            enum: Object.values(PACKAGE_TYPES),
            default: PACKAGE_TYPES.PACKAGE,
            required: true,
        },
        price_per_month: {
            type: Number,
            required: true,
        },
        company_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'companies',
        },
    },
    {
        timestamps: true,
    },
);

export const Package = model<PackageInterface>('packages', PackageSchema);
