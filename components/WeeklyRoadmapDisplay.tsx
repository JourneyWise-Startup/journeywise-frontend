"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Target, BookOpen, Code2, Zap, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DailyTask {
    day: string;
    time?: string;
    hours?: number;
    tasks?: string[];
}

interface WeeklyPlanItem {
    week: number;
    title: string;
    phase?: string;
    why?: string;
    duration?: string;
    dailyTasks?: string[];
    tasks?: string[];
    resources?: any[];
    learningGoals?: string[];
    assessmentMethod?: string;
    expectedOutcome?: string;
    commonMistakes?: string;
}

interface WeeklyRoadmapDisplayProps {
    weeklyPlan: WeeklyPlanItem[];
    careerGoal: string;
    targetCompany?: string;
    completedWeeks?: number[];
    onWeekComplete?: (weekIndex: number, isComplete: boolean) => void;
}

export function WeeklyRoadmapDisplay({
    weeklyPlan,
    careerGoal,
    targetCompany,
    completedWeeks = [],
    onWeekComplete
}: WeeklyRoadmapDisplayProps) {
    if (!weeklyPlan || weeklyPlan.length === 0) {
        return (
            <div className="text-center py-12 space-y-4">
                <div className="flex justify-center">
                    <div className="p-4 bg-muted rounded-full">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">No Weekly Plan Available</h3>
                <p className="text-sm text-muted-foreground">
                    Your personalized weekly roadmap will appear here once generated
                </p>
            </div>
        );
    }

    const getPhaseColor = (phase?: string, week?: number) => {
        if (!phase && week) {
            if (week <= 3) return 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20';
            if (week <= 6) return 'from-purple-500/10 to-pink-500/10 border-purple-500/20';
            if (week <= 9) return 'from-orange-500/10 to-red-500/10 border-orange-500/20';
            return 'from-emerald-500/10 to-green-500/10 border-emerald-500/20';
        }
        return 'from-blue-500/10 to-cyan-500/10 border-blue-500/20';
    };

    const getWeekIcon = (week: number) => {
        if (week <= 3) return '🚀';
        if (week <= 6) return '📈';
        if (week <= 9) return '⚡';
        return '🏆';
    };

    const parseDailyTasks = (taskString: string) => {
        // Parse "Monday: Task (X hours)" format
        const dayPattern = /^(\w+):\s*(.+?)\s*\(\s*(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\s*\)?/i;
        const match = taskString.match(dayPattern);
        if (match) {
            return {
                day: match[1],
                task: match[2],
                hours: parseFloat(match[3])
            };
        }
        return null;
    };

    const getTotalWeeklyHours = (dailyTasks?: string[]) => {
        if (!dailyTasks) return 0;
        return dailyTasks.reduce((sum, task) => {
            const parsed = parseDailyTasks(task);
            return sum + (parsed?.hours || 0);
        }, 0);
    };

    const progressPercentage = Math.round((completedWeeks.length / weeklyPlan.length) * 100);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 w-1.5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                    <h3 className="text-2xl font-bold text-foreground">
                        Your {weeklyPlan.length}-Week Personalized Learning Path
                    </h3>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                    {`Adaptive ${weeklyPlan.length}-week plan designed specifically for ${careerGoal}${targetCompany ? ` at ${targetCompany}` : ''} based on your background`}
                </p>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card border-cyan-500/20 dark:border-cyan-500/10 hover:border-cyan-500/40 transform hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">{progressPercentage}%</p>
                        </div>
                        <div className="w-full bg-cyan-200/30 dark:bg-cyan-900/20 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">{completedWeeks.length} of {weeklyPlan.length} weeks</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-purple-500/20 dark:border-purple-500/10 hover:border-purple-500/40 transform hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Weekly</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                    ~{Math.round(weeklyPlan.reduce((sum, w) => sum + getTotalWeeklyHours(w.dailyTasks), 0) / weeklyPlan.length)}h
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-orange-500/20 dark:border-orange-500/10 hover:border-orange-500/40 transform hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Weeks</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">{weeklyPlan.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Cards */}
            <div className="space-y-4">
                {weeklyPlan.map((week, index) => {
                    const isCompleted = completedWeeks.includes(index);
                    const nextWeek = index + 1;
                    const dailyTasks = week.dailyTasks || [];
                    const totalWeekHours = getTotalWeeklyHours(dailyTasks);

                    return (
                        <Card
                            key={index}
                            className={`glass-card ${getPhaseColor(week.phase, week.week)} border transition-all duration-500 overflow-hidden hover:scale-[1.01] ${
                                isCompleted
                                    ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 neo-glow'
                                    : 'border-white/10 hover:border-[#0D5CDF]/50'
                            }`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="text-2xl">{getWeekIcon(week.week)}</div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">
                                                    Week {week.week}: {week.title}
                                                </CardTitle>
                                                {week.phase && (
                                                    <Badge variant="outline" className="mt-1.5">{week.phase}</Badge>
                                                )}
                                            </div>
                                        </div>
                                        {week.why && (
                                            <p className="text-sm text-muted-foreground mt-2 ml-11">{week.why}</p>
                                        )}
                                    </div>

                                    {/* Completion Button */}
                                    {onWeekComplete && (
                                        <Button
                                            variant={isCompleted ? "default" : "outline"}
                                            size="sm"
                                            className={`flex-shrink-0 ${
                                                isCompleted
                                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                    : 'border-border hover:border-gray-400'
                                            }`}
                                            onClick={() => onWeekComplete(index, !isCompleted)}
                                        >
                                            {isCompleted ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Done
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-4 h-4 mr-2" />
                                                    Complete
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Daily Breakdown */}
                                {dailyTasks.length > 0 && (
                                    <div className="space-y-2">
                                        <h5 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                            <Clock className="w-4 h-4" />
                                            Daily Breakdown ({totalWeekHours}h total)
                                        </h5>
                                        <div className="space-y-2 pl-6">
                                            {dailyTasks.map((task, dayIndex) => {
                                                const parsed = parseDailyTasks(task);
                                                return (
                                                    <div key={dayIndex} className="text-sm">
                                                        <div className="flex items-start justify-between gap-2 p-2 bg-background/50 rounded border border-border/50">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-foreground">
                                                                    {parsed?.day || task.split(':')[0]}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {parsed?.task || task.split(':')[1]?.trim() || task}
                                                                </p>
                                                            </div>
                                                            {parsed?.hours && (
                                                                <Badge variant="secondary" className="flex-shrink-0">
                                                                    {parsed.hours}h
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Learning Goals */}
                                {week.learningGoals && week.learningGoals.length > 0 && (
                                    <div className="space-y-2">
                                        <h5 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                            <Target className="w-4 h-4" />
                                            Learning Goals
                                        </h5>
                                        <ul className="space-y-1 pl-6">
                                            {week.learningGoals.map((goal, idx) => (
                                                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                                    <span className="text-cyan-600 dark:text-cyan-400">→</span>
                                                    {goal}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Key Tasks */}
                                {week.tasks && week.tasks.length > 0 && (
                                    <div className="space-y-2">
                                        <h5 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                            <Code2 className="w-4 h-4" />
                                            Tasks
                                        </h5>
                                        <ul className="space-y-1 pl-6">
                                            {week.tasks.slice(0, 4).map((task, idx) => (
                                                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                                                    <span className="font-bold text-purple-600 dark:text-purple-400">{idx + 1}.</span>
                                                    {task}
                                                </li>
                                            ))}
                                            {week.tasks.length > 4 && (
                                                <li className="text-sm text-muted-foreground italic">
                                                    +{week.tasks.length - 4} more tasks
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {/* Expected Outcome */}
                                {week.expectedOutcome && (
                                    <div className="p-3 bg-emerald-100/50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800">
                                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">✅ Expected Outcome</p>
                                        <p className="text-sm text-muted-foreground">{week.expectedOutcome}</p>
                                    </div>
                                )}

                                {/* Common Mistakes */}
                                {week.commonMistakes && (
                                    <div className="p-3 bg-yellow-100/50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                                        <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">⚠️ Common Mistakes</p>
                                        <p className="text-sm text-muted-foreground">{week.commonMistakes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
