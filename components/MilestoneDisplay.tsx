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
            <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 w-1.5 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-foreground">Journey Breakdown</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-6">Monthly milestones to accelerate your growth</p>
            </div>

            {/* Milestones Grid - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {milestones.map((milestone, index) => {
                    const isCompleted = completedMonths?.includes(index);
                    const monthLabel = getMonthEmoji(milestone.month);

                    return (
                        <Card
                            key={index}
                            className={`transition-all duration-300 overflow-hidden hover:shadow-lg ${
                                isCompleted
                                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                                    : 'bg-card border-border hover:border-gray-400 dark:hover:border-gray-600'
                            }`}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className={`text-lg font-bold ${
                                                isCompleted
                                                    ? 'text-emerald-700 dark:text-emerald-400'
                                                    : 'text-foreground'
                                            }`}>
                                                {monthLabel} (Month {milestone.month})
                                            </CardTitle>
                                            {isCompleted && (
                                                <Badge className="bg-emerald-600 text-white text-xs py-1">
                                                    ✓ Done
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-1">
                                            {milestone.title}
                                        </h3>
                                        <CardDescription className="text-sm">
                                            {milestone.focus}
                                        </CardDescription>
                                    </div>

                                    {milestone.hoursRequired && (
                                        <div className="flex-shrink-0 px-3 py-2 bg-muted rounded-lg text-center">
                                            <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                                            <p className="text-xs font-semibold text-foreground">{milestone.hoursRequired}h</p>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Expected Outcome */}
                                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-900/50">
                                    <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Expected Outcome
                                    </h4>
                                    <p className="text-sm text-foreground/80">{milestone.expectedOutcome}</p>
                                </div>

                                {/* Success Criteria */}
                                {milestone.successCriteria && (
                                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-900/50">
                                        <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                                            <Trophy className="w-4 h-4" />
                                            Success Criteria
                                        </h4>
                                        <p className="text-sm text-foreground/80">{milestone.successCriteria}</p>
                                    </div>
                                )}

                                {/* Projects */}
                                {milestone.projects && (
                                    <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-200/50 dark:border-purple-900/50">
                                        <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
                                            <Zap className="w-4 h-4" />
                                            Projects to Build
                                        </h4>
                                        <p className="text-sm text-foreground/80">{milestone.projects}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Tips Section */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50/50 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-200/50 dark:border-yellow-900/50">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                        <Trophy className="w-5 h-5" />
                        Tips for Milestone Success
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Stay Consistent</p>
                            <p className="text-sm text-muted-foreground">Work on your roadmap for 1-2 hours daily. Consistency beats intensity.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Track Progress</p>
                            <p className="text-sm text-muted-foreground">Mark weeks as complete in the Weekly Plan tab to monitor your journey.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Build Projects</p>
                            <p className="text-sm text-muted-foreground">Focus on the 3 projects - they're worth more than 100 hours of theory.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">Don't Skip Details</p>
                            <p className="text-sm text-muted-foreground">Use direct resource links provided - they're curated for you.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
