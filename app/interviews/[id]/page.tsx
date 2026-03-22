"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Briefcase, ArrowLeft, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast, Toaster } from 'sonner';
import { WarRoomContent } from './war-room';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function InterviewWarRoom() {
    const params = useParams();
    const router = useRouter();
    const { token, isAuthenticated } = useAuth();
    const [prep, setPrep] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !token) return;

        const fetchPrep = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setPrep(data);

                // Poll if still generating
                if (data.status === 'GENERATING') {
                    // Keep loading state TRUE while polling
                    setTimeout(fetchPrep, 3000);
                } else {
                    // Turn off loading once it's READY or FAILED
                    setLoading(false);
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPrep();
    }, [isAuthenticated, token, params.id]);

    const handleDelete = async () => {
        setIsDeleting(true);

        const confirmed = await new Promise<boolean>((resolve) => {
            toast.custom((t) => (
                <div className="relative w-full max-w-xs ">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl blur-2xl opacity-35 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-violet-500/40 rounded-2xl shadow-xl shadow-violet-500/20 p-3 md:p-3.5 space-y-2 backdrop-blur-2xl animate-in slide-in-from-top-8 fade-in duration-500 overflow-hidden group">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-b from-violet-600/20 to-transparent rounded-full blur-3xl opacity-40" />
                        <div className="absolute -bottom-40 right-0 w-96 h-96 bg-gradient-to-t from-indigo-600/20 to-transparent rounded-full blur-3xl opacity-40" />
                        <div className="relative z-10 flex gap-1.5 items-start">
                            <div className="flex-shrink-0 p-1.5 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 border-2 border-red-500/40 backdrop-blur-xl">
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm md:text-base font-bold text-white line-clamp-2">{prep.jobRole}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Permanent Delete</p>
                            </div>
                        </div>
                        <div className="relative z-10 bg-gradient-to-r from-red-600/10 to-pink-600/10 border-l-4 border-red-500 px-2 md:px-2.5 py-1.5 rounded-lg backdrop-blur-xl">
                            <div className="flex gap-1.5 items-start">
                                <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-red-200 font-semibold">Cannot be undone</p>
                            </div>
                        </div>
                        <div className="relative z-10 flex gap-1.5 pt-0">
                            <button
                                onClick={() => {
                                    toast.dismiss(t);
                                    resolve(false);
                                    setIsDeleting(false);
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

                                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${params.id}`, {
                                            method: 'DELETE',
                                            headers: { Authorization: `Bearer ${token}` }
                                        });

                                        toast.dismiss(loadingToast);

                                        if (res.ok) {
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
                                                                <p className="text-xs text-slate-400 mt-0.5">Redirecting...</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ), { duration: 2000 });

                                            setTimeout(() => router.push('/interviews'), 1000);
                                        } else {
                                            setIsDeleting(false);
                                            toast.error('Failed to delete');
                                        }
                                    } catch (error) {
                                        setIsDeleting(false);
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
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-background text-foreground">
                <div className="space-y-4 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto" />
                    <h2 className="text-2xl font-bold">Assembling Your War Room...</h2>
                    <p className="text-muted-foreground">AI is analyzing gaps, generating questions, and preparing strategies</p>
                </div>
            </div>
        );
    }

    if (error || !prep) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-red-200">
                    <CardContent className="pt-6 text-center space-y-4">
                        <Briefcase className="h-12 w-12 text-red-500 mx-auto" />
                        <h2 className="text-xl font-bold">Failed to Load War Room</h2>
                        <p className="text-sm text-muted-foreground">{error || 'Interview prep not found'}</p>
                        <Link href="/interviews">
                            <Button className="w-full">Back to Interviews</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container max-w-7xl mx-auto px-4 py-4 md:py-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push('/interviews')}
                                className="shrink-0"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>

                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold text-sm">CI</span>
                                </div>
                                <div className="min-w-0">
                                    <h1 className="font-bold text-lg md:text-xl truncate">{prep.jobRole}</h1>
                                    <p className="text-sm text-muted-foreground truncate">{prep.companyName}</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="shrink-0"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            <span className="hidden sm:inline">Delete</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container max-w-7xl mx-auto px-4 py-8">
                <WarRoomContent prep={prep} token={token} prepId={params.id} />
            </main>
            <Toaster position="top-center" richColors theme="dark" />
        </div>
    );
}
