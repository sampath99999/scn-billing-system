import { Document, model, Schema, Types } from 'mongoose';

export interface AccessoryInterface extends Document {
    name: string;
    cost: number;
    company_id: Types.ObjectId;
}

const AccessorySchema = new Schema<AccessoryInterface>(
    {
        name: {
            type: String,
            required: true,
        },
        cost: {
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

export const Accessory = model<AccessoryInterface>('accessories', AccessorySchema);
