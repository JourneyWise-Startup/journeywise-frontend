"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, TrendingUp, CheckCircle2, AlertCircle, Target, Zap, BookOpen, ArrowRight, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from 'sonner';

export default function Dashboard() {
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });
    const [loading, setLoading] = useState(true);
    const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const { user, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        setLoading(true);
        Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmap`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(res => res.json()),
        ]).then(([roadmapData]) => {
            if (Array.isArray(roadmapData)) {
                setRoadmaps(roadmapData);

                // Calculate stats based on progress
                const completedCount = roadmapData.filter((r: any) => r.progress === 100).length;
                const inProgressCount = roadmapData.filter((r: any) => r.progress < 100 && r.isActive).length;

                setStats({
                    total: roadmapData.length,
                    completed: completedCount,
                    inProgress: inProgressCount,
                });
            }
        }).catch(err => {
            console.error('Error fetching data:', err);
            toast.error('Failed to load roadmaps. Please reload the page.');
        }).finally(() => {
            setLoading(false);
        });
    }, [token, router]);

    const getScoreBadgeColor = (score: number) => {
        if (score >= 80) return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20';
        if (score >= 60) return 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20';
        if (score >= 40) return 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20';
        return 'bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/20';
    };

    const handleDeleteRoadmap = async (roadmapId: string, careerGoal: string) => {
        if (!token) return;
        setDeleting(true);
        setHoveredCardId(null); // Clear hover state immediately

        const confirmed = await new Promise<boolean>((resolve) => {
            toast.custom((t) => (
                <div className="relative w-full max-w-xs ">
                    {/* Glowing backdrop */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl blur-2xl opacity-35 animate-pulse" />

                    {/* Main dialog */}
                    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-violet-500/40 rounded-2xl shadow-xl shadow-violet-500/20 p-3 md:p-3.5 space-y-2 backdrop-blur-2xl animate-in slide-in-from-top-8 fade-in duration-500 overflow-hidden group">

                        {/* Premium gradient accents */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-violet-600/20 to-transparent rounded-full blur-3xl opacity-40" />
                        <div className="absolute -bottom-40 right-0 w-96 h-96 bg-gradient-to-t from-indigo-600/20 to-transparent rounded-full blur-3xl opacity-40" />

                        {/* Header with icon */}
                        <div className="relative z-10 flex gap-1.5 items-start">
                            <div className="flex-shrink-0 p-1.5 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 border-2 border-red-500/40 backdrop-blur-xl">
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm md:text-base font-bold text-white line-clamp-2">{careerGoal}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Permanent</p>
                            </div>
                        </div>

                        {/* Warning box */}
                        <div className="relative z-10 bg-gradient-to-r from-red-600/10 to-pink-600/10 border-l-4 border-red-500 px-2 md:px-2.5 py-1.5 rounded-lg backdrop-blur-xl">
                            <div className="flex gap-1.5 items-start">
                                <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-red-200 font-semibold">Delete</p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="relative z-10 flex gap-1.5 pt-0">
                            <button
                                onClick={() => {
                                    toast.dismiss(t);
                                    setHoveredCardId(null);
                                    resolve(false);
                                    setDeleting(false);
                                }}
                                className="flex-1 h-7 px-2 rounded-lg bg-slate-700/60 hover:bg-slate-700/80 text-white border border-slate-600/60 hover:border-slate-600 font-semibold transition-all duration-300 text-xs hover:scale-[1.02] active:scale-95 backdrop-blur-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    toast.dismiss(t);
                                    setHoveredCardId(null);
                                    try {
                                        const loadingToast = toast.custom((loadingT) => (
                                            <div className="relative w-full max-w-xs">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-2xl opacity-35 animate-pulse" />
                                                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-blue-500/40 rounded-2xl shadow-xl p-2.5 md:p-3 backdrop-blur-2xl overflow-hidden">
                                                    <div className="absolute inset-0 opacity-30">
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-blue-600/20 rounded-full blur-3xl" />
                                                    </div>
                                                    <div className="relative z-10 flex items-center gap-2">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-3.5 h-3.5 border-2 border-blue-300 border-t-cyan-400 rounded-full animate-spin" />
                                                        </div>
                                                        <p className="font-bold text-xs text-white">Deleting...</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ), { duration: Infinity });

                                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmap/${roadmapId}`, {
                                            method: 'DELETE',
                                            headers: {
                                                'Authorization': `Bearer ${token}`,
                                                'Content-Type': 'application/json'
                                            }
                                        });

                                        toast.dismiss(loadingToast);

                                        if (res.ok) {
                                            // Get the deleted roadmap to check if it was completed or in progress
                                            const deletedRoadmap = roadmaps.find(r => r.id === roadmapId);

                                            // Remove from list
                                            const updatedRoadmaps = roadmaps.filter(r => r.id !== roadmapId);
                                            setRoadmaps(updatedRoadmaps);

                                            // Recalculate stats based on remaining roadmaps
                                            const completedCount = updatedRoadmaps.filter((r: any) => r.progress === 100).length;
                                            const inProgressCount = updatedRoadmaps.filter((r: any) => r.progress < 100 && r.isActive).length;

                                            setStats({
                                                total: updatedRoadmaps.length,
                                                completed: completedCount,
                                                inProgress: inProgressCount,
                                            });

                                            toast.custom((successT) => (
                                                <div className="relative w-full max-w-xs">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl blur-2xl opacity-35 animate-pulse" />
                                                    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500/40 rounded-2xl shadow-xl p-2.5 md:p-3 backdrop-blur-2xl overflow-hidden">
                                                        <div className="relative z-10 flex gap-2 items-start">
                                                            <div className="flex-shrink-0 p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/40">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-white">Deleted!</p>
                                                                <p className="text-xs text-slate-400 mt-0.5">Removed</p>
                                                            </div>
                                                            <button
                                                                onClick={() => toast.dismiss(successT)}
                                                                className="flex-shrink-0 text-slate-400 hover:text-white transition-colors text-xs hover:scale-110"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ), { duration: 3500 });
                                        } else if (res.status === 401) {
                                            toast.custom((e) => (
                                                <div className="relative w-full max-w-xs">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-2xl opacity-35" />
                                                    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-orange-500/40 rounded-2xl shadow-xl p-2.5 md:p-3 backdrop-blur-2xl overflow-hidden">
                                                        <div className="relative z-10 flex gap-1.5">
                                                            <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-sm text-white">Unauthorized</p>
                                                                <p className="text-xs text-slate-400 mt-0.5">Denied</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ), { duration: 4000 });
                                        } else {
                                            const errorData = await res.json().catch(() => ({}));
                                            toast.custom((e) => (
                                                <div className="relative w-full max-w-xs">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-2xl opacity-35" />
                                                    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-orange-500/40 rounded-2xl shadow-xl p-2.5 md:p-3 backdrop-blur-2xl overflow-hidden">
                                                        <div className="relative z-10 flex gap-1.5">
                                                            <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-sm text-white">Error</p>
                                                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{errorData.message || 'Failed'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ), { duration: 4000 });
                                        }
                                    } catch (error: any) {
                                        const errorMsg = error.message === 'Failed to fetch' ? 'Connection error' : error.message;
                                        toast.custom((e) => (
                                            <div className="relative w-full max-w-xs">
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-2xl opacity-35" />
                                                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-orange-500/40 rounded-2xl shadow-xl p-2.5 md:p-3 backdrop-blur-2xl overflow-hidden">
                                                    <div className="relative z-10 flex gap-1.5">
                                                        <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-sm text-white">Network Error</p>
                                                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{errorMsg}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ), { duration: 4000 });
                                    }
                                }}
                                className="flex-1 h-7 px-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-red-500/40 border border-red-500/50 transition-all duration-300 text-xs hover:scale-[1.02] active:scale-95 disabled:opacity-50 backdrop-blur-sm flex items-center justify-center gap-1.5"
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ), { duration: Infinity });
        });

        if (!deleting) setDeleting(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-8 md:py-12 px-3 sm:px-4 md:px-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Effects - Matches Home Page Style */}
            <div className="absolute top-0 -right-40 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl md:blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-3xl md:blur-[100px] pointer-events-none" />

            <div className="container max-w-6xl mx-auto relative z-10">
                {/* Header Section - Responsive */}
                <div className="mb-10 md:mb-12">
                    <div className="flex justify-between items-start md:items-center mb-8 md:mb-10 flex-col md:flex-row gap-4 md:gap-6">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2">
                                Welcome back, <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 dark:from-cyan-400 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent">{user?.name || 'Guest'}</span>
                            </h1>
                            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">Track and manage your career progression</p>
                        </div>
                        <Link href="/upload">
                            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all h-10 md:h-11 text-sm md:text-base whitespace-nowrap animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                <PlusCircle className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                                <span className="hidden sm:inline">Create Roadmap</span>
                                <span className="sm:hidden">New Roadmap</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Cards - Responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                        <Card className="group relative border border-border/40 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/40 dark:to-slate-900/20 hover:bg-gradient-to-br hover:from-cyan-50/50 hover:to-cyan-100/30 dark:hover:from-cyan-900/30 dark:hover:to-cyan-900/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 shadow-sm hover:shadow-lg dark:shadow-xl/10 hover:border-cyan-400/40 backdrop-blur-sm overflow-hidden">
                            {/* Gradient background blur */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardContent className="pt-5 md:pt-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Roadmaps</p>
                                        <p className="text-3xl md:text-4xl font-bold text-foreground mt-2 md:mt-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{loading ? '...' : stats.total}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all duration-500 group-hover:scale-110">
                                        <Target className="h-7 w-7 md:h-8 md:w-8 text-cyan-600/60 dark:text-cyan-500/50 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group relative border border-border/40 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/40 dark:to-slate-900/20 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-blue-100/30 dark:hover:from-blue-900/30 dark:hover:to-blue-900/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 shadow-sm hover:shadow-lg dark:shadow-xl/10 hover:border-blue-400/40 backdrop-blur-sm overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardContent className="pt-5 md:pt-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wide">In Progress</p>
                                        <p className="text-3xl md:text-4xl font-bold text-foreground mt-2 md:mt-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{loading ? '...' : stats.inProgress}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-500 group-hover:scale-110">
                                        <Zap className="h-7 w-7 md:h-8 md:w-8 text-blue-600/60 dark:text-blue-500/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group relative border border-border/40 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/40 dark:to-slate-900/20 hover:bg-gradient-to-br hover:from-emerald-50/50 hover:to-emerald-100/30 dark:hover:from-emerald-900/30 dark:hover:to-emerald-900/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 sm:col-span-2 lg:col-span-1 shadow-sm hover:shadow-lg dark:shadow-xl/10 hover:border-emerald-400/40 backdrop-blur-sm overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardContent className="pt-5 md:pt-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wide">Completed</p>
                                        <p className="text-3xl md:text-4xl font-bold text-foreground mt-2 md:mt-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{loading ? '...' : stats.completed}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all duration-500 group-hover:scale-110">
                                        <CheckCircle2 className="h-7 w-7 md:h-8 md:w-8 text-emerald-600/60 dark:text-emerald-500/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Roadmaps Section */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        Your Career Roadmaps
                    </h2>

                    {loading ? (
                        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm">
                                    <Skeleton className="h-6 w-3/4 bg-muted" />
                                    <Skeleton className="h-4 w-1/2 bg-muted" />
                                    <div className="space-y-2 mt-8">
                                        <Skeleton className="h-2 w-full bg-muted" />
                                        <Skeleton className="h-2 w-full bg-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : roadmaps.length === 0 ? (
                        <Card className="border border-border bg-card animate-in fade-in duration-700 delay-600 shadow-sm">
                            <CardContent className="text-center py-16 md:py-20">
                                <div className="inline-block p-4 rounded-full bg-muted mb-4">
                                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">No roadmaps yet</h3>
                                <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm md:text-base">Upload your resume to get started with AI-powered career guidance and personalized roadmaps</p>
                                <Link href="/upload">
                                    <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold h-10 md:h-11 shadow-lg shadow-cyan-500/30 transition-all text-sm md:text-base">
                                        <PlusCircle className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                                        Create Your First Roadmap
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-5 sm:gap-6 md:gap-6 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {roadmaps.map((r: any, idx: number) => (
                                <div
                                    key={r.id}
                                    className="relative group h-full"
                                >
                                    <Link href={`/roadmap/${r.id}`} className="block h-full">
                                        <Card className="relative h-full border border-border/50 bg-gradient-to-br from-card to-muted/30 hover:to-muted/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer overflow-hidden animate-in fade-in slide-in-from-bottom-4 shadow-sm" style={{ transitionDelay: `${(idx % 3) * 100 + 100}ms` }}>

                                            {/* Hover Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                            <CardHeader className="pb-2 relative z-10 pt-4 px-4">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="space-y-1.5 flex-1 pr-12">
                                                        <CardTitle className="text-lg font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                                                            {r.careerGoal}
                                                        </CardTitle>
                                                        <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
                                                            {new Date(r.createdAt).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </CardDescription>
                                                    </div>

                                                    {/* Score Badge */}
                                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex flex-col items-center justify-center border ${getScoreBadgeColor(r.readinessScore)}`}>
                                                        <span className="text-sm font-bold leading-none">{r.readinessScore}%</span>
                                                        <span className="text-[10px] opacity-80 leading-none mt-0.5">Ready</span>
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="space-y-4 pb-4 relative z-10 px-4">
                                                {/* Progress Bar */}
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Progress</span>
                                                        <span className="font-semibold text-cyan-600 dark:text-cyan-400">{r.readinessScore}%</span>
                                                    </div>
                                                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                                            style={{ width: `${r.readinessScore}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Skill Gaps */}
                                                {r.skillGaps && r.skillGaps.length > 0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                                                            <AlertCircle className="h-3 w-3" />
                                                            Focus Areas
                                                        </p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {r.skillGaps.slice(0, 2).map((g: any, i: number) => (
                                                                <span key={i} className="inline-block px-2 py-0.5 text-xs font-medium rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 truncate max-w-[120px]">
                                                                    {typeof g === 'string' ? g : g.skill || 'Skill'}
                                                                </span>
                                                            ))}
                                                            {r.skillGaps.length > 2 && (
                                                                <span className="inline-block px-1.5 py-0.5 text-xs font-medium rounded-md bg-muted text-muted-foreground border border-border">
                                                                    +{r.skillGaps.length - 2}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Action Button */}
                                                <div className="pt-2">
                                                    <Button variant="ghost" size="sm" className="w-full justify-between hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 group/btn p-0 h-auto font-normal">
                                                        <span className="text-xs">View Roadmap</span>
                                                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>

                                    {/* Delete Button - Top Left */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeleteRoadmap(r.id, r.careerGoal);
                                        }}
                                        className="absolute top-3 left-3 z-20 p-1.5 rounded-lg bg-background/50 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow-sm"
                                        title="Delete roadmap"
                                    >
                                        {deleting ? (
                                            <div className="w-3.5 h-3.5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Toaster position="top-center" richColors theme="dark" />
        </div>
    );
}
