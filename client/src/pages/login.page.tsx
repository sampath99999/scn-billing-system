import LoginForm from '@/components/login-form';
import { AuthService } from '@/services/auth.service';
import { Toaster } from 'sonner';

export default function LoginPage() {
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
