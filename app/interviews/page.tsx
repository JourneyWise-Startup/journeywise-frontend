"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ChevronRight, Briefcase, Building, Clock, Loader2, LinkIcon, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function InterviewsDashboard() {
    const [preps, setPreps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && token) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setPreps(data);
                    } else {
                        console.error('Expected array, got:', data);
                        setPreps([]);
                        if (data && data.statusCode === 401) {
                            // Handle unauthorized specifically if needed
                            // but AuthGuard should handle it.
                        }
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        } else if (!isAuthenticated) {
            // router.push('/login'); // AuthGuard handles this usually
        }
    }, [isAuthenticated, token]);

    if (loading) return <div className="min-h-screen bg-background flex justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;



    const handleDelete = async (e: React.MouseEvent, id: string, jobRole: string) => {
        e.preventDefault();
        e.stopPropagation();

        setDeleting(true);

        // Custom Toast Promise
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
                                <h3 className="text-sm md:text-base font-bold text-white line-clamp-2">{jobRole}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Permanent Delete</p>
                            </div>
                        </div>

                        {/* Warning box */}
                        <div className="relative z-10 bg-gradient-to-r from-red-600/10 to-pink-600/10 border-l-4 border-red-500 px-2 md:px-2.5 py-1.5 rounded-lg backdrop-blur-xl">
                            <div className="flex gap-1.5 items-start">
                                <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-red-200 font-semibold">Cannot be undone</p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="relative z-10 flex gap-1.5 pt-0">
                            <button
                                onClick={() => {
                                    toast.dismiss(t);
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

                                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${id}`, {
                                            method: 'DELETE',
                                            headers: { Authorization: `Bearer ${token}` }
                                        });

                                        toast.dismiss(loadingToast);

                                        if (res.ok) {
                                            setPreps(preps.filter(p => p.id !== id));
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
                                                                <p className="text-xs text-slate-400 mt-0.5">Removed from war room</p>
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
                                        } else {
                                            console.error('Failed to delete');
                                            toast.error('Failed to delete');
                                        }
                                    } catch (error) {
                                        console.error('Error deleting:', error);
                                        toast.error('Error occurred');
                                    }
                                }}
                                className="flex-1 h-7 px-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-red-500/40 border border-red-500/50 transition-all duration-300 text-xs hover:scale-[1.02] active:scale-95 disabled:opacity-50 backdrop-blur-sm flex items-center justify-center gap-1.5"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ), { duration: Infinity });
        });

        if (!deleting) setDeleting(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-10 md:py-12 px-3 sm:px-4 md:px-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Effects */}
            <div className="absolute top-0 -right-40 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl md:blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-3xl md:blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="flex justify-between items-start md:items-center mb-8 md:mb-12 flex-col md:flex-row gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 dark:from-cyan-400 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent mb-2">
                            Interview War Room
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Manage your active interview preparations and track progress.
                        </p>
                    </div>
                    <Link href="/interviews/new">
                        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/30 h-10 md:h-11 text-sm md:text-base whitespace-nowrap">
                            <Plus className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                            <span className="hidden sm:inline">New Interview Prep</span>
                            <span className="sm:hidden">New Prep</span>
                        </Button>
                    </Link>
                </div>

                {preps.length === 0 ? (
                    <Card className="border border-border bg-card text-center py-12 md:py-16 animate-in fade-in duration-700 delay-100 shadow-sm">
                        <CardHeader>
                            <div className="mx-auto bg-muted p-4 rounded-full mb-4">
                                <Briefcase className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-xl md:text-2xl font-semibold text-foreground mb-2">No active war rooms</CardTitle>
                            <CardDescription className="max-w-md mx-auto mb-6 text-sm md:text-base">
                                You haven't started any interview preparations yet. Add a new interview to get AI-powered insights and mock practice.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/interviews/new">
                                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white h-10 md:h-11 text-sm md:text-base">Start Preparing</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {preps.map((prep, idx) => (
                            <Link href={`/interviews/${prep.id}`} key={prep.id}>
                                <Card className="h-full border border-border/50 bg-gradient-to-br from-card to-muted/30 hover:to-muted/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer group animate-in fade-in slide-in-from-bottom-4 shadow-sm hover:shadow-md relative overflow-hidden" style={{ transitionDelay: `${(idx % 3) * 100 + 200}ms` }}>
                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    <div
                                        onClick={(e) => handleDelete(e, prep.id, prep.jobRole)}
                                        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-red-500/10 text-muted-foreground hover:text-red-600 border border-transparent hover:border-red-200 transition-all z-20 shadow-sm"
                                        title="Delete Interview Prep"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </div>

                                    <CardHeader className="pb-3 md:pb-4 relative z-10">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1 min-w-0 pr-8">
                                                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2 border ${prep.status === 'READY' ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20' :
                                                    prep.status === 'GENERATING' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20' :
                                                        'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20'
                                                    }`}>
                                                    {prep.status === 'READY' ? 'War Room Ready' : prep.status}
                                                </div>
                                                <CardTitle className="text-lg font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                                                    {prep.jobRole}
                                                </CardTitle>
                                                <CardDescription className="flex items-center mt-1 text-sm text-muted-foreground">
                                                    <Building className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                                    <span className="truncate">{prep.companyName}</span>
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-4 space-y-4 relative z-10">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="bg-muted/50 p-2 rounded-lg">
                                                <span className="text-xs text-muted-foreground block mb-0.5">Stage</span>
                                                <span className="font-medium truncate block" title={prep.interviewStage}>{prep.interviewStage || 'General'}</span>
                                            </div>
                                            <div className="bg-muted/50 p-2 rounded-lg">
                                                <span className="text-xs text-muted-foreground block mb-0.5">Created</span>
                                                <span className="font-medium truncate block">{new Date(prep.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <Button variant="outline" className="w-full group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-600 transition-all duration-300 justify-between">
                                                Enter War Room
                                                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Toaster position="top-center" richColors theme="dark" />
        </div>
    );
}
