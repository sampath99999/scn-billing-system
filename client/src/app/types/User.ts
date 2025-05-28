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

export const UserTypes: { [key: number]: string } = {
	1: 'Admin',
	2: 'Employee'
};
