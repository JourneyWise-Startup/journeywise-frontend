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
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6 mb-8">
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
                                            <p className="font-semibold text-green-900 dark:text-green-300 text-sm mb-2">✓ Good Answer</p>
                                            <p className="text-sm text-green-800 dark:text-green-200">{q.goodAnswer}</p>
                                        </div>
                                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200">
                                            <p className="font-semibold text-red-900 dark:text-red-300 text-sm mb-2">✗ Avoid This</p>
                                            <p className="text-sm text-red-800 dark:text-red-200">{q.badAnswer}</p>
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
                                <CardTitle className="text-sm">Company Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                {company.overview}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Tech Stack</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {company.techStack?.map((tech: string, i: number) => (
                                    <Badge key={i} variant="secondary">{tech}</Badge>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">What They're Looking For</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                {company.whatTheyLookFor}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Company Size & Stage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm font-semibold mb-1">{company.size}</p>
                                <p className="text-xs text-muted-foreground mb-2">{company.hiringPatterns}</p>
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
                            <CardTitle>Your Introduction (30 seconds)</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm whitespace-pre-wrap font-mono bg-muted/50 p-4 rounded">
                            {strategy.introduction}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Why Should We Hire You?</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm whitespace-pre-wrap">
                            {strategy.whyHireYou}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Hard Questions to Prepare For</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {strategy.handleNoExperience && (
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                                    <p className="font-semibold text-sm text-amber-900 dark:text-amber-300 mb-2">If they ask: "You don't have X experience"</p>
                                    <p className="text-sm">{strategy.handleNoExperience}</p>
                                </div>
                            )}
                            {strategy.salaryNegotiation && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                                    <p className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-2">Salary Negotiation</p>
                                    <p className="text-sm">{strategy.salaryNegotiation}</p>
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
                                <div className="flex items-center justify-between">
                                    <Badge>Q{currentQIndex + 1} / {isPaid ? questions.length : Math.min(questions.length, 5)}</Badge>
                                    <span className="text-xs text-muted-foreground">{questions[currentQIndex]?.type}</span>
                                </div>
                            </DialogHeader>
                            <div className="py-4">
                                <h3 className="font-semibold text-lg mb-4">{questions[currentQIndex]?.q}</h3>
                                <Textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Type your answer..." className="h-40" />
                            </div>
                            <DialogFooter>
                                <Button onClick={submitMockAnswer} disabled={submitting || !userAnswer.trim()} className="w-full">
                                    {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                                    Submit Answer
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
                            <ScrollArea className="h-[300px] p-4 space-y-4">
                                <div>
                                    <p className="font-semibold text-sm mb-2">AI Feedback</p>
                                    <p className="text-sm text-muted-foreground">{currentFeedback.feedback}</p>
                                </div>
                                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg border border-cyan-200">
                                    <p className="font-semibold text-sm text-cyan-900 dark:text-cyan-300 mb-2">Better Answer</p>
                                    <p className="text-xs text-cyan-800 dark:text-cyan-200">{currentFeedback.improvedAnswer}</p>
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
