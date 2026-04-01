"use client"
import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import {
    Loader2, Mail, Lock, User, Eye, EyeOff, Rocket,
    ArrowRight, Zap, Target, TrendingUp, CheckCircle2,
    Sparkles, Brain
} from 'lucide-react';
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
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const calculatePasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 8) strength += 25;
        if (pass.length >= 12) strength += 25;
        if (/[A-Z]/.test(pass)) strength += 25;
        if (/[0-9!@#$%^&*]/.test(pass)) strength += 25;
        setPasswordStrength(strength);
    };

    const strengthConfig = () => {
        if (passwordStrength === 0) return { label: '', color: 'bg-slate-700', width: '0%' };
        if (passwordStrength <= 25) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
        if (passwordStrength <= 50) return { label: 'Fair', color: 'bg-orange-400', width: '50%' };
        if (passwordStrength <= 75) return { label: 'Good', color: 'bg-yellow-400', width: '75%' };
        return { label: 'Strong 🔒', color: 'bg-emerald-500', width: '100%' };
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
                login(json.user, json.access_token, json.refresh_token);
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
        { icon: Brain, label: 'AI Career Roadmaps', desc: 'Personalized paths to your dream role', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
        { icon: Target, label: 'Skill Gap Analysis', desc: 'Know exactly what to learn next', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
        { icon: TrendingUp, label: 'Progress Tracking', desc: 'Visual milestones that motivate', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
        { icon: Zap, label: 'Interview Prep', desc: 'Company-specific insider strategies', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    ];

    const sc = strengthConfig();

    return (
        <div className="h-screen bg-[#060811] flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">

            {/* ── Animated Background ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Grid lines */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(6,182,212,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px'
                    }}
                />
                {/* Glowing orbs */}
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[100px] animate-blob" />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-700/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-700/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
                {/* Floating particles */}
                {mounted && Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-float"
                        style={{
                            left: `${8 + (i * 8)}%`,
                            top: `${15 + (i % 4) * 20}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${4 + (i % 3)}s`
                        }}
                    />
                ))}
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-8 xl:gap-12 max-w-6xl w-full relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

                {/* ── LEFT: Branding Panel (Desktop only) ── */}
                <div className="hidden lg:flex flex-col justify-center space-y-5">
                    {/* Logo + Headline */}
                    <div className="space-y-3">
                        <div className="-ml-2">
                            <Logo className="h-12 w-auto text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                        </div>
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
                                <Sparkles className="w-3.5 h-3.5" />
                                AI-Powered Career Intelligence
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-black leading-[1.1] tracking-tight">
                                <span className="text-white">Your Career</span>
                                <br />
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    Clarity Starts
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                    Here.
                                </span>
                            </h1>
                            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                                JourneyWise turns your ambitions into an actionable roadmap. Upload your resume, set your target role, and let AI guide every step.
                            </p>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-2 gap-2">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className={`group p-3 rounded-xl ${f.bg} border ${f.border} hover:scale-[1.02] transition-all duration-300 cursor-default`}
                            >
                                <div className={`w-7 h-7 rounded-lg ${f.bg} border ${f.border} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                                    <f.icon className={`w-4.5 h-4.5 ${f.color}`} size={18} />
                                </div>
                                <p className="font-bold text-slate-200 text-sm mb-0.5">{f.label}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>


                </div>

                {/* ── RIGHT: Auth Card ── */}
                <div className="w-full flex flex-col">
                    {/* Mobile branding */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-500/30 rounded-2xl blur-xl" />
                                <Logo iconOnly className="relative h-14 w-14 text-blue-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            JourneyWise
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">AI-powered career clarity</p>
                    </div>

                    {/* Glass Card */}
                    <div className="relative rounded-3xl overflow-hidden">
                        {/* Card glow border */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 p-[1px]">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-900/95 to-slate-900/90 backdrop-blur-2xl" />
                        </div>

                        <div className="relative z-10 p-5 sm:p-6">
                            {/* ── Pill Tab Switcher ── */}
                            <div className="relative flex bg-slate-800/60 rounded-xl p-1 mb-5 border border-slate-700/50">
                                {/* Sliding pill */}
                                <div
                                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/25 transition-transform duration-300 ease-out"
                                    style={{ transform: activeTab === 'register' ? 'translateX(calc(100% + 8px))' : 'translateX(0)' }}
                                />
                                <button
                                    onClick={() => setActiveTab('login')}
                                    className={`relative z-10 flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors duration-300 ${activeTab === 'login' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => setActiveTab('register')}
                                    className={`relative z-10 flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors duration-300 ${activeTab === 'register' ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
                                >
                                    Create Account
                                </button>
                            </div>

                            {/* ── LOGIN FORM ── */}
                            <div className={`transition-all duration-300 ${activeTab === 'login' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none absolute'}`}>
                                {activeTab === 'login' && (
                                    <>
                                        <div className="mb-4">
                                            <h2 className="text-xl sm:text-2xl font-black text-white mb-0.5">Welcome back 👋</h2>
                                            <p className="text-xs text-slate-400">Pick up right where you left off on your journey.</p>
                                        </div>

                                        <form onSubmit={(e) => onSubmit('login', e)} className="space-y-3">
                                            {/* Email */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="login-email" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    Email Address
                                                </Label>
                                                <div className={`relative transition-all duration-200 ${focusedField === 'login-email' ? 'scale-[1.01]' : ''}`}>
                                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focusedField === 'login-email' ? 'text-cyan-400' : 'text-slate-500'}`} />
                                                    <Input
                                                        id="login-email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        required
                                                        onFocus={() => setFocusedField('login-email')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className="pl-11 h-10 bg-slate-800/60 border-slate-700/60 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 placeholder-slate-600 text-sm rounded-xl transition-all duration-200"
                                                    />
                                                </div>
                                            </div>

                                            {/* Password */}
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="login-password" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                        Password
                                                    </Label>
                                                    <Link href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
                                                        Forgot password?
                                                    </Link>
                                                </div>
                                                <div className={`relative transition-all duration-200 ${focusedField === 'login-password' ? 'scale-[1.01]' : ''}`}>
                                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focusedField === 'login-password' ? 'text-cyan-400' : 'text-slate-500'}`} />
                                                    <Input
                                                        id="login-password"
                                                        name="password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••••"
                                                        required
                                                        onFocus={() => setFocusedField('login-password')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className="pl-11 pr-12 h-10 bg-slate-800/60 border-slate-700/60 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 placeholder-slate-600 text-sm rounded-xl transition-all duration-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                                                        tabIndex={-1}
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Remember me */}
                                            <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={rememberMe}
                                                        onChange={(e) => setRememberMe(e.target.checked)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${rememberMe ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 bg-slate-800'}`}>
                                                        {rememberMe && <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white" />}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors select-none">Remember me for 30 days</span>
                                            </label>

                                            {/* Submit */}
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full h-10 mt-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] group"
                                            >
                                                {loading ? (
                                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                                                ) : (
                                                    <><ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" /> Sign In</>
                                                )}
                                            </Button>
                                        </form>

                                        <p className="text-center text-xs text-slate-500 mt-3">
                                            New here?{' '}
                                            <button onClick={() => setActiveTab('register')} className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                                                Create a free account →
                                            </button>
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* ── REGISTER FORM ── */}
                            <div className={`transition-all duration-300 ${activeTab === 'register' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none absolute'}`}>
                                {activeTab === 'register' && (
                                    <>
                                        <div className="mb-3">
                                            <h2 className="text-xl sm:text-2xl font-black text-white mb-0.5">Start your journey 🚀</h2>
                                            <p className="text-xs text-slate-400">Create your free account to get started.</p>
                                        </div>

                                        <form onSubmit={(e) => onSubmit('register', e)} className="space-y-2.5">
                                            {/* Full Name */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="register-name" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    Full Name
                                                </Label>
                                                <div className={`relative transition-all duration-200 ${focusedField === 'register-name' ? 'scale-[1.01]' : ''}`}>
                                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focusedField === 'register-name' ? 'text-cyan-400' : 'text-slate-500'}`} />
                                                    <Input
                                                        id="register-name"
                                                        name="name"
                                                        placeholder="Alex Johnson"
                                                        required
                                                        onFocus={() => setFocusedField('register-name')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className="pl-11 h-10 bg-slate-800/60 border-slate-700/60 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 placeholder-slate-600 text-sm rounded-xl transition-all duration-200"
                                                    />
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="register-email" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    Email Address
                                                </Label>
                                                <div className={`relative transition-all duration-200 ${focusedField === 'register-email' ? 'scale-[1.01]' : ''}`}>
                                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focusedField === 'register-email' ? 'text-cyan-400' : 'text-slate-500'}`} />
                                                    <Input
                                                        id="register-email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        required
                                                        onFocus={() => setFocusedField('register-email')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className="pl-11 h-10 bg-slate-800/60 border-slate-700/60 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 placeholder-slate-600 text-sm rounded-xl transition-all duration-200"
                                                    />
                                                </div>
                                            </div>

                                            {/* Password */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="register-password" className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    Password
                                                </Label>
                                                <div className={`relative transition-all duration-200 ${focusedField === 'register-password' ? 'scale-[1.01]' : ''}`}>
                                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focusedField === 'register-password' ? 'text-cyan-400' : 'text-slate-500'}`} />
                                                    <Input
                                                        id="register-password"
                                                        name="password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Min. 8 characters"
                                                        minLength={8}
                                                        required
                                                        onFocus={() => setFocusedField('register-password')}
                                                        onBlur={() => setFocusedField(null)}
                                                        onChange={(e) => calculatePasswordStrength(e.target.value)}
                                                        className="pl-11 pr-12 h-10 bg-slate-800/60 border-slate-700/60 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 placeholder-slate-600 text-sm rounded-xl transition-all duration-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                                                        tabIndex={-1}
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>

                                                {/* Password strength */}
                                                {passwordStrength > 0 && (
                                                    <div className="space-y-1.5 pt-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-500">Password strength</span>
                                                            <span className={`text-xs font-bold ${sc.color.replace('bg-', 'text-')}`}>{sc.label}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-slate-700/80 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${sc.color} rounded-full transition-all duration-500`}
                                                                style={{ width: sc.width }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Password requirements */}
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {[
                                                    { text: '8+ characters', check: passwordStrength >= 25 },
                                                    { text: '12+ characters', check: passwordStrength >= 50 },
                                                    { text: 'Uppercase letter', check: passwordStrength >= 75 },
                                                    { text: 'Number or symbol', check: passwordStrength >= 100 },
                                                ].map((req, i) => (
                                                    <div key={i} className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${req.check ? 'text-emerald-400' : 'text-slate-600'}`}>
                                                        <CheckCircle2 className={`w-3 h-3 flex-shrink-0 ${req.check ? 'text-emerald-400' : 'text-slate-700'}`} />
                                                        {req.text}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Terms */}
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <div className="relative mt-0.5 flex-shrink-0">
                                                    <input type="checkbox" required className="sr-only peer" id="terms-check" />
                                                    <div className="w-5 h-5 rounded-md border-2 border-slate-600 bg-slate-800 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all duration-200 flex items-center justify-center">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-white hidden peer-checked:block" />
                                                    </div>
                                                </div>
                                                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                                                    I agree to JourneyWise{' '}
                                                    <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2">Terms</Link>
                                                    {' '}&{' '}
                                                    <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2">Privacy Policy</Link>
                                                </span>
                                            </label>

                                            {/* Submit */}
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full h-10 mt-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] group"
                                            >
                                                {loading ? (
                                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
                                                ) : (
                                                    <><Rocket className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Create Free Account</>
                                                )}
                                            </Button>
                                        </form>

                                        <p className="text-center text-xs text-slate-500 mt-3">
                                            Already have an account?{' '}
                                            <button onClick={() => setActiveTab('login')} className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                                                Sign In →
                                            </button>
                                        </p>
                                    </>
                                )}
                            </div>


                        </div>
                    </div>


                </div>
            </div>

            {/* Global animation styles */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0,0) scale(1); }
                    33% { transform: translate(30px,-50px) scale(1.08); }
                    66% { transform: translate(-20px,20px) scale(0.94); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); opacity: 0.4; }
                    50% { transform: translateY(-16px); opacity: 0.8; }
                }
                .animate-blob { animation: blob 8s infinite ease-in-out; }
                .animate-float { animation: float 4s infinite ease-in-out; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}</style>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen bg-[#060811]">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 animate-ping absolute inset-0" />
                    <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
                </div>
            </div>
        }>
            <AuthForm />
        </Suspense>
    );
}
