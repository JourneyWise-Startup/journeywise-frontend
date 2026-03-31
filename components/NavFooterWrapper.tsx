"use client"
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AUTH_ROUTES = ['/login', '/register', '/signup'];

export default function NavFooterWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = AUTH_ROUTES.some(route => pathname?.startsWith(route));

    return (
        <>
            {!isAuthPage && <Navbar />}
            <main className={`${isAuthPage ? '' : 'min-h-screen bg-background text-foreground'}`}>
                {children}
            </main>
            {!isAuthPage && <Footer />}
        </>
    );
}
