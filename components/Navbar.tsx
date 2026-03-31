"use client"
import { Toaster } from 'sonner'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
    LogOut, Menu, X, Sun, Moon, 
    LayoutDashboard, Upload, MessageSquare, Target, FileText, Rocket, ChevronDown, Trophy, Compass
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from '@/components/Logo';
import { getAvatarUrl } from '@/lib/utils';

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
                    if (data && data.avatar && data.avatar !== user.avatar) {
                        updateUser({ ...user, avatar: data.avatar });
                    } else if (data && !data.avatar && user.avatar) {
                        const updated = { ...user };
                        delete updated.avatar;
                        updateUser(updated);
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
                        <Link href="/" className="flex items-center hover:opacity-90 transition-all duration-200 group">
                            <Logo className="h-7 md:h-9 w-auto text-blue-600 dark:text-blue-500 transform group-hover:scale-105 transition-all duration-300" />
                        </Link>
                    </div>

                    {/* Desktop Navigation - Cleaned & Enhanced */}
                    <nav className="hidden md:flex items-center space-x-2 text-sm font-medium flex-1 ml-6">
                        {isAuthenticated && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${pathname === '/dashboard' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent'}`}
                                >
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>

                                {/* Tools Dropdown */}
                                <div className="relative group">
                                    <button className="px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 outline-none">
                                        <Compass className="w-4 h-4" /> Tools <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                                    </button>
                                    
                                    {/* Invisible expanded hit area for smooth hover */}
                                    <div className="absolute top-full left-0 w-full h-4"></div>
                                    
                                    {/* Dropdown Menu */}
                                    <div className="absolute top-[calc(100%+8px)] left-0 w-56 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left scale-95 group-hover:scale-100 flex flex-col p-2 z-50">
                                        <Link 
                                            href="/upload" 
                                            className="px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-blue-500/10 hover:text-blue-500 flex items-center gap-3 transition-colors group/item"
                                        >
                                            <div className="bg-blue-500/10 p-1.5 rounded-md group-hover/item:bg-blue-500/20 group-hover/item:scale-110 transition-all">
                                                <Upload className="w-4 h-4 text-blue-500" />
                                            </div>
                                            Roadmap Builder
                                        </Link>
                                        <Link 
                                            href="/resume-analyzer" 
                                            className="px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-emerald-500/10 hover:text-emerald-500 flex items-center gap-3 transition-colors group/item mt-1"
                                        >
                                            <div className="bg-emerald-500/10 p-1.5 rounded-md group-hover/item:bg-emerald-500/20 group-hover/item:scale-110 transition-all">
                                                <FileText className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            Resume Analyzer
                                        </Link>
                                        <div className="h-px bg-border/50 my-1.5 mx-2"></div>
                                        <Link 
                                            href="/interviews" 
                                            className="px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-amber-500/10 hover:text-amber-500 flex items-center gap-3 transition-colors group/item"
                                        >
                                            <div className="bg-amber-500/10 p-1.5 rounded-md group-hover/item:bg-amber-500/20 group-hover/item:scale-110 transition-all">
                                                <Target className="w-4 h-4 text-amber-500" />
                                            </div>
                                            Crack Interviews
                                        </Link>
                                        <Link 
                                            href="/chat" 
                                            className="px-3 py-2.5 rounded-md text-sm text-foreground hover:bg-purple-500/10 hover:text-purple-500 flex items-center gap-3 transition-colors group/item mt-1"
                                        >
                                            <div className="bg-purple-500/10 p-1.5 rounded-md group-hover/item:bg-purple-500/20 group-hover/item:scale-110 transition-all">
                                                <MessageSquare className="w-4 h-4 text-purple-500" />
                                            </div>
                                            Career AI Chat
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}

                        <Link
                            href="/journeys"
                            className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${pathname === '/journeys' ? 'text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent'}`}
                        >
                            <Trophy className="w-4 h-4" /> Success Stories
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
                                {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
                                        <AvatarImage src={getAvatarUrl(user.avatar)} className="object-cover" />
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
                                {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
                    <div className="md:hidden border-t border-border bg-background/95 backdrop-blur animate-slide-up shadow-xl absolute w-full">
                        <div className="container py-3 space-y-1 px-3 sm:px-4 max-h-[80vh] overflow-y-auto">
                            {isAuthenticated && (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${pathname === '/dashboard' ? 'bg-cyan-500/10 text-cyan-500' : 'text-foreground hover:bg-accent'}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <LayoutDashboard className={`w-5 h-5 ${pathname === '/dashboard' ? 'text-cyan-500' : 'text-muted-foreground'}`} /> Dashboard
                                    </Link>
                                    
                                    <div className="py-2">
                                        <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tools</p>
                                        <div className="space-y-1 pl-2 border-l-2 border-border/50 ml-6">
                                            <Link
                                                href="/upload"
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-blue-500/10 hover:text-blue-500 transition-all text-sm font-medium"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <Upload className="w-4 h-4 text-blue-500" /> Roadmap Builder
                                            </Link>
                                            <Link
                                                href="/resume-analyzer"
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-emerald-500/10 hover:text-emerald-500 transition-all text-sm font-medium"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <FileText className="w-4 h-4 text-emerald-500" /> Resume Analyzer
                                            </Link>
                                            <Link
                                                href="/interviews"
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-amber-500/10 hover:text-amber-500 transition-all text-sm font-medium"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <Target className="w-4 h-4 text-amber-500" /> Crack Interviews
                                            </Link>
                                            <Link
                                                href="/chat"
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-purple-500/10 hover:text-purple-500 transition-all text-sm font-medium"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <MessageSquare className="w-4 h-4 text-purple-500" /> Career AI Chat
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}

                            <Link
                                href="/journeys"
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${pathname === '/journeys' ? 'bg-green-500/10 text-green-500' : 'text-foreground hover:bg-accent'}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Trophy className={`w-5 h-5 ${pathname === '/journeys' ? 'text-green-500' : 'text-muted-foreground'}`} /> Success Stories
                            </Link>

                            <div className="h-px bg-border my-2" />

                            {isAuthenticated && user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-3 rounded-lg hover:bg-accent transition-all duration-200 font-medium text-foreground text-sm"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-all duration-200 font-medium text-sm flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-2 pt-2 pb-4">
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
