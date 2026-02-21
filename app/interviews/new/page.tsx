"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Rocket, Target, AlertCircle, Upload, FileText, X, CheckCircle2, BrainCircuit, Search, LineChart, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function NewInterviewPrep() {
    const router = useRouter();
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [interviewStages, setInterviewStages] = useState<string[]>([
        '📞 Screening / Recruiter Call',
        '💻 Technical Round',
        '🏗️ System Design',
        '👔 Managerial / Behavioral',
        '🎯 HR Round'
    ]);
    const [uploadedResume, setUploadedResume] = useState<{ id: string; name: string } | null>(null);
    const [formData, setFormData] = useState({
        jobRole: '',
        companyName: '',
        jobDescription: '',
        interviewStage: '',
        experienceLevel: '1-3',
        resumeText: '',
        resumeFileId: ''
    });

    const loadingMessages = [
        { text: "Analyzing Job Description...", icon: <Search className="h-6 w-6 text-blue-500" /> },
        { text: "Decoding Company Culture...", icon: <Building2 className="h-6 w-6 text-purple-500" /> },
        { text: "Scanning Resume for Gaps...", icon: <FileText className="h-6 w-6 text-orange-500" /> },
        { text: "Identifying Critical Skills...", icon: <Target className="h-6 w-6 text-red-500" /> },
        { text: "Generating Battle Plan...", icon: <BrainCircuit className="h-6 w-6 text-pink-500" /> },
        { text: "Finalizing Strategy...", icon: <Sparkles className="h-6 w-6 text-yellow-500" /> }
    ];

    // Cycle through loading messages
    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [loading]);

    // Fetch interview stages based on company and job role
    useEffect(() => {
        const fetchInterviewStages = async () => {
            if (formData.companyName.trim().length === 0 || formData.jobRole.trim().length === 0) {
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/interviews/stages?company=${encodeURIComponent(formData.companyName)}&jobRole=${encodeURIComponent(formData.jobRole)}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setInterviewStages(data.stages);
                    // Auto-select first stage
                    if (data.stages.length > 0 && !formData.interviewStage) {
                        setFormData(prev => ({ ...prev, interviewStage: data.stages[0] }));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch interview stages:', error);
                // Keep default stages on error
            }
        };

        // Debounce the fetch to avoid too many requests
        const timer = setTimeout(fetchInterviewStages, 500);
        return () => clearTimeout(timer);
    }, [formData.companyName, formData.jobRole, token]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Resume file must be less than 10MB');
            return;
        }

        setUploadingResume(true);

        try {
            const formDataForUpload = new FormData();
            formDataForUpload.append('resume', file);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/upload-resume`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataForUpload
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to upload resume');
            }

            const data = await response.json();
            setUploadedResume({ id: data.id, name: data.originalName });
            setFormData(prev => ({
                ...prev,
                resumeFileId: data.id,
                resumeText: data.extractedText
            }));
            toast.success('Resume uploaded and processed successfully!');
        } catch (error: any) {
            console.error('Resume upload error:', error);
            toast.error(error.message || 'Failed to upload resume');
        } finally {
            setUploadingResume(false);
        }
    };

    const handleRemoveResume = () => {
        setUploadedResume(null);
        setFormData(prev => ({
            ...prev,
            resumeFileId: '',
            resumeText: ''
        }));
        const fileInput = document.getElementById('resume-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        toast.success('Resume removed');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.jobRole || !formData.companyName || !formData.jobDescription) {
            toast.error('Please fill in all required fields (Job Role, Company, Job Description)');
            return;
        }

        if (!formData.interviewStage) {
            toast.error('Please select an interview stage');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to create interview prep');

            const data = await response.json();
            toast.success('🚀 War Room Created! Entering...');
            // Redirect to the war room
            router.push(`/interviews/${data.id}`);
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
            setLoading(false);
        }
    };



    // Custom Full Screen Loader
    if (loading) {
        return (
            <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="relative mx-auto w-32 h-32">
                        <div className="absolute inset-0 rounded-full border-t-4 border-cyan-500 animate-spin"></div>
                        <div className="absolute inset-4 rounded-full border-r-4 border-blue-500 animate-spin animation-delay-200"></div>
                        <div className="absolute inset-8 rounded-full border-b-4 border-purple-500 animate-spin animation-delay-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BrainCircuit className="h-10 w-10 text-cyan-600 animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                            Constructing Your War Room
                        </h2>

                        <div className="h-16 flex items-center justify-center">
                            <div key={loadingStep} className="flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
                                {loadingMessages[loadingStep].icon}
                                <span className="text-lg font-medium text-foreground">{loadingMessages[loadingStep].text}</span>
                            </div>
                        </div>

                        <div className="flex gap-1 justify-center mt-4">
                            {loadingMessages.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === loadingStep ? 'w-8 bg-cyan-500' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground max-w-xs mx-auto animate-pulse">
                        This usually takes 10-20 seconds. We are processing comprehensive insights for specific role requirements.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 md:px-8 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative z-10">
                {/* Header */}
                <div className="mb-10 text-center space-y-3">
                    <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-cyan-500/10 mb-2 border border-slate-100 dark:border-slate-800">
                        <Target className="h-8 w-8 text-cyan-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Crack This <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Interview</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Stop guessing. Start executing. Get a forensic analysis of your fit and a battle-tested strategy to win the offer.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Main Form - Left Col */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-800">
                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                                        <Rocket className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-slate-900 dark:text-white">Role & Company</CardTitle>
                                        <CardDescription>Tell us what you're targeting</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Role <span className="text-red-500">*</span></Label>
                                            <Input
                                                name="jobRole"
                                                placeholder="e.g. Senior Product Designer"
                                                required
                                                value={formData.jobRole}
                                                onChange={handleChange}
                                                className="h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                name="companyName"
                                                placeholder="e.g. Airbnb"
                                                required
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                className="h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Interview Stage</Label>
                                            <Select
                                                onValueChange={(val) => handleSelectChange('interviewStage', val)}
                                                value={formData.interviewStage}
                                            >
                                                <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                                                    <SelectValue placeholder="Select Stage" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {interviewStages.map((stage) => (
                                                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Experience Level</Label>
                                            <Select
                                                onValueChange={(val) => handleSelectChange('experienceLevel', val)}
                                                value={formData.experienceLevel}
                                            >
                                                <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                                                    <SelectValue placeholder="Select Level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0-1">Fresher (0-1 years)</SelectItem>
                                                    <SelectItem value="1-3">Junior (1-3 years)</SelectItem>
                                                    <SelectItem value="3-5">Mid-level (3-5 years)</SelectItem>
                                                    <SelectItem value="5+">Senior (5+ years)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Job Description (JD) <span className="text-red-500">*</span>
                                            </Label>
                                            <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                The Truth Source
                                            </span>
                                        </div>
                                        <Textarea
                                            name="jobDescription"
                                            placeholder="Paste the full JD here. The more detailed, the better the analysis."
                                            className="h-40 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-none font-mono text-sm leading-relaxed"
                                            required
                                            value={formData.jobDescription}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold h-14 text-lg shadow-lg shadow-cyan-500/20 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="animate-spin" /> Preparing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    Start Prep <Rocket className="h-5 w-5" />
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Resume Upload & Tips */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm ring-1 ring-slate-200 dark:ring-slate-800 h-full">
                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-purple-500" />
                                    Your Resume
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50 ${uploadedResume ? 'border-green-500/50 bg-green-50/30' : 'border-slate-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-600'}`}>
                                    {uploadedResume ? (
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm truncate max-w-[150px]">{uploadedResume.name}</p>
                                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Ready for analysis</p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleRemoveResume}
                                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center justify-center text-center gap-3">
                                            <input
                                                id="resume-input"
                                                type="file"
                                                accept=".pdf,.doc,.docx,.txt"
                                                onChange={handleResumeUpload}
                                                disabled={uploadingResume}
                                                className="hidden"
                                            />
                                            {uploadingResume ? (
                                                <Loader2 className="h-10 w-10 text-cyan-600 animate-spin" />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                                                    <Upload className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Upload Resume</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">PDF, DOCX max 10MB</p>
                                            </div>
                                        </label>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Or Paste Text</Label>
                                    </div>
                                    <Textarea
                                        name="resumeText"
                                        placeholder="Paste resume content here if upload fails..."
                                        className="h-24 resize-none text-xs font-mono bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                        value={formData.resumeText}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                                    <div className="flex gap-2">
                                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">Why upload?</p>
                                            <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 list-disc list-inside">
                                                <li>Compare your skills vs JD</li>
                                                <li>Find your "Critical Gaps"</li>
                                                <li>Get "Why Hire Me" scripts</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
