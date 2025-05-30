import { toast } from 'sonner';
import api from './api.service';

export function AuthService() {
    const login = async ({
        username,
        password,
    }: {
        username: string;
        password: string;
    }) => {
        api.post('/auth/login', { username, password })
            .then((response) => {
                const { token } = response.data;
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

    const checkUser = async () => {
        api.get('/auth/user')
            .then((response) => {
                const user = response.data;
                if (!user) {
                    toast.error('User not found. Please log in again.');
                    removeTokenAndRedirect();
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
    };
}
