"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    PlusCircle,
    CheckCircle2,
    AlertCircle,
    Target,
    Zap,
    BookOpen,
    ArrowRight,
    Trash2,
    Sparkles,
    Route,
} from 'lucide-react';
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
            if (!Array.isArray(roadmapData)) {
                console.error('Dashboard roadmaps response:', roadmapData);
                toast.error('Could not load roadmaps. Try again.');
                setRoadmaps([]);
                setStats({ total: 0, completed: 0, inProgress: 0 });
                return;
            }

            setRoadmaps(roadmapData);

            const completedCount = roadmapData.filter((r: any) => r.progress === 100).length;
            const inProgressCount = roadmapData.filter(
                (r: any) => (r.progress ?? 0) < 100 && r.isActive !== false,
            ).length;

            setStats({
                total: roadmapData.length,
                completed: completedCount,
                inProgress: inProgressCount,
            });
        }).catch(err => {
            console.error('Error fetching data:', err);
            toast.error('Failed to load roadmaps. Please reload the page.');
        }).finally(() => {
            setLoading(false);
        });
    }, [token, router]);

    const getScoreBadgeColor = (score: number) => {
        const s = score ?? 0;
        if (s >= 80) return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20';
        if (s >= 60) return 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20';
        if (s >= 40) return 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20';
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
        <div className="min-h-screen bg-background text-foreground pb-12 md:pb-16 px-3 sm:px-4 md:px-6 pt-6 sm:pt-8 md:pt-10 relative overflow-x-hidden transition-colors duration-300">
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute top-0 right-0 w-[min(100%,36rem)] h-[36rem] bg-cyan-500/[0.07] dark:bg-cyan-500/[0.04] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[min(100%,28rem)] h-[28rem] bg-violet-500/[0.06] dark:bg-violet-500/[0.03] rounded-full blur-[100px]" />
            </div>

            <div className="container max-w-5xl xl:max-w-6xl mx-auto relative z-10">
                <div className="mb-8 md:mb-12 space-y-6 md:space-y-8">
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-gradient-to-br from-card/95 via-card/70 to-background/80 shadow-lg shadow-black/[0.03] dark:shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-cyan-500/12 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
                        <div className="relative p-5 sm:p-7 md:p-9">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="min-w-0 space-y-3">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                                        <Sparkles className="h-3.5 w-3.5 opacity-80" />
                                        Your workspace
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1] text-foreground">
                                        Welcome back, <span className="text-gradient">{user?.name || 'Guest'}</span>
                                    </h1>
                                    <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
                                        Track roadmap progress, readiness, and next steps—all in one place.
                                    </p>
                                </div>
                                <Link href="/upload" className="shrink-0 w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto h-11 md:h-12 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 border-0 transition-all hover:shadow-cyan-500/40">
                                        <PlusCircle className="mr-2 h-5 w-5" />
                                        Create roadmap
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4 md:gap-5">
                        <Card className="group relative h-full overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-cyan-500/35 hover:shadow-md dark:bg-card/40 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/[0.06] opacity-0 transition-opacity group-hover:opacity-100" />
                            <CardContent className="relative z-10 pt-5 pb-5 md:pt-6 md:pb-6">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Total</p>
                                        <p className="mt-1 text-3xl font-bold tabular-nums text-foreground md:text-4xl group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                            {loading ? '—' : stats.total}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">Roadmaps</p>
                                    </div>
                                    <div className="rounded-2xl bg-cyan-500/10 p-3.5 ring-1 ring-cyan-500/15 transition-transform group-hover:scale-105">
                                        <Target className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group relative h-full overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-blue-500/35 hover:shadow-md dark:bg-card/40 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/[0.06] opacity-0 transition-opacity group-hover:opacity-100" />
                            <CardContent className="relative z-10 pt-5 pb-5 md:pt-6 md:pb-6">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Active</p>
                                        <p className="mt-1 text-3xl font-bold tabular-nums text-foreground md:text-4xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {loading ? '—' : stats.inProgress}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">In progress</p>
                                    </div>
                                    <div className="rounded-2xl bg-blue-500/10 p-3.5 ring-1 ring-blue-500/15 transition-transform group-hover:scale-105">
                                        <Zap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group relative h-full overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-emerald-500/35 hover:shadow-md dark:bg-card/40 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/[0.06] opacity-0 transition-opacity group-hover:opacity-100" />
                            <CardContent className="relative z-10 pt-5 pb-5 md:pt-6 md:pb-6">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Done</p>
                                        <p className="mt-1 text-3xl font-bold tabular-nums text-foreground md:text-4xl group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {loading ? '—' : stats.completed}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">Completed</p>
                                    </div>
                                    <div className="rounded-2xl bg-emerald-500/10 p-3.5 ring-1 ring-emerald-500/15 transition-transform group-hover:scale-105">
                                        <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-10 md:mt-14">
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                        <h2 className="flex items-center gap-3 text-xl font-bold text-foreground sm:text-2xl md:text-3xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <span className="inline-flex h-9 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-violet-600 to-cyan-500" aria-hidden />
                            <span className="flex items-center gap-2 min-w-0">
                                <Route className="h-6 w-6 shrink-0 text-cyan-600 dark:text-cyan-400" />
                                <span className="truncate">Your roadmaps</span>
                            </span>
                        </h2>
                        {!loading && roadmaps.length > 0 && (
                            <p className="text-sm text-muted-foreground pl-[1.125rem] sm:pl-0">
                                {roadmaps.length} {roadmaps.length === 1 ? 'plan' : 'plans'} · tap a card to open
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-[17rem] rounded-2xl border border-border/60 bg-card/80 p-6 space-y-4 shadow-inner"
                                >
                                    <Skeleton className="h-6 w-4/5 rounded-lg bg-muted" />
                                    <Skeleton className="h-4 w-2/5 rounded-md bg-muted" />
                                    <div className="space-y-2 pt-6">
                                        <Skeleton className="h-2.5 w-full rounded-full bg-muted" />
                                        <Skeleton className="h-2.5 w-4/5 rounded-full bg-muted" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : roadmaps.length === 0 ? (
                        <Card className="relative overflow-hidden border border-border/60 bg-gradient-to-br from-card via-card to-muted/20 animate-in fade-in duration-700 delay-300 shadow-lg">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(6,182,212,0.08),transparent)]" />
                            <CardContent className="relative text-center py-14 md:py-20 px-4">
                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/50">
                                    <BookOpen className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">No roadmaps yet</h3>
                                <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                                    Create your first AI roadmap—upload a resume for a personalized path, or start with a role-only plan.
                                </p>
                                <Link href="/upload">
                                    <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold h-11 md:h-12 px-8 shadow-lg shadow-cyan-500/25 border-0">
                                        <PlusCircle className="mr-2 h-5 w-5" />
                                        Create your first roadmap
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-5 sm:gap-6 md:gap-6 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {roadmaps.map((r: any, idx: number) => {
                                const planProgress = Math.min(100, Math.max(0, Number(r.progress) || 0));
                                const readinessScore = Math.min(99, Math.max(0, Number(r.readinessScore) || 0));
                                return (
                                <div
                                    key={r.id}
                                    className="relative group h-full"
                                >
                                    <Link href={`/roadmap/${r.id}`} className="block h-full">
                                        <Card className="relative h-full rounded-2xl border border-border/50 bg-gradient-to-br from-card to-muted/25 hover:to-muted/40 hover:border-cyan-500/45 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer overflow-hidden animate-in fade-in slide-in-from-bottom-4 shadow-sm" style={{ transitionDelay: `${(idx % 3) * 100 + 100}ms` }}>

                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/[0.06] to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                            <CardHeader className="pb-2 relative z-10 pt-5 px-5">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="space-y-1.5 flex-1 pr-10 min-w-0">
                                                        <CardTitle className="text-lg font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                                                            {r.careerGoal}
                                                        </CardTitle>
                                                        <CardDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-1">
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500/60" />
                                                                {new Date(r.createdAt).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                })}
                                                            </span>
                                                            {r.targetCompany && (
                                                                <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground/80 truncate max-w-[10rem]">
                                                                    {r.targetCompany}
                                                                </span>
                                                            )}
                                                        </CardDescription>
                                                    </div>

                                                    <div
                                                        className={`flex-shrink-0 w-[3.25rem] h-[3.25rem] rounded-2xl flex flex-col items-center justify-center border ${r.isResumeBased ? getScoreBadgeColor(readinessScore) : 'bg-muted/40 text-foreground border-border/60'}`}
                                                        title={r.isResumeBased ? 'AI readiness' : 'Plan completion'}
                                                    >
                                                        <span className="text-sm font-bold leading-none tabular-nums">
                                                            {r.isResumeBased ? readinessScore : planProgress}
                                                            {r.isResumeBased ? '' : '%'}
                                                        </span>
                                                        <span className="text-[9px] font-semibold uppercase tracking-wide opacity-80 leading-none mt-1">
                                                            {r.isResumeBased ? 'AI' : 'Plan'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="space-y-4 pb-5 relative z-10 px-5">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">Plan progress</span>
                                                        <span className="font-bold tabular-nums text-cyan-600 dark:text-cyan-400">{planProgress}%</span>
                                                    </div>
                                                    <div className="h-2.5 bg-muted/60 rounded-full overflow-hidden ring-1 ring-border/30">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                                                            style={{ width: `${planProgress}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {r.isResumeBased && (
                                                    <p className="text-[10px] text-muted-foreground">
                                                        Readiness <span className="font-semibold text-foreground/90 tabular-nums">{readinessScore}/99</span>
                                                    </p>
                                                )}

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
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Toaster position="top-center" richColors theme="dark" />
        </div>
    );
}
