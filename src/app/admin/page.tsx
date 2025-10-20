
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { AuthGate } from '@/app/auth-gate';

const ADMIN_EMAIL = 'rafaproject06@gmail.com';

export default function AdminPage() {
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            if (isAdmin) {
                router.replace('/admin/dashboard');
            } else {
                router.replace('/'); 
            }
        }
    }, [user, router]);

    return (
        <AuthGate>
            <div className="flex items-center justify-center h-screen">
                <p>Redirecting...</p>
            </div>
        </AuthGate>
    );
}
