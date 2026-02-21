"use client"
import { Toaster } from 'sonner'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, user, logout, updateUser, token } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch latest profile to get avatar
    useEffect(() => {
        if (isAuthenticated && user?.id && token) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    // If we have an avatar and it's different from context, update context
                    if (data && data.avatar && data.avatar !== user.avatar) {
                        updateUser({ ...user, avatar: data.avatar });
                    }
                })
                .catch(err => console.error("Failed to fetch profile for navbar", err));
        }
    }, [isAuthenticated, user?.id, token]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (isAuthPage) return <><Toaster position="top-center" richColors /></>;

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            <Toaster position="top-center" richColors expand={false} />
            <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="container flex h-14 md:h-16 items-center max-w-7xl mx-auto px-3 sm:px-4">
                    {/* Logo */}
                    <div className="mr-3 md:mr-4 flex flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-1.5 md:space-x-2 hover:opacity-90 transition-all duration-200 group">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0 group-hover:shadow-cyan-500/50 group-hover:scale-105 transition-all duration-300">
                                <span className="text-white font-bold text-sm md:text-lg">JW</span>
                            </div>
                            <span className="hidden font-bold text-base md:text-lg sm:inline-block bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300">
                                JourneyWise
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Enhanced */}
                    <nav className="hidden md:flex items-center space-x-1 text-xs md:text-sm font-medium flex-1 ml-6">
                        {isAuthenticated && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${pathname === '/dashboard' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border border-transparent'}`}
                                >
                                    <span>📊</span> Dashboard
                                </Link>
                                <Link
                                    href="/upload"
                                    className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${pathname === '/upload' ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border border-transparent'}`}
                                >
                                    <span>⬆️</span> Upload
                                </Link>
                                <Link
                                    href="/chat"
                                    className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${pathname === '/chat' ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border border-transparent'}`}
                                >
                                    <span>💬</span> Chat AI
                                </Link>
                                <Link
                                    href="/interviews"
                                    className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${pathname && pathname.startsWith('/interviews') ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' : 'text-muted-foreground hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/5'}`}
                                >
                                    <span>🎯</span> Crack Interviews
                                </Link>
                            </>
                        )}

                        <Link
                            href="/journeys"
                            className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${pathname === '/journeys' ? 'text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border border-transparent'}`}
                        >
                            <span>🚀</span> Success Stories
                        </Link>
                    </nav>

                    {/* Desktop Auth Buttons & Theme Toggle */}
                    <div className="hidden md:flex items-center gap-2 md:gap-3 ml-auto">
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200"
                                title="Toggle Theme"
                            >
                                {resolvedTheme === 'dark' ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        )}

                        {isAuthenticated && user ? (
                            <>
                                <Link href="/profile">
                                    <Button variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200 text-sm">
                                        Profile
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-lg bg-accent/30 border border-border hover:border-primary/30 transition-all duration-200">
                                    <Avatar className="h-7 w-7 md:h-8 md:w-8 border border-border">
                                        <AvatarImage src={user.avatar} className="object-cover" />
                                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-[10px] md:text-xs font-bold">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs md:text-sm font-medium text-foreground hidden sm:inline truncate">{user.name}</span>
                                </div>
                                <Button onClick={handleLogout} variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200">Log in</Button>
                                </Link>
                                <Link href="/login?tab=register">
                                    <Button size="sm" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all duration-300">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-1 md:hidden ml-auto">
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary hover:bg-accent/50"
                            >
                                {resolvedTheme === 'dark' ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                            </Button>
                        )}
                        <button
                            className="p-2 hover:bg-accent/50 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-border bg-background/95 backdrop-blur animate-slide-up">
                        <div className="container py-3 space-y-1.5 px-3 sm:px-4">
                            {isAuthenticated && (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="block px-3 py-2.5 rounded-lg hover:bg-accent/50 hover:text-primary transition-all duration-200 font-medium text-muted-foreground text-sm"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/upload"
                                        className="block px-3 py-2.5 rounded-lg hover:bg-accent/50 hover:text-primary transition-all duration-200 font-medium text-muted-foreground text-sm"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Upload
                                    </Link>
                                    <Link
                                        href="/chat"
                                        className="block px-3 py-2.5 rounded-lg hover:bg-accent/50 hover:text-primary transition-all duration-200 font-medium text-muted-foreground text-sm"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Chat AI
                                    </Link>
                                    <Link
                                        href="/interviews"
                                        className="block px-3 py-2.5 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200 font-medium text-cyan-600 dark:text-cyan-400 text-sm flex items-center gap-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        🎯 Crack Interviews
                                    </Link>
                                </>
                            )}

                            <Link
                                href="/journeys"
                                className="block px-3 py-2.5 rounded-lg hover:bg-accent/50 hover:text-primary transition-all duration-200 font-medium text-muted-foreground text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Success Stories
                            </Link>

                            <div className="h-px bg-border my-2" />

                            {isAuthenticated && user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="block px-3 py-2.5 rounded-lg hover:bg-accent/50 hover:text-primary transition-all duration-200 font-medium text-muted-foreground text-sm"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-all duration-200 font-medium text-sm"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-2 pt-2">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                                        <Button variant="outline" className="w-full justify-center h-10 text-sm border-border text-foreground hover:bg-accent/50">Log in</Button>
                                    </Link>
                                    <Link href="/login?tab=register" onClick={() => setMobileMenuOpen(false)} className="block">
                                        <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white h-10 text-sm justify-center shadow-lg shadow-cyan-500/20">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
