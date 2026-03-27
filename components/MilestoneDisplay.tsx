"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle2, Zap, Target, Trophy, Clock
} from 'lucide-react';

interface Milestone {
    month: number;
    title: string;
    focus: string;
    expectedOutcome: string;
    hoursRequired?: number;
    successCriteria?: string;
    projects?: string;
}

interface MilestoneDisplayProps {
    milestones: Milestone[];
    currentMonth?: number;
    completedMonths?: number[];
}

export function MilestoneDisplay({
    milestones,
    currentMonth = 1,
    completedMonths = []
}: MilestoneDisplayProps) {
    if (!milestones || milestones.length === 0) {
        return null;
    }

    const getMonthEmoji = (month: number) => {
        switch(month) {
            case 1: return '🚀 Start';
            case 2: return '📈 Growth';
            case 3: return '🎯 Master';
            default: return '✨ Expert';
        }
    };

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="p-6 glass-panel border-purple-500/20 dark:border-purple-500/10 mb-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl opacity-50" />
                <div className="space-y-1 relative z-10">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
                        <Trophy className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                        Monthly Milestones
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground ml-10">Strategic breakdown of your 3-month high-intensity growth path</p>
                </div>
            </div>

            {/* Milestones Grid - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {milestones.map((milestone, index) => {
                    const isCompleted = completedMonths?.includes(index);
                    const monthLabel = getMonthEmoji(milestone.month);

                    return (
                        <Card
                            key={index}
                            className={`glass-card border group hover:scale-[1.01] transition-all duration-500 relative overflow-hidden ${
                                isCompleted
                                    ? 'border-emerald-500/30 neo-glow'
                                    : 'border-white/10 dark:border-white/5 hover:border-purple-500/30'
                            }`}
                        >
                            <div className={`h-1.5 w-full bg-gradient-to-r ${
                                isCompleted ? 'from-emerald-500 to-teal-500' : 'from-purple-500 to-pink-500'
                            }`} />
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className={`text-[10px] font-black uppercase tracking-widest ${
                                                isCompleted ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                                            }`}>
                                                {monthLabel}
                                            </Badge>
                                            {isCompleted && (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                                                    <CheckCircle2 className="w-3 h-3" /> Achieved
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-black text-foreground tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {milestone.title}
                                        </h3>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">
                                            {milestone.focus}
                                        </p>
                                    </div>

                                    {milestone.hoursRequired && (
                                        <div className="flex-shrink-0 px-4 py-3 bg-white/5 dark:bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm text-center transform group-hover:rotate-6 transition-transform">
                                            <Clock className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                                            <p className="text-lg font-black text-foreground leading-none">{milestone.hoursRequired}h</p>
                                            <p className="text-[8px] font-bold text-muted-foreground uppercase mt-1">Goal</p>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-2">
                                {/* Expected Outcome */}
                                <div className="p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl border border-blue-500/10 group-hover:bg-blue-500/10 transition-colors">
                                    <h4 className="text-[10px] font-black text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
                                        <Target className="w-4 h-4" />
                                        Expected Outcome
                                    </h4>
                                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">{milestone.expectedOutcome}</p>
                                </div>

                                {/* Success Criteria */}
                                {milestone.successCriteria && (
                                    <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/10 group-hover:bg-emerald-500/10 transition-colors">
                                        <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
                                            <Trophy className="w-4 h-4" />
                                            Success Criteria
                                        </h4>
                                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">{milestone.successCriteria}</p>
                                    </div>
                                )}

                                {/* Projects */}
                                {milestone.projects && (
                                    <div className="p-4 bg-purple-500/5 dark:bg-purple-500/10 rounded-2xl border border-purple-500/10 group-hover:bg-purple-500/10 transition-colors">
                                        <h4 className="text-[10px] font-black text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
                                            <Zap className="w-4 h-4" />
                                            Projects to Build
                                        </h4>
                                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">{milestone.projects}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Tips Section */}
            <Card className="glass-panel border-yellow-500/20 dark:border-yellow-500/10 neo-glow overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-black flex items-center gap-3 bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                        <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        Strategies for Domination
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 pt-0">
                    {[
                        { title: 'Extreme Consistency', desc: 'Work on your roadmap for 1-2 hours daily. Momentum is your greatest asset.', icon: '⚡' },
                        { title: 'Progress Tracking', desc: 'Mark milestones as "Done" to see your readiness score climb in real-time.', icon: '📈' },
                        { title: 'Project Priority', desc: 'Focus on building the 3 core projects. Real-world code beats theory 10:1.', icon: '💻' },
                        { title: 'Curation Trust', desc: 'The AI has hand-picked these resources for maximum ROI. Don\'t skip them.', icon: '🎯' }
                    ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 dark:bg-black/20 border border-white/10 hover:bg-white/10 dark:hover:bg-black/30 transition-all group/tip cursor-default">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-yellow-500/10 text-xl flex items-center justify-center border border-yellow-500/20 group-hover/tip:scale-110 transition-transform">
                                {tip.icon}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-foreground uppercase tracking-tight">{tip.title}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
