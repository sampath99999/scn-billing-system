export type Package = {
	_id: string,
	name: string,
	package_type: string,
	price_per_month: number,
}

export type NewPackageData = {
	name: string,
	package_type: string,
	price_per_month: number,
};

export const PACKAGE_TYPES = {
	ADD_ON: 'add_on',
	PACKAGE: 'package',
};
export const PackageTypeLabels: Record<string, string> = {
	[PACKAGE_TYPES.ADD_ON]: 'Add-On',
	[PACKAGE_TYPES.PACKAGE]: 'Package',
};
