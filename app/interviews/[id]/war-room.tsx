"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Loader2, Zap, CheckCircle2, AlertCircle, BookOpen, Play, Send, Lock, Star, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export function WarRoomContent({ prep, token, prepId }: any) {
    const [isMockOpen, setIsMockOpen] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
    const [mockState, setMockState] = useState<'intro' | 'question' | 'feedback' | 'end'>('intro');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState<any>(null);
    const [mockScores, setMockScores] = useState<number[]>([]);
    const [notes, setNotes] = useState(prep?.notes || '');
    const [savingNotes, setSavingNotes] = useState(false);

    const gapAnalysis = prep?.gapAnalysis || {};
    const questions = prep?.questions || [];
    const company = prep?.companyInsights || {};
    const strategy = prep?.strategy || {};
    const mcqs = prep?.mcqs || [];
    const readiness = prep?.readiness || {};
    const mockInterviews = prep?.mockInterviews || [];
    const isPaid = prep?.isPaid || false;
    const readinessScore = prep?.readinessScore || 0;
    const hasResume = !!prep?.resumeText;

    // Persist checked items
    // Persist checked items
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
        (prep?.checklist as Record<string, boolean>) || {}
    );

    useEffect(() => {
        if (prep?.checklist) {
            setCheckedItems((prep.checklist as Record<string, boolean>) || {});
        }
    }, [prep]);

    const handleCheck = async (key: string, checked: boolean) => {
        const newChecks = { ...checkedItems, [key]: checked };
        setCheckedItems(newChecks);

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${prepId}/checklist`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ checklist: newChecks })
            });
        } catch (error) {
            console.error('Failed to update checklist', error);
            toast.error('Failed to save progress');
        }
    };

    const getDynamicScore = () => {
        if (hasResume) return readinessScore;
        let score = 0;
        const estimatedTotal = (gapAnalysis.hiddenStrengths?.length || 0) +
            (gapAnalysis.criticalGaps?.length || 0) +
            (gapAnalysis.redFlags?.length || 0) +
            (gapAnalysis.toAvoid?.length || 0) || 10;
        const checkedCount = Object.values(checkedItems).filter(Boolean).length;
        const checkScore = Math.min(100, (checkedCount / estimatedTotal) * 100);
        const mockScore = Math.min(100, mockInterviews.length * 50);
        const noteScore = notes.length > 50 ? 100 : 0;
        score = (checkScore * 0.4) + (mockScore * 0.4) + (noteScore * 0.2);
        return Math.round(Math.max(readinessScore, score));
    };
    const displayScore = getDynamicScore();

    const startMock = () => {
        if (!isPaid && mockInterviews.length >= 1) {
            toast.error('Free tier: 1 mock per interview. Upgrade to unlimited!');
            return;
        }
        setIsMockOpen(true);
        setMockState('intro');
    };

    const submitMockAnswer = async () => {
        if (!userAnswer.trim()) {
            toast.error('Please provide an answer');
            return;
        }
        setSubmitting(true);
        try {
            const q = questions[currentQIndex];
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${prepId}/mock-answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    questionNumber: currentQIndex,
                    question: q.q,
                    answer: userAnswer
                })
            });
            const data = await res.json();
            setCurrentFeedback(data);
            setMockScores([...mockScores, data.score || 5]);
            setMockState('feedback');
        } catch (error) {
            toast.error('Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    };

    const nextQuestion = () => {
        const maxQuestions = isPaid ? questions.length : Math.min(questions.length, 5);
        if (currentQIndex < maxQuestions - 1) {
            setCurrentQIndex(prev => prev + 1);
            setMockState('question');
            setUserAnswer('');
            setCurrentFeedback(null);
        } else {
            setMockState('end');
        }
    };

    const saveNotes = async () => {
        setSavingNotes(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${prepId}/notes`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ notes })
            });
            toast.success('Notes saved!');
        } catch (error) {
            toast.error('Failed to save notes');
        } finally {
            setSavingNotes(false);
        }
    };

    const unlockPaid = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${prepId}/unlock-paid`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Premium features unlocked!');
            window.location.reload();
        } catch (error) {
            toast.error('Failed to unlock');
        }
    };

    return (
        <>
            {/* Readiness Header */}
            <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-2xl p-6 mb-8 backdrop-blur-xl bg-slate-900/40 shadow-2xl shadow-cyan-500/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Overall Readiness</p>
                        <div className="flex items-end gap-3">
                            <div className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">{displayScore}</div>
                            <p className="text-sm text-muted-foreground pb-1">/ 100</p>
                        </div>
                        <Progress value={displayScore} className="mt-3" />
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-muted-foreground">Interview Readiness</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Progress value={readiness.overallScore || 50} className="flex-1 h-2" />
                                <span className="text-sm font-semibold">{readiness.overallScore || 50}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Practice Score</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Progress value={readiness.practiceScore || 50} className="flex-1 h-2" />
                                <span className="text-sm font-semibold">{readiness.practiceScore || 50}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div>
                            <p className="text-sm font-semibold mb-3">Quick Actions</p>
                            <Button onClick={startMock} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2 mb-2">
                                <Play className="h-4 w-4" /> Mock Interview
                            </Button>
                            {!isPaid && (
                                <Button onClick={unlockPaid} variant="outline" className="w-full flex items-center justify-center gap-2">
                                    <Star className="h-4 w-4" /> Unlock Premium
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="gap-analysis" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-transparent p-0">
                    <TabsTrigger value="gap-analysis" className="px-3 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Gap Analysis</TabsTrigger>
                    <TabsTrigger value="questions" className="px-3 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Interview Q&A</TabsTrigger>
                    <TabsTrigger value="company" className="px-3 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Company Intel</TabsTrigger>
                    <TabsTrigger value="strategy" className="px-3 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">Strategy</TabsTrigger>
                    <TabsTrigger value="notes" className="px-3 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">My Notes</TabsTrigger>
                </TabsList>

                {/* Gap Analysis Tab */}
                <TabsContent value="gap-analysis" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Skills You Need to Emphasize</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {(gapAnalysis.hiddenStrengths || gapAnalysis.toHighlight || []).map((skill: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                            <Checkbox
                                                id={`strength-${i}`}
                                                checked={checkedItems[`strength-${i}`] || false}
                                                onCheckedChange={(c: boolean) => handleCheck(`strength-${i}`, c)}
                                                className="mt-0.5 data-[state=checked]:bg-green-600"
                                            />
                                            <span className={`text-sm ${checkedItems[`strength-${i}`] ? 'line-through text-muted-foreground' : ''}`}>{skill}</span>
                                        </div>
                                    ))}
                                    {(gapAnalysis.skillsMatch || [])
                                        .filter((s: any) => s.status === 'MATCH')
                                        .map((s: any, i: number) => (
                                            <div key={`match-${i}`} className="flex items-start gap-2 p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded">
                                                <Star className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{s.skill}</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Critical Gaps to Prepare</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {(gapAnalysis.criticalGaps || []).map((gap: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                                            <Checkbox
                                                id={`gap-${i}`}
                                                checked={checkedItems[`gap-${i}`] || false}
                                                onCheckedChange={(c: boolean) => handleCheck(`gap-${i}`, c)}
                                                className="mt-0.5 data-[state=checked]:bg-amber-600"
                                            />
                                            <span className={`text-sm ${checkedItems[`gap-${i}`] ? 'line-through text-muted-foreground' : ''}`}>{gap}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-lg">What to Avoid Mentioning</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {(gapAnalysis.redFlags || gapAnalysis.toAvoid || []).map((item: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border-l-2 border-red-600">
                                            <Checkbox
                                                id={`avoid-${i}`}
                                                checked={checkedItems[`avoid-${i}`] || false}
                                                onCheckedChange={(c: boolean) => handleCheck(`avoid-${i}`, c)}
                                                className="mt-0.5 data-[state=checked]:bg-red-600"
                                            />
                                            <span className={`text-sm text-red-700 dark:text-red-400 ${checkedItems[`avoid-${i}`] ? 'line-through opacity-70' : ''}`}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Questions Tab */}
                <TabsContent value="questions" className="space-y-4">
                    {!isPaid && (
                        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <CardContent className="pt-6 flex items-start gap-3">
                                <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Free tier: 5 questions visible</p>
                                    <Button onClick={unlockPaid} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                        Unlock All Questions (₹99)
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <div className="space-y-3">
                        {(isPaid ? questions : questions.slice(0, 5)).map((q: any, idx: number) => (
                            <Card key={idx} className="cursor-pointer hover:border-cyan-500/50 transition-colors" onClick={() => setActiveQuestion(activeQuestion === idx ? null : idx)}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex gap-2 mb-2">
                                                <Badge className="bg-cyan-600 text-white">{q.type}</Badge>
                                                <Badge variant="outline" className="capitalize">{q.difficulty}</Badge>
                                            </div>
                                            <h3 className="font-semibold">{q.q}</h3>
                                        </div>
                                    </div>
                                </CardHeader>
                                {activeQuestion === idx && (
                                    <CardContent className="space-y-4 border-t pt-4">
                                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200">
                                            <p className="font-semibold text-green-900 dark:text-green-300 text-sm mb-2">✓ Good Answer Strategy</p>
                                            <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
                                                {typeof q.goodAnswer === 'string' ? (
                                                    <p>{q.goodAnswer}</p>
                                                ) : (
                                                    <>
                                                        {q.goodAnswer?.framework && <p><strong>Framework:</strong> {q.goodAnswer.framework}</p>}
                                                        {q.goodAnswer?.keyPoints && <p><strong>Key Points:</strong> {q.goodAnswer.keyPoints.join(', ')}</p>}
                                                        {q.goodAnswer?.sampleScript && (
                                                            <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded border border-green-200/50 italic text-green-900 dark:text-green-100">
                                                                "{q.goodAnswer.sampleScript}"
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200">
                                            <p className="font-semibold text-red-900 dark:text-red-300 text-sm mb-2">✗ Avoid This</p>
                                            <p className="text-sm text-red-800 dark:text-red-200">{q.badAnswer}</p>
                                            {q.improvementTip && <p className="text-sm mt-2 font-medium text-red-900 dark:text-red-300">💡 Tip: {q.improvementTip}</p>}
                                        </div>
                                        <div className="text-sm text-muted-foreground italic border-t pt-3">
                                            <strong>What they're testing:</strong> {q.whatTestedFor}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Company Intel Tab */}
                <TabsContent value="company" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Culture Decoder</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                {company.cultureDecoder || company.overview || 'No culture data generated.'}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Interview Style & Expectations</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                {company.interviewStyle || company.whatTheyLookFor || 'No style data generated.'}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Hiring Priorities</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {(company.hiringPriorities || company.techStack || []).map((tech: string, i: number) => (
                                    <Badge key={i} variant="secondary">{tech}</Badge>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Key Values & Insider Tips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {(company.keyValues && company.keyValues.length > 0) && (
                                    <div className="mb-3">
                                        <p className="text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground">Values</p>
                                        <ul className="list-disc pl-4 text-sm space-y-1">
                                            {company.keyValues.map((v: string, i: number) => <li key={i}>{v}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {(company.insiderTips && company.insiderTips.length > 0) && (
                                    <div>
                                        <p className="text-xs font-semibold mb-1 uppercase tracking-wider text-muted-foreground mt-2">Insider Tips</p>
                                        <ul className="list-disc pl-4 text-sm space-y-1 text-cyan-700 dark:text-cyan-400">
                                            {company.insiderTips.map((t: string, i: number) => <li key={i}>{t}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200">
                        <CardContent className="pt-6 text-xs text-muted-foreground">
                            ⓘ {company.disclaimer || 'Insights based on public sources. May not be 100% accurate.'}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Strategy Tab */}
                <TabsContent value="strategy" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Introduction (Elevator Pitch)</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm whitespace-pre-wrap font-mono bg-muted/50 p-4 rounded border-l-4 border-cyan-500">
                            {strategy.elevatorPitch || strategy.introduction || 'Pitch data unavailable.'}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" /> Strengths & Do's
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                {strategy.strengthsToLeverage && (
                                    <div>
                                        <p className="font-semibold mb-2">Strengths to Leverage:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {strategy.strengthsToLeverage.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {strategy.dos && (
                                    <div>
                                        <p className="font-semibold mb-2 mt-4 text-emerald-700">Definitely Do:</p>
                                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                            {strategy.dos.map((d: string, i: number) => <li key={i}>{d}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" /> Weaknesses & Don'ts
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                {strategy.weaknessesToNeutralize && (
                                    <div>
                                        <p className="font-semibold mb-2">Weaknesses to Neutralize:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {strategy.weaknessesToNeutralize.map((w: string, i: number) => <li key={i}>{w}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {strategy.donts && (
                                    <div>
                                        <p className="font-semibold mb-2 mt-4 text-red-700">Definitely Avoid:</p>
                                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                            {strategy.donts.map((d: string, i: number) => <li key={i}>{d}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Questions YOU Should Ask</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {(strategy.questionsToAskInterviewer || strategy.questionsToAsk || []).map((q: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <span className="text-cyan-600 dark:text-cyan-400 font-bold">Q:</span>
                                        <span>{q}</span>
                                    </li>
                                ))}
                                {!(strategy.questionsToAskInterviewer || strategy.questionsToAsk) && (
                                    <p className="text-sm text-muted-foreground">No questions generated.</p>
                                )}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Other Strategy Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {strategy.dayBeforeChecklist && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200">
                                    <p className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-300">Day Before Checklist</p>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        {strategy.dayBeforeChecklist.map((c: string, i: number) => <li key={i}>{c}</li>)}
                                    </ul>
                                </div>
                            )}
                            {strategy.salaryNegotiationTip && (
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
                                    <p className="font-semibold text-sm text-amber-900 dark:text-amber-300 mb-2">Salary Negotiation Tip</p>
                                    <p className="text-sm">{strategy.salaryNegotiationTip}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Questions YOU Should Ask</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {strategy.questionsToAsk?.map((q: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <span className="text-cyan-600 dark:text-cyan-400 font-bold">Q:</span>
                                        <span>{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Study Notes</CardTitle>
                            <CardDescription>Jot down things to remember before the interview</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add your notes here..." className="h-40" />
                            <Button onClick={saveNotes} disabled={savingNotes} className="w-full">
                                {savingNotes ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                Save Notes
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Mock Interview Dialog */}
            <Dialog open={isMockOpen} onOpenChange={setIsMockOpen}>
                <DialogContent className="max-w-3xl">
                    {mockState === 'intro' && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Ready for Mock Interview?</DialogTitle>
                            </DialogHeader>
                            <div className="py-8 text-center space-y-4">
                                <div className="text-5xl">🎤</div>
                                <p>Test yourself with AI-simulated interview questions</p>
                                <p className="text-sm text-muted-foreground">You can answer by typing. Get instant feedback.</p>
                                {!isPaid && (
                                    <p className="text-xs bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200">
                                        Free tier: 1 mock per interview
                                    </p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={() => { setMockState('question'); setCurrentQIndex(0); }} className="w-full h-11 bg-cyan-600 hover:bg-cyan-700">
                                    Start Interview
                                </Button>
                            </DialogFooter>
                        </>
                    )}

                    {mockState === 'question' && questions.length > 0 && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between border-b pb-4 border-slate-800">
                                    <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Q{currentQIndex + 1} / {isPaid ? questions.length : Math.min(questions.length, 5)}</Badge>
                                    <span className="text-xs text-muted-foreground px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700/50">{questions[currentQIndex]?.type}</span>
                                </div>
                            </DialogHeader>
                            <div className="py-6 space-y-6">
                                {/* AI Message */}
                                <div className="flex gap-4 p-5 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm shadow-xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                                        <Zap className="h-5 w-5 text-white animate-pulse" />
                                    </div>
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <p className="font-semibold text-cyan-400 text-sm mb-1">AI Interviewer</p>
                                        <h3 className="text-lg text-slate-200 leading-relaxed font-medium">{questions[currentQIndex]?.q}</h3>
                                    </div>
                                </div>
                                
                                {/* User Input */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <p className="text-sm font-semibold text-slate-300">Your Response</p>
                                        {submitting && (
                                            <span className="text-xs text-cyan-400 flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                                <span className="ml-1 animate-pulse">AI is analyzing...</span>
                                            </span>
                                        )}
                                    </div>
                                    <Textarea 
                                        value={userAnswer} 
                                        onChange={(e) => setUserAnswer(e.target.value)} 
                                        disabled={submitting} 
                                        placeholder="Type your answer here..." 
                                        className="h-40 bg-slate-900/60 border-slate-700/50 focus:border-cyan-500/50 resize-none text-slate-200 rounded-xl shadow-inner transition-all p-4 disabled:opacity-50" 
                                    />
                                </div>
                            </div>
                            <DialogFooter className="pt-2 border-t border-slate-800">
                                <Button onClick={submitMockAnswer} disabled={submitting || !userAnswer.trim()} className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-xl shadow-cyan-500/20 text-md font-semibold transition-all hover:scale-[1.01]">
                                    {submitting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Send className="mr-2 h-5 w-5" />}
                                    {submitting ? 'Analyzing response metrics...' : 'Submit Answer'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}

                    {mockState === 'feedback' && currentFeedback && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2">
                                    <span>Feedback</span>
                                    <Badge className={currentFeedback.score >= 7 ? 'bg-green-600' : 'bg-amber-600'}>
                                        {currentFeedback.score}/10
                                    </Badge>
                                </div>
                            </DialogHeader>
                            <ScrollArea className="h-[400px] p-4 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded border border-emerald-200">
                                        <p className="font-semibold text-sm text-emerald-800 dark:text-emerald-300 mb-1">✓ What Worked</p>
                                        <ul className="list-disc pl-4 text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
                                            {currentFeedback.whatWorked?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                                        </ul>
                                    </div>
                                    <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded border border-red-200">
                                        <p className="font-semibold text-sm text-red-800 dark:text-red-300 mb-1">✗ To Improve</p>
                                        <ul className="list-disc pl-4 text-xs text-red-700 dark:text-red-400 space-y-1">
                                            {currentFeedback.whatToImprove?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                                        </ul>
                                    </div>
                                </div>

                                {currentFeedback.panelVerdict && (
                                    <div className="space-y-3">
                                        <p className="font-semibold text-sm">Expert Panel Verdict</p>
                                        <div className="grid gap-2">
                                            <div className="border border-slate-200 dark:border-slate-800 p-3 rounded bg-slate-50 dark:bg-slate-900/50">
                                                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Technical Expert</p>
                                                <p className="text-sm mt-1">{currentFeedback.panelVerdict.technicalExpert}</p>
                                            </div>
                                            <div className="border border-slate-200 dark:border-slate-800 p-3 rounded bg-slate-50 dark:bg-slate-900/50">
                                                <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase">HR Coach</p>
                                                <p className="text-sm mt-1">{currentFeedback.panelVerdict.hrCoach}</p>
                                            </div>
                                            <div className="border border-slate-200 dark:border-slate-800 p-3 rounded bg-slate-50 dark:bg-slate-900/50">
                                                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Hiring Manager</p>
                                                <p className="text-sm mt-1">{currentFeedback.panelVerdict.hiringManager}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="font-semibold text-sm mb-2">Overall Coaching Feedback</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{currentFeedback.feedback}</p>
                                </div>

                                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200">
                                    <p className="font-semibold text-sm text-cyan-900 dark:text-cyan-300 mb-2">The Perfect Answer (Model Response)</p>
                                    <p className="text-sm text-cyan-800 dark:text-cyan-200 italic">"{currentFeedback.betterAnswer || currentFeedback.improvedAnswer}"</p>
                                </div>
                            </ScrollArea>
                            <DialogFooter>
                                <Button onClick={nextQuestion} className="w-full">
                                    {currentQIndex < (isPaid ? questions.length : 5) - 1 ? 'Next Question' : 'Complete'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}

                    {mockState === 'end' && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Interview Complete!</DialogTitle>
                            </DialogHeader>
                            <div className="py-8 text-center space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Average Score</p>
                                    <p className="text-5xl font-bold text-cyan-600">
                                        {mockScores.length > 0 ? (mockScores.reduce((a, b) => a + b) / mockScores.length).toFixed(1) : '0'}
                                        <span className="text-2xl">/10</span>
                                    </p>
                                </div>
                                <p className="text-sm text-muted-foreground">Questions answered: {mockScores.length}</p>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setIsMockOpen(false)} className="w-full">Close</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
