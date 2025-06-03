export type Package = {
    _id: string;
    name: string;
    package_type: string;
    price_per_month: number;
    createdAt: string;
    updatedAt: string;
}

export const PACKAGE_TYPES = {
    ADD_ON: 'add_on',
    PACKAGE: 'package',
};
