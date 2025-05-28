export interface User {
	_id: string;
	name: string;
	username: string;
	password: string;
	phone_no: string;
	user_type: number;
	company_id: string;
	is_active: boolean;
}

export const ADMIN_USER_TYPE = 1;
export const EMPLOYEE_USER_TYPE = 2;

export const UserTypeLabels: Record<number, string> = {
	[ADMIN_USER_TYPE]: 'Admin',
	[EMPLOYEE_USER_TYPE]: 'Employee'
};
