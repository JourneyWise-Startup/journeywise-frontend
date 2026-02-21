"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    ArrowRight, CheckCircle2, XCircle, AlertCircle, Target,
    TrendingUp, Star, Zap, BookOpen, Code2, Lightbulb
} from 'lucide-react';

interface SkillGapComparisonProps {
    currentSkills: any[];
    skillGaps: any[];
    skillComparison: any;
    careerGoal: string;
    targetCompany?: string;
}

export function SkillGapComparison({
    currentSkills,
    skillGaps,
    skillComparison,
    careerGoal,
    targetCompany
}: SkillGapComparisonProps) {
    // Categorize skills
    const yourStrengths = skillComparison?.yourLevel?.strength || [];
    const yourIntermediate = skillComparison?.yourLevel?.intermediate || [];
    const yourWeak = skillComparison?.yourLevel?.weak || [];
    const requiredForRole = skillComparison?.requiredForRole || [];
    const requiredForCompany = skillComparison?.requiredForCompany || [];
    const gapAnalysis = skillComparison?.gap || [];
    const roadmapFocus = skillComparison?.roadmapFocus || [];

    // Calculate gap metrics
    const totalSkillsNeeded = requiredForRole.length;
    const skillsYouHave = yourStrengths.length + yourIntermediate.length;
    const skillGapCount = skillsYouHave < totalSkillsNeeded ? totalSkillsNeeded - skillsYouHave : 0;
    const readinessPercentage = totalSkillsNeeded > 0 ? Math.round((skillsYouHave / totalSkillsNeeded) * 100) : 0;

    return (
        <div className="space-y-6 mt-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Skills Required */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-50/30 dark:from-blue-950/40 dark:to-blue-950/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Skills Required</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{totalSkillsNeeded}</p>
                        <p className="text-xs text-muted-foreground mt-1">For {careerGoal}</p>
                    </CardContent>
                </Card>

                {/* Skills You Have */}
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-50/30 dark:from-emerald-950/40 dark:to-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">You Have</p>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{skillsYouHave}</p>
                        <p className="text-xs text-muted-foreground mt-1">From your profile</p>
                    </CardContent>
                </Card>

                {/* Skills Gap */}
                <Card className="bg-gradient-to-br from-red-50 to-red-50/30 dark:from-red-950/40 dark:to-red-950/20 border-red-200 dark:border-red-800">
                    <CardContent className="p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">To Learn</p>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-400">{skillGapCount}</p>
                        <p className="text-xs text-muted-foreground mt-1">Critical gaps</p>
                    </CardContent>
                </Card>

                {/* Readiness Score */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-50/30 dark:from-purple-950/40 dark:to-purple-950/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Readiness</p>
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{readinessPercentage}%</p>
                        <div className="mt-2 w-full bg-purple-200 dark:bg-purple-900/30 rounded-full h-1.5">
                            <div 
                                className="bg-purple-600 dark:bg-purple-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${readinessPercentage}%` }}
                            ></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Skill Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Your Current Skills */}
                <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                            Your Strengths
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                            Skills you already have ({yourStrengths.length})
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {yourStrengths.length > 0 ? (
                            yourStrengths.map((skill: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 p-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-900/50">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                    <span className="text-sm font-medium text-foreground">{typeof skill === 'string' ? skill : skill.name}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground italic text-center py-4">
                                No strong skills detected yet. That's okay - you're starting your journey!
                            </p>
                        )}

                        {yourIntermediate.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Intermediate Skills</p>
                                <div className="space-y-2">
                                    {yourIntermediate.map((skill: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2 p-2 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200/50 dark:border-yellow-900/50">
                                            <TrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                                            <span className="text-sm font-medium text-foreground">{typeof skill === 'string' ? skill : skill.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Skills to Develop */}
                <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                            <AlertCircle className="w-5 h-5" />
                            Critical Gaps to Close
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                            Must learn these ({skillGapCount} skills)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {skillGaps && skillGaps.length > 0 ? (
                            <div className="space-y-3">
                                {skillGaps.slice(0, 6).map((gap: any, i: number) => (
                                    <div
                                        key={i}
                                        className={`p-3 rounded-lg border-l-4 group hover:shadow-md transition-all ${
                                            gap.company_requirement
                                                ? 'border-l-red-600 bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50'
                                                : 'border-l-orange-600 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/50'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-semibold text-sm text-foreground">{gap.skill}</h4>
                                            {gap.company_requirement && (
                                                <Badge className="text-xs bg-red-600/20 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-700">
                                                    Essential
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2">{gap.why}</p>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                Difficulty: <strong className="capitalize">{gap.difficulty}</strong>
                                            </span>
                                            <span className="text-muted-foreground">
                                                ~{gap.estimatedHoursToMastery}h
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic text-center py-4">
                                No major skill gaps - Great starting point!
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Roadmap Focus & Company-Specific */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Roadmap Focus */}
                <Card className="bg-gradient-to-br from-cyan-50 to-blue-50/50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200/50 dark:border-cyan-900/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
                            <Target className="w-5 h-5" />
                            Roadmap Focus (Top Priority)
                        </CardTitle>
                        <CardDescription>Focus on these first - highest impact</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {roadmapFocus && roadmapFocus.length > 0 ? (
                            roadmapFocus.map((focus: any, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-cyan-200/50 dark:border-cyan-900/50">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-foreground">{typeof focus === 'string' ? focus : focus.skill}</p>
                                        {typeof focus === 'object' && focus.reason && (
                                            <p className="text-xs text-muted-foreground mt-1">{focus.reason}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Roadmap priorities will be highlighted in weekly plan</p>
                        )}
                    </CardContent>
                </Card>

                {/* Company-Specific Requirements */}
                {targetCompany && requiredForCompany && requiredForCompany.length > 0 && (
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200/50 dark:border-purple-900/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2 text-purple-700 dark:text-purple-400">
                                <Zap className="w-5 h-5" />
                                {targetCompany} Specifics
                            </CardTitle>
                            <CardDescription>Skills highly valued at {targetCompany}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {requiredForCompany.map((skill: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-purple-200/50 dark:border-purple-900/50">
                                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 fill-current" />
                                    <span className="text-sm font-medium text-foreground">{typeof skill === 'string' ? skill : skill.name}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Overall Gap Summary */}
            {gapAnalysis && (
                <Card className="bg-card border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Your Learning Path Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-foreground leading-relaxed">
                            {typeof gapAnalysis === 'string'
                                ? gapAnalysis
                                : Array.isArray(gapAnalysis)
                                    ? gapAnalysis.join(' • ')
                                    : 'Your roadmap is customized based on your resume, target role, and company requirements.'}
                        </p>

                        {/* Learning Timeline */}
                        <div className="mt-6 pt-6 border-t border-border">
                            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                How to Close These Gaps
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                                    <div>
                                        <p className="text-sm font-medium">Follow the weekly plan</p>
                                        <p className="text-xs text-muted-foreground">Each week targets specific gaps with curated resources</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                                    <div>
                                        <p className="text-sm font-medium">Practice with real projects</p>
                                        <p className="text-xs text-muted-foreground">Build 3 projects that progressively level up your skills</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold">3</div>
                                    <div>
                                        <p className="text-sm font-medium">Practice interview questions</p>
                                        <p className="text-xs text-muted-foreground">Use LeetCode & InterviewBit to practice real interview questions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
