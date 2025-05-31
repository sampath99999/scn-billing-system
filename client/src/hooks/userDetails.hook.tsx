import { useEffect, useRef, useState } from 'react';
import { AuthService } from '@/services/auth.service';
import type { User } from '@/types/User';

export function useUserDetails() {
    const userFetching = useRef(false);
    const [userDetails, setUserDetails] = useState<User | null>(null);

    useEffect(() => {
        if (userFetching.current) return;
        userFetching.current = true;

        AuthService().checkUser((user) => {
            setUserDetails(user);
        });
    }, []);

    return userDetails;
}
