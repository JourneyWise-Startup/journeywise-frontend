"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, FileText, Zap, CheckCircle2, Briefcase, Building2, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [jobRole, setJobRole] = useState('');
    const [targetCompany, setTargetCompany] = useState('');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const { token } = useAuth();
    const router = useRouter();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf' || droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setFile(droppedFile);
                toast.success(`📄 ${droppedFile.name} uploaded`);
            } else {
                toast.error('Please upload a PDF or DOCX file');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setFile(selectedFile);
                toast.success(`📄 ${selectedFile.name} uploaded`);
            } else {
                toast.error('Please upload a PDF or DOCX file');
            }
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!jobRole.trim()) {
            toast.error('Please enter your target job role');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        formData.append('jobRole', jobRole);
        if (targetCompany.trim()) {
            formData.append('targetCompany', targetCompany);
        }

        try {
            if (!token) {
                toast.error('Please login first');
                router.push('/login');
                return;
            }

            const toastMessage = file
                ? '🔍 Analyzing your resume with AI...'
                : '🛣️ Creating your career roadmap...';
            toast.loading(toastMessage, { id: 'upload' });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmap/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to generate roadmap');
            }

            const data = await res.json();

            toast.success('✅ Roadmap generated successfully!', { id: 'upload' });

            setTimeout(() => {
                router.push(`/roadmap/${data.id}`);
            }, 500);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Failed to generate roadmap. Please try again.', { id: 'upload' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-12 md:py-20 px-3 sm:px-4 md:px-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Effects - Matches Home Page */}
            <div className="absolute top-0 -right-40 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl md:blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-3xl md:blur-[100px] pointer-events-none" />

            <div className="container max-w-3xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-10 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-block mb-4">
                        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                            <Zap className="h-10 w-10 md:h-12 md:w-12 text-cyan-600 dark:text-cyan-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 dark:from-cyan-400 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                        Create Your AI Roadmap
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                        Upload your resume and let our advanced AI analyze it to create a personalized career roadmap with actionable insights
                    </p>
                </div>

                {/* Resume Types Guide */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 px-2">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/50">
                        <p className="text-xs md:text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1.5 mb-1">
                            ✅ We Support ALL Resume Types
                        </p>
                        <p className="text-2xs md:text-xs text-muted-foreground">Tech backgrounds • Non-technical • Web Dev • Mobile/Android • Data Analysis • Career changers</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
                        <p className="text-xs md:text-sm font-semibold text-purple-700 dark:text-purple-400 flex items-center gap-1.5 mb-1">
                            🎯 AI Coaching Works Like a Personal Mentor
                        </p>
                        <p className="text-2xs md:text-xs text-muted-foreground">Analyzes your background • Creates custom pathway • Suggests realistic timeline</p>
                    </div>
                </div>

                {/* Two Paths Comparison with Enhanced Styling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 px-2">
                    <div className="group p-5 rounded-xl bg-gradient-to-br from-blue-50/80 via-cyan-50/50 to-blue-100/30 dark:from-blue-950/40 dark:via-cyan-950/30 dark:to-blue-950/20 border-2 border-blue-200/60 dark:border-blue-800/40 hover:border-blue-400/80 dark:hover:border-blue-700/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-blue-600/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-lg">📄</span>
                            </div>
                            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">With Resume</p>
                            <div className="ml-auto px-2 py-0.5 bg-blue-500/20 rounded-full">
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Recommended</span>
                            </div>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-2">
                            <li className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
                                <span className="text-cyan-600 dark:text-cyan-400 font-bold">✓</span>
                                <span>Personalized skill gap analysis</span>
                            </li>
                            <li className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
                                <span className="text-cyan-600 dark:text-cyan-400 font-bold">✓</span>
                                <span>Readiness scoring (0-99)</span>
                            </li>
                            <li className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
                                <span className="text-cyan-600 dark:text-cyan-400 font-bold">✓</span>
                                <span>Your current strengths highlighted</span>
                            </li>
                            <li className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
                                <span className="text-cyan-600 dark:text-cyan-400 font-bold">✓</span>
                                <span>Realistic timeline based on background</span>
                            </li>
                            <li className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
                                <span className="text-cyan-600 dark:text-cyan-400 font-bold">✓</span>
                                <span>Targeted interview prep</span>
                            </li>
                        </ul>
                    </div>
                    <div className="group p-5 rounded-xl bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-amber-100/30 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/20 border-2 border-amber-200/60 dark:border-amber-800/40 hover:border-amber-400/80 dark:hover:border-amber-700/60 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-amber-600/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-lg">🎯</span>
                            </div>
                            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">Without Resume</p>
                            <div className="ml-auto px-2 py-0.5 bg-amber-500/20 rounded-full">
                                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Quick Start</span>
                            </div>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-2">
                            <li className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
                                <span className="text-amber-600 dark:text-amber-400 font-bold">✓</span>
                                <span>Industry-standard roadmap</span>
                            </li>
                            <li className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
                                <span className="text-amber-600 dark:text-amber-400 font-bold">✓</span>
                                <span>Market research best practices</span>
                            </li>
                            <li className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
                                <span className="text-amber-600 dark:text-amber-400 font-bold">✓</span>
                                <span>Structured learning path</span>
                            </li>
                            <li className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
                                <span className="text-amber-600 dark:text-amber-400 font-bold">✓</span>
                                <span>General skill progression</span>
                            </li>
                            <li className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
                                <span className="text-amber-600 dark:text-amber-400 font-bold">✓</span>
                                <span>Company-specific if provided</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Card className="border border-border bg-card shadow-2xl shadow-cyan-500/5 hover:border-cyan-500/40 transition-all animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <CardContent className="pt-5 sm:pt-6 md:pt-8 px-4 sm:px-5 md:px-6">
                        <form onSubmit={handleUpload} className="space-y-5 sm:space-y-6 md:space-y-8">
                            {/* Career Goal Input */}
                            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                                <Label className="text-xs sm:text-sm md:text-base font-semibold text-foreground flex items-center gap-2">
                                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-cyan-600 dark:text-cyan-500 flex-shrink-0" />
                                    Your Target Job Role
                                    <span className="text-2xs sm:text-xs text-red-500 font-bold">*</span>
                                </Label>
                                <Input
                                    placeholder="e.g., Full Stack Developer, Data Scientist, Product Manager"
                                    value={jobRole}
                                    onChange={e => setJobRole(e.target.value)}
                                    required
                                    className="text-xs sm:text-sm md:text-base h-9 sm:h-10 md:h-12 bg-muted/30 border border-input focus:border-cyan-500 focus:ring-cyan-500 rounded-lg transition-all"
                                />
                                <div className="mt-2 p-2 bg-blue-50/50 dark:bg-blue-950/20 rounded border border-blue-100/50 dark:border-blue-900/30">
                                    <p className="text-2xs sm:text-xs text-muted-foreground">
                                        <strong>Example roles:</strong> If you're from commerce, try "Data Analyst" • From non-tech, try "Jr. Web Developer" • From product, try "Product Manager" • We'll create a custom roadmap for ANY role
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 p-3 sm:p-4 md:p-5 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/50">
                                <Label className="text-xs sm:text-sm md:text-base font-semibold text-foreground flex items-center gap-2">
                                    <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-500 flex-shrink-0" />
                                    Target Company (Optional)
                                </Label>
                                <Input
                                    placeholder="e.g., Google, Amazon, Flipkart, Microsoft, Accenture"
                                    value={targetCompany}
                                    onChange={e => setTargetCompany(e.target.value)}
                                    className="text-xs sm:text-sm md:text-base h-9 sm:h-10 md:h-12 bg-white dark:bg-black/20 border border-input focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all"
                                />
                                <div className="space-y-1.5 text-2xs sm:text-xs">
                                    <p className="text-muted-foreground">
                                        ✨ <strong>Get company-specific insights:</strong> Interview patterns, culture analysis, tech stack recommendations, and insider tips tailored to this company.
                                    </p>
                                    <p className="text-blue-700 dark:text-blue-400 font-medium">
                                        💡 Tip: You can also add/change the company later in the Company Insider tab!
                                    </p>
                                </div>
                            </div>

                            {/* Resume Upload - Premium Drag & Drop */}
                            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                                <Label className="text-xs sm:text-sm md:text-base font-semibold text-foreground flex items-center gap-2">
                                    <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-cyan-600 dark:text-cyan-500 flex-shrink-0" />
                                    Upload Your Resume (PDF or DOCX) - Optional
                                    <span className="text-2xs sm:text-xs text-muted-foreground font-normal">(recommended for better insights)</span>
                                </Label>
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative group rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden ${dragActive
                                            ? 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                                            : 'border-border hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-muted/50'
                                        }`}
                                >
                                    {/* Gradient background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 dark:opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${dragActive && 'opacity-100'}`} />

                                    {/* Content */}
                                    <div className="relative z-10 p-6 sm:p-8 md:p-10">
                                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                                            {!file ? (
                                                <>
                                                    {/* Upload Icon Animation */}
                                                    <div className={`p-3 sm:p-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 transition-all duration-300 group-hover:scale-110 ${dragActive && 'scale-110'}`}>
                                                        <Upload className={`h-6 w-6 sm:h-8 sm:w-8 text-cyan-600 dark:text-cyan-400 transition-all duration-300 ${dragActive && 'animate-bounce'}`} />
                                                    </div>

                                                    {/* Text */}
                                                    <div className="text-center">
                                                        <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-foreground mb-1">
                                                            {dragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                                                        </p>
                                                        <p className="text-2xs sm:text-xs text-slate-600 dark:text-muted-foreground">or click below to select</p>
                                                    </div>

                                                    {/* File Input */}
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.docx"
                                                        onChange={e => setFile(e.target.files?.[0] || null)}
                                                        className="hidden"
                                                        id="file-upload"
                                                    />
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="mt-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/40 hover:scale-105 active:scale-95"
                                                    >
                                                        Choose File
                                                    </label>

                                                    {/* Support text */}
                                                    <p className="text-2xs sm:text-xs text-muted-foreground text-center">
                                                        <span className="font-medium">Max 10MB</span> • PDF or DOCX
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    {/* File Selected State */}
                                                    <div className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 animate-in scale-in duration-300">
                                                        <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
                                                    </div>

                                                    {/* File info */}
                                                    <div className="text-center space-y-2 sm:space-y-3">
                                                        <div>
                                                            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-foreground truncate max-w-xs">{file.name}</p>
                                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>

                                                        {/* Remove button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setFile(null)}
                                                            className="text-2xs sm:text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium transition-colors"
                                                        >
                                                            Choose Different File
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white h-9 sm:h-10 md:h-12 text-xs sm:text-sm md:text-base font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 animate-spin" />
                                        <span className="hidden sm:inline">Analyzing with AI...</span>
                                        <span className="sm:hidden">Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                                        <span className="hidden sm:inline">Generate My Career Roadmap</span>
                                        <span className="sm:hidden">Generate Roadmap</span>
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Info Box - Enhanced */}
                <div className="mt-5 sm:mt-6 md:mt-8 p-4 sm:p-5 md:p-6 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/30 dark:to-blue-950/30 border-2 border-cyan-200/50 dark:border-cyan-800/40 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 hover:border-cyan-300/80 dark:hover:border-cyan-700/60 transition-all duration-300 shadow-sm hover:shadow-cyan-500/10">
                    <div className="text-xs sm:text-sm md:text-base text-center font-medium flex items-center justify-center gap-3 flex-wrap">
                        <div className="p-1.5 bg-cyan-600/10 rounded-full">
                            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                        </div>
                        <span className="text-foreground">✨ <strong>Resume Optional:</strong> Boost your personalization by uploading your resume</span>
                    </div>
                </div>

                {/* Features Highlight - Enhanced */}
                <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <div className="p-4 sm:p-5 md:p-6 rounded-xl bg-gradient-to-br from-cyan-50/60 to-blue-50/40 dark:from-cyan-950/30 dark:to-blue-950/20 border-2 border-cyan-200/50 dark:border-cyan-800/30 hover:border-cyan-400/80 dark:hover:border-cyan-700/60 text-center hover:shadow-lg hover:shadow-cyan-500/15 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4" style={{ transitionDelay: '300ms' }}>
                        <div className="inline-block p-2.5 sm:p-3 md:p-3.5 rounded-lg bg-gradient-to-br from-cyan-500/15 to-cyan-600/10 border border-cyan-500/30 mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <Zap className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <h3 className="font-bold text-foreground mb-1.5 text-sm sm:text-base md:text-lg">AI Analysis</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Advanced resume parsing with Gemini AI</p>
                    </div>

                    <div className="p-4 sm:p-5 md:p-6 rounded-xl bg-gradient-to-br from-blue-50/60 to-indigo-50/40 dark:from-blue-950/30 dark:to-indigo-950/20 border-2 border-blue-200/50 dark:border-blue-800/30 hover:border-blue-400/80 dark:hover:border-blue-700/60 text-center hover:shadow-lg hover:shadow-blue-500/15 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4" style={{ transitionDelay: '400ms' }}>
                        <div className="inline-block p-2.5 sm:p-3 md:p-3.5 rounded-lg bg-gradient-to-br from-blue-500/15 to-blue-600/10 border border-blue-500/30 mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-bold text-foreground mb-1.5 text-sm sm:text-base md:text-lg">Personalized</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Custom roadmap tailored to you</p>
                    </div>

                    <div className="p-4 sm:p-5 md:p-6 rounded-xl bg-gradient-to-br from-purple-50/60 to-pink-50/40 dark:from-purple-950/30 dark:to-pink-950/20 border-2 border-purple-200/50 dark:border-purple-800/30 hover:border-purple-400/80 dark:hover:border-purple-700/60 text-center hover:shadow-lg hover:shadow-purple-500/15 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4" style={{ transitionDelay: '500ms' }}>
                        <div className="inline-block p-2.5 sm:p-3 md:p-3.5 rounded-lg bg-gradient-to-br from-purple-500/15 to-purple-600/10 border border-purple-500/30 mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <Upload className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-bold text-foreground mb-1.5 text-sm sm:text-base md:text-lg">Actionable</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Clear milestones and resources</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
