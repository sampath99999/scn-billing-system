export type User = {
    _id: string;
    name: string;
    username: string;
    company_id: string;
    user_type: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const UserTypeLabels: Record<string, string> = {
    1: 'Admin',
    2: 'Employee',
};
