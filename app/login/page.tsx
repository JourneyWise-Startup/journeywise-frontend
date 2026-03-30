"use client"
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, Eye, EyeOff, CheckCircle2, Rocket, ArrowRight, Zap, Target, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

function AuthForm() {
    const router = useRouter();
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [activeTab, setActiveTab] = useState(defaultTab);

    const calculatePasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 8) strength += 25;
        if (pass.length >= 12) strength += 25;
        if (/[A-Z]/.test(pass)) strength += 25;
        if (/[0-9]/.test(pass)) strength += 25;
        setPasswordStrength(strength);
    };

    async function onSubmit(type: 'login' | 'register', e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const json = await res.json();

            if (!res.ok) {
                toast.error(json.message || json.error || 'Authentication failed');
                return;
            }

            if (json.access_token) {
                login(json.user, json.access_token);
                toast.success(type === 'login' ? '👋 Welcome back!' : '🎉 Account created successfully!');

                setTimeout(() => {
                    router.push('/dashboard');
                    router.refresh();
                }, 600);
            } else {
                toast.error('Invalid credentials');
            }
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const features = [
        { icon: Target, label: 'AI-Powered Guidance', desc: 'Personalized career roadmaps' },
        { icon: TrendingUp, label: 'Real-Time Progress', desc: 'Track your growth metrics' },
        { icon: Zap, label: 'Interview Prep', desc: 'Crack your interview calls' },
        { icon: Shield, label: 'Secure & Private', desc: 'Your data is protected' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4 pt-8 relative overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl w-full relative z-10">
                {/* Left Side - Features (Hidden on Mobile) */}
                <div className="hidden lg:flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div>
                        <div className="mb-6 -ml-3">
                            <Logo className="h-12 lg:h-14 w-auto text-blue-500 drop-shadow-xl" />
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black mb-4 leading-tight">
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Your Career
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Clarity Starts
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Here
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 mt-6 leading-relaxed">
                            JourneyWise is your AI-powered career companion, helping you navigate opportunities, build skills, and land dream roles.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {features.map((feature, idx) => (
                            <div 
                                key={idx}
                                className="group p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-300 cursor-default"
                            >
                                <feature.icon className="h-6 w-6 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold text-slate-200 mb-1">{feature.label}</h3>
                                <p className="text-sm text-slate-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial-like section */}
                    <div className="mt-auto pt-8 border-t border-slate-700">
                        <p className="text-slate-400 italic">
                            "JourneyWise transformed how I approach my career. The AI-driven insights are invaluable."
                        </p>
                        {/* <p className="text-cyan-400 font-semibold mt-2">— 2,000+ professionals</p> */}
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="w-full animate-in fade-in slide-in-from-right-8 duration-700">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8 space-y-2">
                        <div className="flex justify-center mb-3">
                            <Logo iconOnly={true} className="h-16 w-16 text-blue-500 drop-shadow-lg filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            JourneyWise
                        </h2>
                        <p className="text-sm text-slate-400">AI-powered career clarity</p>
                    </div>

                    {/* Auth Card */}
                    <Card className="border border-cyan-500/20 shadow-2xl shadow-cyan-500/20 bg-slate-900/80 backdrop-blur-2xl hover:border-cyan-500/40 transition-all duration-500">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-b border-slate-700/50 rounded-none mx-0 mb-0 px-6 pt-6 h-auto gap-0">
                                <TabsTrigger 
                                    value="login" 
                                    className="font-bold text-sm rounded-none pb-4 data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:shadow-none text-slate-400 hover:text-slate-200 transition-all duration-300"
                                >
                                    Sign In
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="register" 
                                    className="font-bold text-sm rounded-none pb-4 data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:shadow-none text-slate-400 hover:text-slate-200 transition-all duration-300"
                                >
                                    Create Account
                                </TabsTrigger>
                            </TabsList>

                            {/* Login Tab */}
                            <TabsContent value="login" className="mt-0">
                                <CardHeader className="pt-6 px-6 pb-4">
                                    <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
                                    <CardDescription className="text-slate-400 text-sm mt-2">
                                        Sign in to continue your journey with JourneyWise
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 space-y-5">
                                    <form onSubmit={(e) => onSubmit('login', e)} className="space-y-5">
                                        {/* Email */}
                                        <div className="space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                                            <Label htmlFor="login-email" className="font-semibold text-slate-300 text-sm">Email Address</Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                                <Input
                                                    id="login-email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    required
                                                    className="pl-11 h-12 bg-slate-800/50 border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-slate-200 placeholder-slate-600 text-sm rounded-lg transition-all duration-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                                            <Label htmlFor="login-password" className="font-semibold text-slate-300 text-sm">Password</Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                                <Input
                                                    id="login-password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••••••"
                                                    required
                                                    className="pl-11 pr-11 h-12 bg-slate-800/50 border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-slate-200 placeholder-slate-600 text-sm rounded-lg transition-all duration-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors hover:scale-110"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 accent-cyan-500 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                                            </label>
                                            <Link href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                                                Forgot password?
                                            </Link>
                                        </div>

                                        {/* Sign In Button */}
                                        <Button
                                            type="submit"
                                            className="w-full h-12 mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 text-base rounded-lg group"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Signing In...
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                                                    Sign In
                                                </>
                                            )}
                                        </Button>
                                    </form>

                                    {/* Switch to Register */}
                                    <div className="text-center pt-4 border-t border-slate-700">
                                        <p className="text-slate-400 text-sm">
                                            Don't have an account?{' '}
                                            <button
                                                onClick={() => setActiveTab('register')}
                                                className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                                            >
                                                Create one
                                            </button>
                                        </p>
                                    </div>
                                </CardContent>
                            </TabsContent>

                            {/* Register Tab */}
                            <TabsContent value="register" className="mt-0">
                                <CardHeader className="pt-6 px-6 pb-4">
                                    <CardTitle className="text-3xl font-bold text-white">Create Your Account</CardTitle>
                                    <CardDescription className="text-slate-400 text-sm mt-3">
                                        Start your journey to landing your dream role
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 space-y-5">
                                    <form onSubmit={(e) => onSubmit('register', e)} className="space-y-5">
                                        {/* Full Name */}
                                        <div className="space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                                            <Label htmlFor="register-name" className="font-semibold text-slate-300 text-sm">Full Name</Label>
                                            <div className="relative group">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                                <Input
                                                    id="register-name"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    required
                                                    className="pl-11 h-12 bg-slate-800/50 border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-slate-200 placeholder-slate-600 text-sm rounded-lg transition-all duration-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                                            <Label htmlFor="register-email" className="font-semibold text-slate-300 text-sm">Email Address</Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                                <Input
                                                    id="register-email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    required
                                                    className="pl-11 h-12 bg-slate-800/50 border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-slate-200 placeholder-slate-600 text-sm rounded-lg transition-all duration-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                                            <Label htmlFor="register-password" className="font-semibold text-slate-300 text-sm">Password</Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                                <Input
                                                    id="register-password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••••••"
                                                    minLength={8}
                                                    required
                                                    onChange={(e) => calculatePasswordStrength(e.target.value)}
                                                    className="pl-11 pr-11 h-12 bg-slate-800/50 border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 text-slate-200 placeholder-slate-600 text-sm rounded-lg transition-all duration-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors hover:scale-110"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>

                                            {/* Password Strength Indicator */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all duration-300 ${
                                                            passwordStrength < 25 ? 'bg-red-500 w-1/4' :
                                                            passwordStrength < 50 ? 'bg-orange-500 w-2/4' :
                                                            passwordStrength < 75 ? 'bg-yellow-500 w-3/4' :
                                                            'bg-green-500 w-full'
                                                        }`}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {passwordStrength < 25 ? 'Weak' : passwordStrength < 50 ? 'Fair' : passwordStrength < 75 ? 'Good' : 'Strong'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500">Minimum 8 characters with mix of uppercase and numbers</p>
                                        </div>

                                        {/* Terms Agreement */}
                                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    required
                                                    className="w-4 h-4 mt-1 rounded border-slate-600 bg-slate-800 accent-cyan-500 cursor-pointer mt-1"
                                                />
                                                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                                                    I agree to JourneyWise{' '}
                                                    <Link href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
                                                        Terms of Service
                                                    </Link>
                                                    {' '}and{' '}
                                                    <Link href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
                                                        Privacy Policy
                                                    </Link>
                                                </span>
                                            </label>
                                        </div>

                                        {/* Create Account Button */}
                                        <Button
                                            type="submit"
                                            className="w-full h-12 mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 text-base rounded-lg group"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Creating Account...
                                                </>
                                            ) : (
                                                <>
                                                    <Rocket className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                                    Create Account
                                                </>
                                            )}
                                        </Button>
                                    </form>

                                    {/* Switch to Login */}
                                    <div className="text-center pt-4 border-t border-slate-700">
                                        <p className="text-slate-400 text-sm">
                                            Already have an account?{' '}
                                            <button
                                                onClick={() => setActiveTab('login')}
                                                className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                                            >
                                                Sign In
                                            </button>
                                        </p>
                                    </div>
                                </CardContent>
                            </TabsContent>
                        </Tabs>
                    </Card>

                    {/* Footer Text */}
                    <div className="mt-6 text-center text-slate-500 text-xs">
                        <p>🔒 Your data is encrypted and secure</p>
                    </div>
                </div>
            </div>

            {/* CSS for blob animation */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        }>
            <AuthForm />
        </Suspense>
    )
}
