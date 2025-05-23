import mongoose from "mongoose";

export interface NewCustomerData {
    first_name: string;
    last_name: string;
    care_of: string;
    phone: string;
    address: string;
    box_no: string;
    note: string;
    latitude?: number;
    longitude?: number;
    old_due?: number;
    is_active?: boolean;
}

export interface UpdateCustomerData {
    first_name?: string;
    last_name?: string;
    care_of?: string;
    phone?: string;
    address?: string;
    box_no?: string;
    note?: string;
    latitude?: number;
    longitude?: number;
    old_due?: number;
    is_active?: boolean;
}

export interface CustomerResponseData {
    _id: string | mongoose.Types.ObjectId;
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
    company_id: string | mongoose.Types.ObjectId;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const CUSTOMER_STATUS = {
    ACTIVE: true,
    INACTIVE: false,
};
