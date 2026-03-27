"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    AlertCircle, CheckCircle2, TrendingUp, Target, Clock, Zap, 
    BookOpen, Award, Lightbulb
} from 'lucide-react';

interface SkillGap {
    skill: string;
    currentLevel: string;
    requiredLevel: string;
    whyNeeded: string;
    companyRequirement?: boolean;
    difficulty: string;
    estimatedHoursToMastery: number;
    learnThis: string;
    beginnerFriendlyResource?: string;
}

interface SkillGapsDisplayProps {
    skillGaps: SkillGap[];
    careerGoal: string;
    targetCompany?: string;
}

export function SkillGapsDisplay({
    skillGaps,
    careerGoal,
    targetCompany
}: SkillGapsDisplayProps) {
    if (!skillGaps || skillGaps.length === 0) {
        return (
            <Card className="bg-gradient-to-br from-emerald-50/80 to-green-50/50 dark:from-emerald-950/40 dark:to-green-950/20 border-2 border-emerald-200/60 dark:border-emerald-800/40">
                <CardContent className="p-12 text-center space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-full">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-foreground\">No Skill Gaps Detected</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed\">
                            🎉 You're already equipped with all the necessary skills for <span className="font-semibold text-emerald-700 dark:text-emerald-400\">{careerGoal}</span>. Keep building on these strengths!
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Categorize gaps by criticality
    const criticalGaps = skillGaps.filter(g => 
        g.difficulty === 'hard' || g.difficulty === 'expert' || g.companyRequirement
    );
    const importantGaps = skillGaps.filter(g => 
        g.difficulty === 'medium' && !g.companyRequirement
    );
    const optionalGaps = skillGaps.filter(g => 
        g.difficulty === 'easy' && !g.companyRequirement
    );

    const getDifficultyColor = (difficulty: string) => {
        switch(difficulty) {
            case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
            case 'hard': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
            case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
        }
    };

    const getDifficultyIcon = (difficulty: string) => {
        switch(difficulty) {
            case 'easy': return '✅';
            case 'medium': return '⚡';
            case 'hard': return '🔥';
            case 'expert': return '💎';
            default: return '?';
        }
    };

    const getHoursColor = (hours: number) => {
        if (hours <= 20) return 'text-green-600 dark:text-green-400';
        if (hours <= 50) return 'text-yellow-600 dark:text-yellow-400';
        if (hours <= 100) return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    const renderSkillCard = (gap: SkillGap, priority: 'critical' | 'important' | 'optional') => {
        const progressPercentage = Math.min(
            Math.round(((['beginner', 'novice'].includes(gap.currentLevel) ? 0 : 30) / 
            (['intermediate', 'advanced', 'expert'].includes(gap.requiredLevel) ? 100 : 60)) * 100),
            100
        );

        return (
            <Card key={gap.skill} className={`glass-card border group hover:scale-[1.01] transition-all duration-300 ${
                priority === 'critical' ? 'border-red-500/30 hover:border-red-500/50' :
                priority === 'important' ? 'border-yellow-500/30 hover:border-yellow-500/50' :
                'border-emerald-500/30 hover:border-emerald-500/50'
            }`}>
                <div className={`h-1.5 w-full bg-gradient-to-r ${
                    priority === 'critical' ? 'from-red-500 to-orange-500' :
                    priority === 'important' ? 'from-yellow-500 to-amber-500' :
                    'from-emerald-500 to-green-500'
                }`} />
                <CardContent className="p-4 space-y-3">
                    {/* Header with skill name and badges */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-foreground">{gap.skill}</h4>
                                {gap.companyRequirement && (
                                    <Badge className="bg-purple-600 text-white text-xs">
                                        🎯 {targetCompany ? `For ${targetCompany}` : 'Company Focus'}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground italic">{gap.learnThis}</p>
                        </div>
                        <Badge className={`${getDifficultyColor(gap.difficulty)} border whitespace-nowrap`}>
                            {getDifficultyIcon(gap.difficulty)} {gap.difficulty}
                        </Badge>
                    </div>

                    {/* Why needed */}
                    <div className="p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-muted-foreground">
                            <span className="font-semibold text-blue-700 dark:text-blue-400">Why needed:</span> {gap.whyNeeded}
                        </p>
                    </div>

                    {/* Current vs Required Level */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-muted/50 rounded">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Current</p>
                            <p className="text-sm font-bold text-foreground capitalize">{gap.currentLevel || 'None'}</p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Required</p>
                            <p className="text-sm font-bold text-foreground capitalize">{gap.requiredLevel}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Readiness</p>
                            <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{progressPercentage}%</p>
                        </div>
                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(59,130,246,0.3)] ${
                                    priority === 'critical' ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-red-500/20' :
                                    priority === 'important' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 shadow-yellow-500/20' :
                                    'bg-gradient-to-r from-emerald-500 to-green-500 shadow-emerald-500/20'
                                }`}
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Time & Resources */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                        <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${getHoursColor(gap.estimatedHoursToMastery)}`} />
                            <div>
                                <p className="text-xs text-muted-foreground">Learn in</p>
                                <p className={`text-sm font-bold ${getHoursColor(gap.estimatedHoursToMastery)}`}>
                                    ~{gap.estimatedHoursToMastery}h
                                </p>
                            </div>
                        </div>
                        {gap.beginnerFriendlyResource && (
                            <div className="flex items-start gap-2">
                                <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Start with</p>
                                    <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 line-clamp-1">
                                        {gap.beginnerFriendlyResource}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 w-1.5 bg-gradient-to-b from-red-600 to-orange-600 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-foreground">Your Skill Gaps</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                    Prioritized by criticality for {careerGoal} {targetCompany ? `at ${targetCompany}` : ''}
                </p>
            </div>

            {/* Overview Stats - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <Card className="glass-card border-red-500/20 hover:border-red-500/40 transform hover:-translate-y-1 transition-all duration-300 group">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">
                            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Critical</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">{criticalGaps.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-yellow-500/20 hover:border-yellow-500/40 transform hover:-translate-y-1 transition-all duration-300 group">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Important</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">{importantGaps.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-emerald-500/20 hover:border-emerald-500/40 transform hover:-translate-y-1 transition-all duration-300 group">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Optional</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">{optionalGaps.length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Critical Skills Section */}
            {criticalGaps.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <h4 className="text-lg font-bold text-foreground">🔴 Critical First (Master These)</h4>
                    </div>
                    <div className="space-y-3">
                        {criticalGaps.map(gap => renderSkillCard(gap, 'critical'))}
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-400 italic ml-1">
                        ⚠️ These skills are essential for success in {careerGoal}. Start with these immediately.
                    </p>
                </div>
            )}

            {/* Important Skills Section */}
            {importantGaps.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <h4 className="text-lg font-bold text-foreground">⚡ Important (Learn After Basics)</h4>
                    </div>
                    <div className="space-y-3">
                        {importantGaps.map(gap => renderSkillCard(gap, 'important'))}
                    </div>
                </div>
            )}

            {/* Optional Skills Section */}
            {optionalGaps.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h4 className="text-lg font-bold text-foreground">✅ Optional (Nice to Have)</h4>
                    </div>
                    <div className="space-y-3">
                        {optionalGaps.map(gap => renderSkillCard(gap, 'optional'))}
                    </div>
                    <p className="text-xs text-muted-foreground italic ml-1">
                        These skills make you stand out. Learn after mastering critical skills.
                    </p>
                </div>
            )}

            {/* Total Hours Summary - Enhanced */}
            <Card className="glass-panel border-cyan-500/20 dark:border-cyan-500/10 neo-glow overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl">
                                    <Award className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <h4 className="text-2xl font-bold text-foreground">Complete Mastery Journey</h4>
                            </div>
                            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                                Based on your AI-detected skill gaps, this is your optimized path to {careerGoal}. We recommend dedicating <span className="font-bold text-foreground">12-15 hours per week</span> for maximum retention.
                            </p>
                        </div>
                        <div className="text-center md:text-right p-6 bg-white/5 dark:bg-black/20 rounded-2xl border border-white/10 dark:border-white/5 backdrop-blur-sm min-w-[200px]">
                            <p className="text-5xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent tracking-tighter mb-1">
                                ~{skillGaps.reduce((sum, g) => sum + (g.estimatedHoursToMastery || 40), 0)}h
                            </p>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest group-hover:text-cyan-500 transition-colors">
                                approx {Math.round(skillGaps.reduce((sum, g) => sum + (g.estimatedHoursToMastery || 40), 0) / 12)} weeks
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
