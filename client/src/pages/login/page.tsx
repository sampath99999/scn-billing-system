import LoginForm from '@/pages/login/components/login-form';
import { AuthService } from '@/services/auth.service';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Toaster } from 'sonner';

export default function LoginPage() {
    const navigate = useNavigate();
    useEffect(() => {
        if(AuthService().checkIfTokenExists()) {
            navigate('/dashboard');
        }
    }, [navigate]);
    return (
        <>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm onSubmit={AuthService().login} />
                </div>
            </div>
            <Toaster />
        </>
    );
}
