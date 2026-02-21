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
            <div className="text-center py-12 space-y-4">
                <div className="flex justify-center">
                    <div className="p-4 bg-muted rounded-full">
                        <Code2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">No Projects Available</h3>
                <p className="text-sm text-muted-foreground">
                    Hands-on projects aligned with {careerGoal} will be displayed here
                </p>
            </div>
        );
    }

    const getDifficultyColor = (difficulty?: string) => {
        switch(difficulty?.toLowerCase()) {
            case 'beginner':
            case 'easy':
                return 'from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400';
            case 'intermediate':
            case 'medium':
                return 'from-yellow-500/10 to-orange-500/10 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400';
            case 'advanced':
            case 'hard':
                return 'from-red-500/10 to-pink-500/10 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400';
            default:
                return 'from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400';
        }
    };

    const getDifficultyIcon = (difficulty?: string) => {
        switch(difficulty?.toLowerCase()) {
            case 'beginner':
            case 'easy':
                return '✅';
            case 'intermediate':
            case 'medium':
                return '⚡';
            case 'advanced':
            case 'hard':
                return '🔥';
            default:
                return '📌';
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
            <Card key={index} className={`bg-gradient-to-br ${getDifficultyColor(project.difficulty)} border-2 transition-all hover:shadow-lg overflow-hidden`}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2 mb-2">
                                <span className="text-2xl">{getDifficultyIcon(project.difficulty)}</span>
                                {project.title}
                            </CardTitle>
                            {project.priority && (
                                <Badge variant="secondary" className="text-xs">
                                    {getPriorityIcon(project.priority)} {project.priority.toUpperCase()}
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    {/* Description */}
                    <p className="text-sm text-foreground">{project.description}</p>

                    {/* Why - Alignment with Goal */}
                    {project.why && (
                        <div className="p-3 bg-blue-100/50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                                🎯 Aligns with {careerGoal}
                            </p>
                            <p className="text-sm text-muted-foreground">{project.why}</p>
                        </div>
                    )}

                    {/* Skills Covered */}
                    {skillList.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Skills Covered</p>
                            <div className="flex flex-wrap gap-2">
                                {skillList.map((skill, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                        💡 {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-border/50">
                        {/* Difficulty */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Difficulty</p>
                            <p className="text-sm font-bold capitalize">{project.difficulty || 'Medium'}</p>
                        </div>

                        {/* Time Estimate */}
                        {project.estimatedTime && (
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Duration
                                </p>
                                <p className="text-sm font-bold">{project.estimatedTime}</p>
                            </div>
                        )}
                    </div>

                    {/* Learning Outcome */}
                    {project.learningOutcome && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" /> What You'll Learn
                            </p>
                            <p className="text-sm text-muted-foreground">{project.learningOutcome}</p>
                        </div>
                    )}

                    {/* Evaluation Criteria */}
                    {project.evaluation && (
                        <div className="p-3 bg-cyan-100/50 dark:bg-cyan-900/20 rounded border border-cyan-200 dark:border-cyan-800">
                            <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 mb-1">
                                ✓ How to Verify Success
                            </p>
                            <p className="text-sm text-muted-foreground">{project.evaluation}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 w-1.5 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-foreground">Hands-On Projects</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                    Real-world projects designed to showcase skills for {careerGoal} {targetCompany ? `at ${targetCompany}` : ''} interviews
                </p>
            </div>

            {/* Project Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/20 border-cyan-200 dark:border-cyan-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-600/10 rounded-lg">
                                <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Core Projects</p>
                                <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">{coreProjects.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-600/10 rounded-lg">
                                <Code2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Total Projects</p>
                                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{projects.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-600/10 rounded-lg">
                                <Trophy className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase">Portfolio Pieces</p>
                                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{coreProjects.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Core Projects - Interview Ready */}
            {coreProjects.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        <h4 className="text-lg font-bold text-foreground">🎯 Core Projects (Interview-Ready)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7 mb-4">
                        Build these projects to demonstrate interview-level skills. These are your showpiece projects.
                    </p>
                    <div className="space-y-4">
                        {coreProjects.map((project, idx) => renderProjectCard(project, idx))}
                    </div>
                </div>
            )}

            {/* Important Projects */}
            {importantProjects.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h4 className="text-lg font-bold text-foreground">⭐ Important Projects (Deep Learning)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7 mb-4">
                        These projects reinforce your understanding and build real-world problem-solving skills.
                    </p>
                    <div className="space-y-4">
                        {importantProjects.map((project, idx) => renderProjectCard(project, idx + coreProjects.length))}
                    </div>
                </div>
            )}

            {/* Optional Projects */}
            {optionalProjects.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h4 className="text-lg font-bold text-foreground">✨ Bonus Projects (Extra Standout)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-7 mb-4">
                        Build these after mastering core skills to really shine and differentiate yourself.
                    </p>
                    <div className="space-y-4">
                        {optionalProjects.map((project, idx) => renderProjectCard(project, idx + coreProjects.length + importantProjects.length))}
                    </div>
                </div>
            )}

            {/* Project Timeline Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                    <div className="space-y-3">
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Project Timeline Strategy
                        </h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>
                                <span className="font-semibold text-foreground">Months 1-2:</span> Complete core projects while learning fundamentals
                            </p>
                            <p>
                                <span className="font-semibold text-foreground">Months 2-3:</span> Refine projects, optimize code, add advanced features
                            </p>
                            <p>
                                <span className="font-semibold text-foreground">Month 3+:</span> Use projects in interviews as proof of skills
                            </p>
                            <p className="pt-2 text-xs italic">
                                💡 GitHub repos with good documentation and clean code matter more than project complexity.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
