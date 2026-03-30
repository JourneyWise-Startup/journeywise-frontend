"use client"
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, UploadCloud, FileCheck, AlertTriangle, 
  CheckCircle2, XCircle, ChevronRight, Zap, Target, BarChart, Download, Building, Monitor, ArrowRight, Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast, Toaster } from 'sonner';

// Import PDF generation tools
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResumeAnalyzer() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);
    
    // Resume Builder states
    const [activeTab, setActiveTab] = useState<'analysis' | 'market' | 'builder'>('analysis');
    const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern'>('classic');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const resumeRef = useRef<HTMLDivElement>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { token } = useAuth();
    const router = useRouter();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (selectedFile: File) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!validTypes.includes(selectedFile.type)) {
            toast.error('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error('File is too large. Maximum size is 5MB.');
            return;
        }
        setFile(selectedFile);
        setResult(null); // Reset previous result if any
        setActiveTab('analysis'); 
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleAnalyze = async () => {
        if (!file) {
            toast.error("Please upload a resume first.");
            return;
        }

        if (!token) {
            toast.error("Please login to use the Resume Analyzer.");
            router.push('/login');
            return;
        }

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (jobDescription.trim()) {
                formData.append('jobDescription', jobDescription);
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/analyze`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to analyze resume');
            }

            const data = await res.json();
            setResult(data);
            toast.success("Analysis complete! Check out your optimized templates.");
        } catch (error: any) {
            console.error('Analysis error:', error);
            toast.error(error.message || "Something went wrong.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const downloadPDF = async () => {
        if (!resumeRef.current) return;
        setIsGeneratingPDF(true);
        try {
            const element = resumeRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false
            });
            const data = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4' // standard Indian A4 size perfectly maps
            });

            const imgProperties = pdf.getImageProperties(data);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
            
            pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`JourneyWise_Optimized_${selectedTemplate}_Resume.pdf`);
            toast.success("Resume downloaded successfully!");
        } catch (error) {
            console.error('PDF Generation Error:', error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500 stroke-emerald-500';
        if (score >= 60) return 'text-blue-500 stroke-blue-500';
        if (score >= 40) return 'text-amber-500 stroke-amber-500';
        return 'text-red-500 stroke-red-500';
    };

    // Render the selected template
    const renderResumeTemplate = () => {
        if (!result || !result.optimizedResumeData) return null;
        const data = result.optimizedResumeData;

        if (selectedTemplate === 'classic') {
            return (
                <div ref={resumeRef} className="bg-white text-black p-8 md:p-12 w-full max-w-[210mm] mx-auto min-h-[297mm] shadow-sm font-serif">
                    <div className="text-center border-b-2 border-black pb-4 mb-6">
                        <h1 className="text-3xl font-bold uppercase tracking-wider">{data.name || 'Your Name'}</h1>
                        <p className="text-sm mt-2">{data.contact || 'contact@email.com | +91 9876543210'}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 uppercase tracking-wide">Professional Summary</h2>
                        <p className="text-sm text-justify leading-relaxed">{data.summary}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wide">Professional Experience</h2>
                        {data.experience && data.experience.map((exp: any, i: number) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">{exp.role}</h3>
                                    <span className="text-sm italic">{exp.duration}</span>
                                </div>
                                <div className="text-sm font-semibold mb-2">{exp.company}</div>
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                    {exp.bullets && exp.bullets.map((bullet: string, j: number) => (
                                        <li key={j} className="text-justify">{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {data.projects && data.projects.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wide">Key Projects</h2>
                            {data.projects.map((proj: any, i: number) => (
                                <div key={i} className="mb-4">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base">{proj.name}</h3>
                                        <span className="text-sm italic">{proj.techStack}</span>
                                    </div>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        {proj.bullets && proj.bullets.map((bullet: string, j: number) => (
                                            <li key={j} className="text-justify">{bullet}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mb-6">
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wide">Skills</h2>
                        <div className="flex flex-wrap gap-2 text-sm">
                            {data.skills && data.skills.map((skill: string, i: number) => (
                                <span key={i} className="bg-gray-100 px-2 py-1 rounded border border-gray-200">{skill}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wide">Education</h2>
                        {data.education && data.education.map((edu: any, i: number) => (
                            <div key={i} className="mb-2 flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                                    <p className="text-sm">{edu.institution}</p>
                                </div>
                                <span className="text-sm italic">{edu.duration}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Modern Template (Tech/Startup format)
        return (
            <div ref={resumeRef} className="bg-white text-gray-800 w-full max-w-[210mm] mx-auto min-h-[297mm] shadow-sm font-sans flex flex-col">
                <div className="bg-slate-900 text-white p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{data.name || 'Your Name'}</h1>
                        <p className="text-blue-400 mt-1 font-medium">{data.experience?.[0]?.role || 'Professional'}</p>
                    </div>
                    <div className="text-left md:text-right mt-4 md:mt-0 text-sm opacity-90">
                        <p>{data.contact || 'contact@email.com'}</p>
                        <p>India</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row flex-1">
                    {/* Left Column */}
                    <div className="w-full md:w-1/3 bg-slate-50 p-8 border-r border-gray-200">
                        <div className="mb-8">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Summary</h2>
                            <p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Core Skills</h2>
                            <div className="flex flex-col gap-2">
                                {data.skills && data.skills.map((skill: string, i: number) => (
                                    <div key={i} className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 w-fit">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Education</h2>
                            {data.education && data.education.map((edu: any, i: number) => (
                                <div key={i} className="mb-3">
                                    <h3 className="font-bold text-sm text-slate-800">{edu.degree}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{edu.institution}</p>
                                    <p className="text-xs text-blue-600 font-medium mt-1">{edu.duration}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full md:w-2/3 p-8">
                        <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-6 inline-block">Experience</h2>
                        {data.experience && data.experience.map((exp: any, i: number) => (
                            <div key={i} className="mb-8 relative">
                                <div className="absolute -left-10 top-1 w-3 h-3 bg-blue-500 rounded-full hidden md:block border-4 border-white shadow-sm ring-1 ring-blue-500/20"></div>
                                <div className="absolute -left-[35px] top-4 w-px h-full bg-gray-200 hidden md:block"></div>
                                
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-lg text-slate-800">{exp.role}</h3>
                                    <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-md truncate max-w-[120px]">{exp.duration}</span>
                                </div>
                                <div className="text-sm font-semibold text-blue-600 mb-3">{exp.company}</div>
                                <ul className="space-y-2">
                                    {exp.bullets && exp.bullets.map((bullet: string, j: number) => (
                                        <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                                            <span className="text-blue-500 mt-1 flex-shrink-0">▹</span>
                                            <span className="leading-relaxed">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {data.projects && data.projects.length > 0 && (
                            <>
                                <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-6 mt-4 inline-block">Key Projects</h2>
                                {data.projects.map((proj: any, i: number) => (
                                    <div key={i} className="mb-8 relative">
                                        <div className="absolute -left-10 top-1 w-3 h-3 bg-cyan-500 rounded-full hidden md:block border-4 border-white shadow-sm ring-1 ring-cyan-500/20"></div>
                                        <div className="absolute -left-[35px] top-4 w-px h-full bg-gray-200 hidden md:block"></div>
                                        
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-lg text-slate-800">{proj.name}</h3>
                                        </div>
                                        <div className="text-sm font-semibold text-cyan-600 mb-3">{proj.techStack}</div>
                                        <ul className="space-y-2">
                                            {proj.bullets && proj.bullets.map((bullet: string, j: number) => (
                                                <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                                                    <span className="text-cyan-500 mt-1 flex-shrink-0">▹</span>
                                                    <span className="leading-relaxed">{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 -left-60 w-[500px] h-[500px] bg-cyan-600/10 dark:bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 dark:bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="container max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4">
                        <Monitor className="w-3.5 h-3.5" /> Indian IT & Non-IT Focused
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Resume Analyzer</span> 2.0
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Optimize your resume strictly tailored for Top Tier (TCS, Infosys, Wipro, FAANG India) ATS standards. 
                        Get instant keyword detection, market insights, and <span className="font-semibold text-cyan-600 dark:text-cyan-400">download professionally crafted ATS templates</span>!
                    </p>
                </div>

                {!result && (
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Left Col: Upload File */}
                        <div className="space-y-6">
                            <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-xl hover:border-cyan-500/50 transition-all duration-300">
                                <CardContent className="p-8 pb-10 flex flex-col items-center justify-center min-h-[320px]">
                                    <div 
                                        className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                                            dragActive ? 'border-cyan-500 bg-cyan-500/5 scale-[1.02]' : 'border-border/60 hover:border-cyan-500/50 hover:bg-muted/30'
                                        } ${file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={triggerFileSelect}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.docx,.txt"
                                            onChange={handleChange}
                                        />
                                        
                                        {file ? (
                                            <div className="text-center space-y-3 animate-in fade-in zoom-in duration-300">
                                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                                                    <FileCheck className="w-8 h-8 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground truncate max-w-[200px]">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                    className="text-xs text-red-400 hover:text-red-300 transition-colors mt-2 underline pointer-events-auto relative z-20"
                                                >
                                                    Remove file
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center space-y-4 flex flex-col items-center">
                                                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-cyan-500/20 transition-colors">
                                                    <UploadCloud className="w-8 h-8 text-cyan-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground text-lg">Upload your Resume</p>
                                                    <p className="text-sm text-muted-foreground mt-1">Drag & drop or click to browse</p>
                                                </div>
                                                <div className="flex gap-2 text-xs text-muted-foreground/70">
                                                    <span className="bg-muted px-2 py-0.5 rounded-sm">PDF</span>
                                                    <span className="bg-muted px-2 py-0.5 rounded-sm">DOCX</span>
                                                    <span className="bg-muted px-2 py-0.5 rounded-sm">TXT</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Col: Job Description */}
                        <div className="space-y-6 flex flex-col h-full">
                            <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-xl hover:border-blue-500/50 transition-all duration-300 flex-1">
                                <CardContent className="p-8 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                        <Target className="w-5 h-5 text-blue-500" />
                                        Target Job Description <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">Optional</span>
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Paste the exact job description from Naukri, LinkedIn, or company portal to get an accurate Match Score and Custom Template.
                                    </p>
                                    <textarea 
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the requirements, responsibilities, and qualifications here..."
                                        className="w-full flex-1 min-h-[160px] p-4 rounded-xl bg-background/50 border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none transition-all"
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-2 flex justify-center mt-4">
                            <Button 
                                onClick={handleAnalyze} 
                                disabled={!file || isAnalyzing}
                                className="w-full md:w-auto min-w-[300px] h-14 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/20 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-70 group"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                                        Analyzing against Indian Market...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                                        Scan & Generate Templates
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Loading State overlays the UI playfully */}
                {isAnalyzing && (
                    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                        <div className="w-24 h-24 mb-8 relative">
                            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-cyan-500">
                                <Building className="w-8 h-8 animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse mb-2 text-center">
                            Scanning specific to Indian MNC & Startup Standards...
                        </h2>
                        <p className="text-muted-foreground max-w-md text-center">
                            Our AI is detecting missing keywords, rewriting action verbs, and building your ATS-compliant templates.
                        </p>
                    </div>
                )}

                {/* Results View */}
                {result && !isAnalyzing && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto space-y-6">
                        
                        {/* Tab Headers */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                            <div className="bg-muted/50 p-1 rounded-xl flex gap-1 w-full md:w-auto overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('analysis')}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'analysis' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}
                                >
                                    <BarChart className="w-4 h-4 inline-block mr-2" />
                                    Detailed Analysis
                                </button>
                                <button
                                    onClick={() => setActiveTab('market')}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'market' ? 'bg-background shadow text-blue-500' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}
                                >
                                    <Building className="w-4 h-4 inline-block mr-2" />
                                    Indian Market Insights
                                </button>
                                <button
                                    onClick={() => setActiveTab('builder')}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'builder' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}
                                >
                                    <Layout className="w-4 h-4 inline-block mr-2" />
                                    Templates & Download
                                </button>
                            </div>

                            <Button variant="outline" onClick={() => {setResult(null); setActiveTab('analysis');}} className="h-10 border-border/60 hover:bg-accent flex-shrink-0">
                                Analyze Another Resume
                            </Button>
                        </div>

                        {/* TAB 1: Detailed Analysis */}
                        {activeTab === 'analysis' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                {/* Top Overview Cards */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <Card className="col-span-1 border-border/50 bg-card/60 backdrop-blur-xl shadow-lg flex flex-col items-center justify-center p-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full pointer-events-none" />
                                        
                                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 w-full justify-center">
                                            <Target className="w-5 h-5 text-cyan-500" />
                                            ATS Match Score
                                        </h3>
                                        
                                        <div className="relative w-40 h-40 flex items-center justify-center my-2 group">
                                            <svg className="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" className="stroke-muted fill-none" strokeWidth="8" />
                                                <circle 
                                                    cx="50" cy="50" r="45" 
                                                    className={`${getScoreColor(result.atsScore)} fill-none transition-all duration-1000 ease-out`} 
                                                    strokeWidth="8"
                                                    strokeDasharray={`${(result.atsScore / 100) * 283} 283`}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className={`text-5xl font-extrabold ${getScoreColor(result.atsScore).split(' ')[0]}`}>{result.atsScore}</span>
                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">Out of 100</span>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="col-span-1 md:col-span-2 border-border/50 bg-card/60 backdrop-blur-xl shadow-lg flex flex-col">
                                        <CardContent className="p-8 flex flex-col h-full justify-between gap-6">
                                            <div>
                                                <h3 className="text-xl font-bold mb-3">Executive Summary</h3>
                                                <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                        <span className="font-semibold text-emerald-500 text-sm">Identified Strengths</span>
                                                    </div>
                                                    <ul className="space-y-1.5">
                                                        {result.strengths?.slice(0, 3).map((s: string, i: number) => (
                                                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1"><span className="text-emerald-500">•</span> <span className="line-clamp-2">{s}</span></li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                                        <span className="font-semibold text-red-500 text-sm">Critical Weaknesses</span>
                                                    </div>
                                                    <ul className="space-y-1.5">
                                                        {result.weaknesses?.slice(0, 3).map((w: string, i: number) => (
                                                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1"><span className="text-red-500">•</span> <span className="line-clamp-2">{w}</span></li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="border-border/50 bg-card/60 shadow-lg">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-border/50 pb-3">
                                            <Target className="w-5 h-5 text-cyan-500" /> Keyword Intelligence Matrix
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-sm font-semibold text-emerald-500 mb-3 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4" /> Discovered Skills
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.matchedKeywords?.length > 0 ? result.matchedKeywords.map((k: string, i: number) => (
                                                        <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">{k}</span>
                                                    )) : <span className="text-xs text-muted-foreground italic">No specific keywords matched.</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-red-500 mb-3 flex items-center gap-2">
                                                    <XCircle className="w-4 h-4" /> Missing from JD / Standard
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.missingKeywords?.length > 0 ? result.missingKeywords.map((k: string, i: number) => (
                                                        <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">{k}</span>
                                                    )) : <span className="text-xs text-muted-foreground italic">You hit all the keywords!</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* TAB 2: Indian Market Insights */}
                        {activeTab === 'market' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <Card className="border-border/50 bg-card/60 shadow-lg border-t-4 border-t-blue-500">
                                    <CardContent className="p-8">
                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold mb-2 text-foreground flex items-center gap-2">
                                                    Market Readiness: <span className="text-blue-500">{result.marketReadiness || "Evaluation Pending"}</span>
                                                </h3>
                                                <p className="text-muted-foreground mb-6">Based on TCS, Infosys, Wipro, and heavily tech-focused Product Startup standards in India.</p>
                                                
                                                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl relative overflow-hidden">
                                                    <Building className="absolute -bottom-4 -right-4 w-32 h-32 text-blue-500/10 pointer-events-none" />
                                                    <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-3 text-lg">Recruiter & ATS Review</h4>
                                                    <p className="text-foreground/90 leading-relaxed z-10 relative">
                                                        {result.indianMarketInsights || "Specific Indian market insights were not generated."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/50 bg-card/60 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-500 to-blue-600" />
                                    <CardContent className="p-8 pl-10">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-border/50 pb-3">
                                            <Zap className="w-5 h-5 text-blue-500" /> Action Plan to Improve
                                        </h3>
                                        <ul className="space-y-4 pt-2">
                                            {result.actionableTips?.map((tip: string, i: number) => (
                                                <li key={i} className="flex items-start gap-4 group">
                                                    <div className="mt-1 p-1.5 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                                                        <ArrowRight className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <span className="text-base text-muted-foreground/90 group-hover:text-foreground transition-colors leading-relaxed">
                                                        {tip}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* TAB 3: Resume Builder / Download Templates */}
                        {activeTab === 'builder' && result.optimizedResumeData && (
                            <div className="animate-in fade-in duration-500">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 bg-card/40 p-5 rounded-2xl border border-border/50 backdrop-blur-md">
                                    <div>
                                        <h3 className="font-bold text-xl text-foreground">ATS-Optimized Resume Templates</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Our AI rewrote your bullet points to show impact. Choose a template to download.</p>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                        <div className="bg-background border border-border rounded-lg p-1 flex">
                                            <button 
                                                onClick={() => setSelectedTemplate('classic')}
                                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${selectedTemplate === 'classic' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:bg-muted'}`}
                                            >
                                                Indian IT (Classic)
                                            </button>
                                            <button 
                                                onClick={() => setSelectedTemplate('modern')}
                                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${selectedTemplate === 'modern' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:bg-muted'}`}
                                            >
                                                Product Startup (Modern)
                                            </button>
                                        </div>
                                        <Button 
                                            onClick={downloadPDF} 
                                            disabled={isGeneratingPDF}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-6 shadow-xl shadow-emerald-500/20 w-full sm:w-auto mt-3 sm:mt-0"
                                        >
                                            {isGeneratingPDF ? (
                                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                                            ) : (
                                                <Download className="w-4 h-4 mr-2" />
                                            )}
                                            Download PDF
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-slate-200 dark:bg-slate-800 p-4 md:p-8 rounded-2xl overflow-x-auto shadow-inner flex justify-center border border-border/50">
                                    {/* The Resume Preview Canvas */}
                                    <div className="shadow-2xl hover:shadow-3xl transition-shadow duration-500 scale-[0.6] sm:scale-75 md:scale-95 lg:scale-100 origin-top">
                                        {renderResumeTemplate()}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Fallback if Builder selected but data failed */}
                        {activeTab === 'builder' && !result.optimizedResumeData && (
                            <div className="text-center p-12 bg-card/60 backdrop-blur-md rounded-2xl border border-border">
                                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Template Engine Unavailable</h3>
                                <p className="text-muted-foreground">The AI was unable to structure your resume into a template format. Please ensure your resume is text-readable.</p>
                            </div>
                        )}

                    </div>
                )}
            </div>
            <Toaster position="top-center" richColors theme="dark" />
        </div>
    );
}
