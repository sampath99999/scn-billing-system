import mongoose from "mongoose";
import { RequestWithUserAndBody } from "#utils/jwt.js";

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

export interface CustomerFilterOptions {
    is_active?: boolean;
    has_due?: boolean;
}

export type CustomerSortOptions =
    | 'first_name'
    | 'last_name'
    | 'phone'
    | 'address'
    | 'box_no'
    | 'old_due'
    | 'createdAt'
    | 'updatedAt';

export const CUSTOMER_STATUS = {
    ACTIVE: true,
    INACTIVE: false,
};

export type NewCustomerType = RequestWithUserAndBody<NewCustomerData>;
export type UpdateCustomerType = RequestWithUserAndBody<UpdateCustomerData>;
export type AuthBodyAndCustomerId = RequestWithUserAndBody<{ customerIds: mongoose.Types.ObjectId[] }>;
