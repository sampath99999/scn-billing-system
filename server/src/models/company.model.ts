import { Document, model, Model, Schema } from 'mongoose';
import { boolean } from 'zod';

export interface CompanyInterface {
    name: string;
    address: string;
    phone_no: string;
    email?: string;
    owner_name: string;
    is_active: boolean;
}

export interface CompanyDocumentInterface extends CompanyInterface, Document {}
export interface CompanyModelInterface
    extends Model<CompanyDocumentInterface> {}

const CompanySchema: Schema<CompanyDocumentInterface> = new Schema(
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
            required: true
        },
    },
    {
        timestamps: true,
    },
);

export const Company: CompanyModelInterface = model<
    CompanyDocumentInterface,
    CompanyModelInterface
>('companies', CompanySchema);
