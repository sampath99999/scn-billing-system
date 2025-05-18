export interface NewPackageData {
    name: string;
    package_type: string;
    price_per_month: number;
}

export const PACKAGE_TYPES = {
    ADD_ON: 'add_on',
    PACKAGE: 'package',
};
