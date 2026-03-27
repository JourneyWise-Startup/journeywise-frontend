"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Trophy, Zap, Code2, Lightbulb, TrendingUp, Target, Clock,
    CheckCircle2, AlertCircle, GitBranch
} from 'lucide-react';

interface ProjectSkill {
    skill: string;
    level?: string;
}

interface Project {
    title: string;
    priority?: string;
    difficulty?: string;
    description: string;
    skills?: ProjectSkill[] | string[];
    estimatedTime?: string;
    learningOutcome?: string;
    resources?: any[];
    evaluation?: string;
    why?: string;
}

interface ProjectsDisplayProps {
    projects: Project[];
    careerGoal: string;
    targetCompany?: string;
}

export function ProjectsDisplay({
    projects,
    careerGoal,
    targetCompany
}: ProjectsDisplayProps) {
    if (!projects || projects.length === 0) {
        return (
            <div className="text-center py-20 px-6 glass-panel border-white/10 dark:border-white/5 neo-glow">
                <div className="flex justify-center mb-6">
                    <div className="p-5 bg-muted/20 rounded-3xl border border-white/10">
                        <Code2 className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">Project Arsenal Empty</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 leading-relaxed font-medium">
                    Our AI is still architecting the perfect portfolio pieces for your {careerGoal} journey. Check back in a moment!
                </p>
            </div>
        );
    }

    const getDifficultyColor = (difficulty?: string) => {
        switch(difficulty?.toLowerCase()) {
            case 'beginner':
            case 'easy':
                return 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5';
            case 'intermediate':
            case 'medium':
                return 'border-yellow-500/20 text-yellow-600 dark:text-yellow-400 bg-yellow-500/5';
            case 'advanced':
            case 'hard':
                return 'border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/5';
            default:
                return 'border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/5';
        }
    };

    const getDifficultyIcon = (difficulty?: string) => {
        switch(difficulty?.toLowerCase()) {
            case 'beginner':
            case 'easy':
                return <CheckCircle2 className="w-5 h-5" />;
            case 'intermediate':
            case 'medium':
                return <Zap className="w-5 h-5" />;
            case 'advanced':
            case 'hard':
                return <TrendingUp className="w-5 h-5" />;
            default:
                return <Target className="w-5 h-5" />;
        }
    };

    const getPriorityIcon = (priority?: string) => {
        switch(priority?.toLowerCase()) {
            case 'core':
            case 'critical':
                return '🎯';
            case 'important':
                return '⭐';
            case 'optional':
                return '✨';
            default:
                return '→';
        }
    };

    const coreProjects = projects.filter(p => p.priority?.toLowerCase() === 'core');
    const importantProjects = projects.filter(p => p.priority?.toLowerCase() === 'important');
    const optionalProjects = projects.filter(p => !p.priority || p.priority?.toLowerCase() === 'optional');

    const renderProjectCard = (project: Project, index: number) => {
        const skillList = Array.isArray(project.skills) 
            ? project.skills.map(s => typeof s === 'string' ? s : s.skill)
            : [];

        return (
            <Card key={index} className="glass-card border-white/10 dark:border-white/5 hover:border-cyan-500/40 transform hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group/card">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity" />
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${getDifficultyColor(project.difficulty)} border flex items-center justify-center`}>
                                    {getDifficultyIcon(project.difficulty)}
                                </div>
                                <h4 className="text-xl font-bold text-foreground tracking-tight group-hover/card:text-cyan-600 dark:group-hover/card:text-cyan-400 transition-colors">
                                    {project.title}
                                </h4>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {project.priority && (
                                    <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5">
                                        {getPriorityIcon(project.priority)} {project.priority}
                                    </Badge>
                                )}
                                <Badge variant="outline" className="border-white/10 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5">
                                    Project {index + 1}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-0">
                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">{project.description}</p>

                    {project.why && (
                        <div className="p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl border border-blue-500/10 group-hover/card:bg-blue-500/10 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Interview Relevance</span>
                            </div>
                            <p className="text-sm text-foreground/70 font-medium italic leading-relaxed">"{project.why}"</p>
                        </div>
                    )}

                    {skillList.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <Code2 className="w-3.5 h-3.5" /> Core Technologies
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {skillList.map((skill, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-white/5 border border-white/5 text-xs font-bold py-1 px-3 group-hover/card:border-cyan-500/20 transition-colors">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Complexity</p>
                            <p className="text-sm font-bold text-foreground capitalize flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                    project.difficulty?.toLowerCase().includes('hard') ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                    project.difficulty?.toLowerCase().includes('medium') ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                }`} />
                                {project.difficulty || 'Intermediate'}
                            </p>
                        </div>

                        {project.estimatedTime && (
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Estimated Build</p>
                                <p className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                    {project.estimatedTime}
                                </p>
                            </div>
                        )}
                    </div>

                    {project.learningOutcome && (
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <Lightbulb className="w-3.5 h-3.5 text-yellow-500" /> Mastery Objectives
                            </p>
                            <p className="text-sm text-foreground/70 font-medium leading-relaxed">{project.learningOutcome}</p>
                        </div>
                    )}

                    {project.evaluation && (
                        <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/10 group-hover/card:bg-emerald-500/10 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Quality Standard</span>
                            </div>
                            <p className="text-sm text-foreground/70 font-medium leading-relaxed">{project.evaluation}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="p-6 glass-panel border-cyan-500/20 dark:border-cyan-500/10 mb-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl opacity-50" />
                <div className="space-y-1 relative z-10">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                        <Code2 className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                        Portfolio Warfare
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground ml-10">
                        Strategic projects optimized for {careerGoal} interviews {targetCompany ? `@ ${targetCompany}` : ''}
                    </p>
                </div>
            </div>

            {/* Project Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card hover:border-cyan-500/40 transition-all group overflow-hidden border-white/10 dark:border-white/5">
                    <CardContent className="p-6 relative">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 group-hover:scale-110 transition-transform">
                                <Target className="w-6 h-6 text-cyan-600 dark:text-cyan-400 shadow-[0_0_10px_rgba(8,145,178,0.2)]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Elite Targets</p>
                                <p className="text-3xl font-black text-foreground">{coreProjects.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card hover:border-purple-500/40 transition-all group overflow-hidden border-white/10 dark:border-white/5">
                    <CardContent className="p-6 relative">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 group-hover:scale-110 transition-transform">
                                <Code2 className="w-6 h-6 text-purple-600 dark:text-purple-400 shadow-[0_0_10px_rgba(147,51,234,0.2)]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Grand Total</p>
                                <p className="text-3xl font-black text-foreground">{projects.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card hover:border-orange-500/40 transition-all group overflow-hidden border-white/10 dark:border-white/5">
                    <CardContent className="p-6 relative">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 group-hover:scale-110 transition-transform">
                                <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400 shadow-[0_0_10px_rgba(234,88,12,0.2)]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Portfolio Tier</p>
                                <p className="text-3xl font-black text-foreground">{coreProjects.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Core Projects - Interview Ready */}
            {coreProjects.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 glass-panel border-cyan-500/20 dark:border-cyan-500/10">
                        <Trophy className="w-6 h-6 text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(8,145,178,0.3)]" />
                        <h4 className="text-xl font-black text-foreground tracking-tight uppercase">Tier 1: Core Masterpieces</h4>
                    </div>
                    <div className="space-y-6">
                        {coreProjects.map((project, idx) => renderProjectCard(project, idx))}
                    </div>
                </div>
            )}

            {/* Important Projects */}
            {importantProjects.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 glass-panel border-purple-500/20 dark:border-purple-500/10">
                        <Code2 className="w-6 h-6 text-purple-600 dark:text-purple-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.3)]" />
                        <h4 className="text-xl font-black text-foreground tracking-tight uppercase">Tier 2: Deep Learning Hubs</h4>
                    </div>
                    <div className="space-y-6">
                        {importantProjects.map((project, idx) => renderProjectCard(project, idx + coreProjects.length))}
                    </div>
                </div>
            )}

            {/* Optional Projects */}
            {optionalProjects.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 glass-panel border-emerald-500/20 dark:border-emerald-500/10">
                        <Lightbulb className="w-6 h-6 text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                        <h4 className="text-xl font-black text-foreground tracking-tight uppercase">Tier 3: Elite Distinguishers</h4>
                    </div>
                    <div className="space-y-6">
                        {optionalProjects.map((project, idx) => renderProjectCard(project, idx + coreProjects.length + importantProjects.length))}
                    </div>
                </div>
            )}

            {/* Project Timeline Info */}
            <Card className="glass-panel border-blue-500/20 dark:border-blue-500/10 neo-glow overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-black flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                        <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        Execution Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6 pt-0">
                    {[
                        { step: 'Phase 1', title: 'Foundation', desc: 'Months 1-2: Complete core projects alongside roadmap theory.', icon: '🏗️' },
                        { step: 'Phase 2', title: 'Polishing', desc: 'Months 2-3: Refine code quality, add advanced features & tests.', icon: '✨' },
                        { step: 'Phase 3', title: 'Domination', desc: 'Month 3+: Showcase live links & repos in every interview.', icon: '🏆' }
                    ].map((phase, i) => (
                        <div key={i} className="space-y-3 p-4 rounded-2xl bg-white/5 dark:bg-black/20 border border-white/10 hover:bg-white/10 dark:hover:bg-black/30 transition-all group/phase cursor-default">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{phase.step}</span>
                                <span className="text-xl group-hover/phase:scale-125 transition-transform">{phase.icon}</span>
                            </div>
                            <p className="text-sm font-black text-foreground uppercase tracking-tight">{phase.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">{phase.desc}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
