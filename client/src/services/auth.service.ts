import { toast } from 'sonner';
import api from './api.service';
import type { User } from '@/types/User';

export function AuthService() {
    const checkIfTokenExists = () => {
        return localStorage.getItem('token');
    };
    const login = async ({
        username,
        password,
    }: {
        username: string;
        password: string;
    }) => {
        api.post('/auth/login', { username, password })
            .then((response) => {
                const token = response.data.data.token;
                localStorage.setItem('token', token);
                toast.success('Login successful!');
                window.location.href = '/dashboard';
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                        'Login failed. Please try again.'
                );
            });
    };

    const checkUser = async (callback: (user: User) => void) => {
        api.get('/auth/user')
            .then((response) => {
                const user: User = response.data.user;
                if (!user) {
                    toast.error('User not found. Please log in again.');
                    removeTokenAndRedirect();
                } else {
                    callback(user);
                }
            })
            .catch((error) => {
                toast.error(
                    error.response?.data?.message ||
                        'Failed to fetch user details. Please log in again.'
                );
                removeTokenAndRedirect();
            });
    };

    const removeTokenAndRedirect = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };
    return {
        login,
        checkUser,
        removeTokenAndRedirect,
        checkIfTokenExists,
    };
}
