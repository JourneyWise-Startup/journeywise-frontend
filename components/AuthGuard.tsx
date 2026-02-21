"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Wait for auth to load
        if (isLoading) return;

        const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

        if (!isAuthenticated && !isPublicRoute) {
            // Redirect to login if not authenticated and accessing protected route
            router.push('/login');
            return;
        }

        if (isAuthenticated && pathname === '/login') {
            // Redirect to dashboard if already logged in and at login page
            router.push('/dashboard');
            return;
        }

        // Allow rendering
        setShouldRender(true);
    }, [isAuthenticated, isLoading, pathname, router]);

    // Show loading spinner while auth is being verified
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                    <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render if we're redirecting
    if (!shouldRender) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                    <p className="text-sm text-muted-foreground animate-pulse">Redirecting...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

