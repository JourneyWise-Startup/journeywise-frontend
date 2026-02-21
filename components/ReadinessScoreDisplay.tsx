import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, Shield, Target, Zap, Flame, CheckCircle2, AlertCircle, Activity, Clock, CheckSquare, BookOpen } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface ReadinessData {
  dynamicScore: number;
  initialScore: number;
  confidenceLevel: string;
  factors?: {
    taskCompletion: number;
    resourceCompletion: number;
    skillImprovement: number;
    projectCompletion: number;
    engagement: number;
    consistency: number;
  };
  recommendations?: string[];
  lastUpdated?: string;
  engagementMetrics?: {
    daysActive: number;
    tasksCompleted: number;
    resourcesUsed: number;
    lastActiveDate: string;
  };
}

interface ReadinessScoreDisplayProps {
  roadmapId: string;
  token: string;
  initialScore: number;
  onScoreUpdate?: (data: ReadinessData) => void;
}

export function ReadinessScoreDisplay({ 
  roadmapId, 
  token, 
  initialScore,
  onScoreUpdate 
}: ReadinessScoreDisplayProps) {
  const [readinessData, setReadinessData] = useState<ReadinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastEngagementTime, setLastEngagementTime] = useState<number>(Date.now());
  const [isActive, setIsActive] = useState(true);

  // Track user engagement - only increases score when genuinely active
  useEffect(() => {
    const trackActivity = () => {
      setLastEngagementTime(Date.now());
      setIsActive(true);
      // Send activity ping to backend to update engagement metrics
      trackUserActivity();
    };

    const events = ['click', 'scroll', 'keydown', 'mousemove', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, trackActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, trackActivity);
      });
    };
  }, []);

  // Check for inactivity every minute
  useEffect(() => {
    const inactivityCheck = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastEngagementTime;
      const fiveMinutesMs = 5 * 60 * 1000;
      
      if (timeSinceLastActivity > fiveMinutesMs) {
        setIsActive(false);
      } else {
        setIsActive(true);
      }
    }, 60000);

    return () => clearInterval(inactivityCheck);
  }, [lastEngagementTime]);

  const trackUserActivity = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/readiness/activity/${roadmapId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          type: 'page_engagement'
        })
      });
    } catch (error) {
      // Silently fail - don't disrupt user experience
      console.error('Activity tracking error:', error);
    }
  };

  useEffect(() => {
    fetchReadinessData();
    // Fetch updates every 30 seconds when user is active for real-time progress feedback
    // Fetch every 120 seconds when inactive
    const interval = setInterval(() => {
      fetchReadinessData();
    }, isActive ? 30000 : 120000);
    return () => clearInterval(interval);
  }, [roadmapId, isActive, token]);

  const fetchReadinessData = async () => {
    try {
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/readiness/report/${roadmapId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        const readinessScores = data.report?.readinessScores || {};
        const factors = data.report?.factors || {};
        const recommendations = data.report?.recommendations || [];
        const engagementMetrics = data.report?.engagementMetrics || {
          daysActive: 0,
          tasksCompleted: 0,
          resourcesUsed: 0,
          lastActiveDate: new Date().toISOString()
        };
        
        const formattedData: ReadinessData = {
          dynamicScore: readinessScores.dynamicScore || initialScore,
          initialScore: readinessScores.initialAIScore || initialScore,
          confidenceLevel: readinessScores.confidenceLevel || 'Getting Started',
          factors,
          recommendations,
          engagementMetrics,
          lastUpdated: new Date().toISOString()
        };
        
        setReadinessData(formattedData);
        onScoreUpdate?.(formattedData);
      } else {
        setReadinessData({
          dynamicScore: initialScore,
          initialScore: initialScore,
          confidenceLevel: getConfidenceLevel(initialScore),
          engagementMetrics: {
            daysActive: 0,
            tasksCompleted: 0,
            resourcesUsed: 0,
            lastActiveDate: new Date().toISOString()
          }
        });
      }
    } catch (error) {
      console.error('Error fetching readiness data:', error);
      setReadinessData({
        dynamicScore: initialScore,
        initialScore: initialScore,
        confidenceLevel: getConfidenceLevel(initialScore),
        engagementMetrics: {
          daysActive: 0,
          tasksCompleted: 0,
          resourcesUsed: 0,
          lastActiveDate: new Date().toISOString()
        }
      });
    } finally {
      if (loading) setLoading(false);
    }
  };

  const getConfidenceLevel = (score: number): string => {
    if (score >= 80) return 'Highly Ready';
    if (score >= 60) return 'Well Prepared';
    if (score >= 40) return 'On Track';
    if (score >= 20) return 'Building Foundation';
    return 'Getting Started';
  };

  const getConfidenceBadgeColor = (level: string): string => {
    switch (level) {
      case 'Highly Ready':
        return 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'Well Prepared':
        return 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700';
      case 'On Track':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Building Foundation':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700';
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50/80 via-cyan-50/50 to-blue-100/30 dark:from-blue-950/40 dark:via-cyan-950/30 dark:to-blue-950/20 border-2 border-blue-200/60 dark:border-blue-800/40 shadow-lg">
        <CardContent className="p-12 flex flex-col items-center justify-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse" />
            <Loader2 className="w-12 h-12 animate-spin text-cyan-600 dark:text-cyan-400 relative" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-foreground">Analyzing your readiness...</p>
            <p className="text-xs text-muted-foreground">Calculating scores based on your progress</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!readinessData) {
    return (
      <Card className="bg-gradient-to-br from-red-50/80 to-orange-50/50 dark:from-red-950/40 dark:to-orange-950/30 border-2 border-red-200/60 dark:border-red-800/40 shadow-lg">
        <CardContent className="p-6 flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">Unable to load readiness data</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
              {error || 'Please refresh the page to try again.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreImprovement = () => {
    return readinessData.dynamicScore - readinessData.initialScore;
  };

  const improvementValue = getScoreImprovement();
  const improvementPercent = readinessData.initialScore > 0 
    ? ((improvementValue / readinessData.initialScore) * 100).toFixed(0)
    : '0';

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Status Badge - Enhanced */}
      {!isActive && (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-2 border-amber-200/60 dark:border-amber-800/40 rounded-lg flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="p-2 bg-amber-500/10 rounded-lg flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            <strong>Away from learning:</strong> Your readiness score reflects active learning. Keep engaging with the roadmap to unlock your full potential! 🚀
          </p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* INITIAL ASSESSMENT CARD - Enhanced */}
        <Card className="bg-gradient-to-br from-slate-50/60 via-blue-50/40 to-blue-100/30 dark:from-slate-900/40 dark:via-blue-950/30 dark:to-blue-950/20 border-2 border-blue-200/50 dark:border-blue-800/40 hover:border-blue-300/80 dark:hover:border-blue-700/60 transition-all duration-300 group shadow-sm hover:shadow-md">
          <CardHeader className="pb-3 relative">
            <div className="absolute -top-8 right-4 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300" />
            <CardTitle className="text-lg flex items-center gap-2 relative z-10">
              <span className="text-2xl">📋</span> Initial Assessment
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              AI evaluation at the start of your journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {readinessData.initialScore}
                <span className="text-lg text-muted-foreground ml-2 bg-clip-text text-clip">/99</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your AI-evaluated starting readiness based on resume analysis
              </p>
            </div>
            
            <Separator className="my-3 bg-blue-200/50 dark:bg-blue-800/50" />
            
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="text-lg">🔍</span> What this means:
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><span className="text-cyan-600 dark:text-cyan-400">✓</span> Based on your resume & skills</li>
                <li className="flex items-center gap-2"><span className="text-cyan-600 dark:text-cyan-400">✓</span> Your current ability level</li>
                <li className="flex items-center gap-2"><span className="text-cyan-600 dark:text-cyan-400">✓</span> Your baseline for improvement</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* CURRENT READINESS SCORE CARD - Enhanced */}
        <Card className="bg-gradient-to-br from-emerald-50/60 via-green-50/40 to-teal-100/30 dark:from-emerald-950/40 dark:via-green-950/30 dark:to-teal-950/20 border-2 border-emerald-200/50 dark:border-emerald-800/40 hover:border-emerald-300/80 dark:hover:border-emerald-700/60 transition-all duration-300 group shadow-sm hover:shadow-md ring-2 ring-emerald-300/30 dark:ring-emerald-700/30">
          <CardHeader className="pb-3 relative">
            <div className="absolute -top-8 right-4 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-xl group-hover:from-emerald-500/20 group-hover:to-green-500/20 transition-all duration-300" />
            <CardTitle className="text-lg flex items-center gap-2 relative z-10">
              <span className="text-2xl">🎯</span> Current Readiness Score
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Your actual progress from real-world learning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                  {readinessData.dynamicScore}
                  <span className="text-lg text-muted-foreground ml-2 bg-clip-text text-clip">/99</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge 
                  className={`text-xs font-semibold ${getConfidenceBadgeColor(readinessData.confidenceLevel)}`}
                >
                  {readinessData.confidenceLevel}
                </Badge>
                {improvementValue !== 0 && (
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${improvementValue > 0 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-700/50' : 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-300/50 dark:border-orange-700/50'}`}>
                    {improvementValue > 0 ? <TrendingUp className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                    <span>{improvementValue > 0 ? '+' : ''}{improvementValue}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>📊</span> Progress
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{Math.round((readinessData.dynamicScore / 99) * 100)}%</span>
              </div>
              <Progress 
                value={(readinessData.dynamicScore / 99) * 100} 
                className="h-2.5 rounded-full overflow-hidden"
              />
            </div>

            <Separator className="my-3 bg-emerald-200/50 dark:bg-emerald-800/50" />

            <div className="space-y-2 text-sm">
              <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="text-lg">⬆️</span> What increases this:
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><span className="text-emerald-600 dark:text-emerald-400">✓</span> Completing roadmap tasks</li>
                <li className="flex items-center gap-2"><span className="text-emerald-600 dark:text-emerald-400">✓</span> Using quality resources</li>
                <li className="flex items-center gap-2"><span className="text-emerald-600 dark:text-emerald-400">✓</span> Building real projects</li>
                <li className="flex items-center gap-2"><span className="text-emerald-600 dark:text-emerald-400">✓</span> Active engagement daily</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ENGAGEMENT METRICS CARD - Enhanced */}
      {readinessData.engagementMetrics && (
        <Card className="bg-gradient-to-br from-violet-50/60 via-purple-50/40 to-fuchsia-100/30 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-fuchsia-950/20 border-2 border-violet-200/50 dark:border-violet-800/40 shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="pb-3 relative">
            <div className="absolute -top-8 right-4 w-16 h-16 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-xl group-hover:from-violet-500/20 group-hover:to-purple-500/20 transition-all duration-300" />
            <CardTitle className="text-lg flex items-center gap-2 relative z-10">
              <span className="text-2xl">📈</span> Your Engagement Stats
            </CardTitle>
            <CardDescription className="text-xs mt-1 relative z-10">
              Real activity metrics that power your readiness growth
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 bg-gradient-to-br from-white/60 to-violet-50/50 dark:from-slate-900/40 dark:to-violet-950/30 rounded-lg border border-violet-200/60 dark:border-violet-800/40 hover:border-violet-300/80 dark:hover:border-violet-700/60 transition-all duration-200 hover:shadow-md group/metric">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-violet-500/10 group-hover/metric:bg-violet-500/20 rounded-lg transition-all duration-200">
                    <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Days Active</p>
                </div>
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  {readinessData.engagementMetrics.daysActive}
                </p>
                <p className="text-xs text-muted-foreground mt-1">total</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-white/60 to-emerald-50/50 dark:from-slate-900/40 dark:to-emerald-950/30 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 hover:border-emerald-300/80 dark:hover:border-emerald-700/60 transition-all duration-200 hover:shadow-md group/metric">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-emerald-500/10 group-hover/metric:bg-emerald-500/20 rounded-lg transition-all duration-200">
                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tasks Done</p>
                </div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {readinessData.engagementMetrics.tasksCompleted}
                </p>
                <p className="text-xs text-muted-foreground mt-1">completed</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-white/60 to-blue-50/50 dark:from-slate-900/40 dark:to-blue-950/30 rounded-lg border border-blue-200/60 dark:border-blue-800/40 hover:border-blue-300/80 dark:hover:border-blue-700/60 transition-all duration-200 hover:shadow-md group/metric">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-500/10 group-hover/metric:bg-blue-500/20 rounded-lg transition-all duration-200">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Resources</p>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {readinessData.engagementMetrics.resourcesUsed}
                </p>
                <p className="text-xs text-muted-foreground mt-1">used</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-white/60 to-orange-50/50 dark:from-slate-900/40 dark:to-orange-950/30 rounded-lg border border-orange-200/60 dark:border-orange-800/40 hover:border-orange-300/80 dark:hover:border-orange-700/60 transition-all duration-200 hover:shadow-md group/metric">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-orange-500/10 group-hover/metric:bg-orange-500/20 rounded-lg transition-all duration-200">
                    <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Last Active</p>
                </div>
                <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  {readinessData.engagementMetrics.lastActiveDate 
                    ? new Date(readinessData.engagementMetrics.lastActiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Never'
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SCORE BREAKDOWN */}
      {readinessData.factors && (
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Score Breakdown - 6 Factors</CardTitle>
            <CardDescription>
              How your readiness score is calculated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <ScoreFactor 
                label="Task Completion (25%)" 
                value={readinessData.factors.taskCompletion}
                icon={<CheckCircle2 className="w-4 h-4" />}
                color="cyan"
              />
              <ScoreFactor 
                label="Resource Usage (20%)" 
                value={readinessData.factors.resourceCompletion}
                icon={<BookOpen className="w-4 h-4" />}
                color="blue"
              />
              <ScoreFactor 
                label="Skill Growth (25%)" 
                value={readinessData.factors.skillImprovement}
                icon={<TrendingUp className="w-4 h-4" />}
                color="emerald"
              />
              <ScoreFactor 
                label="Projects Built (15%)" 
                value={readinessData.factors.projectCompletion}
                icon={<Shield className="w-4 h-4" />}
                color="purple"
              />
              <ScoreFactor 
                label="Engagement (10%)" 
                value={readinessData.factors.engagement}
                icon={<Flame className="w-4 h-4" />}
                color="orange"
              />
              <ScoreFactor 
                label="Consistency (5%)" 
                value={readinessData.factors.consistency}
                icon={<Zap className="w-4 h-4" />}
                color="yellow"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* RECOMMENDATIONS */}
      {readinessData.recommendations && readinessData.recommendations.length > 0 && (
        <Card className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 border-sky-200 dark:border-sky-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              💡 Recommended Next Steps
            </CardTitle>
            <CardDescription>
              Personalized suggestions to boost your readiness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {readinessData.recommendations.slice(0, 5).map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold flex-shrink-0">{idx + 1}.</span>
                  <span className="text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* INFO FOOTER */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
          <strong>⚡ How Your Score Grows:</strong> Your readiness score only increases when you actively engage with the roadmap. 
          Complete tasks, use quality resources, build projects, and maintain consistency. No engagement = No score increase. 
          The "Initial Assessment" is your starting point; "Current Readiness Score" reflects your actual effort and progress. 💪
        </p>
      </div>
    </div>
  );
}

interface ScoreFactorProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function ScoreFactor({ label, value, icon, color }: ScoreFactorProps) {
  const colorClasses: { [key: string]: string } = {
    cyan: 'text-cyan-600 dark:text-cyan-400',
    blue: 'text-blue-600 dark:text-blue-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    yellow: 'text-yellow-600 dark:text-yellow-400'
  };

  return (
    <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className={`${colorClasses[color]}`}>{icon}</span>
        <p className="text-xs font-semibold text-foreground line-clamp-1">{label}</p>
      </div>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <span className="text-xs text-muted-foreground mb-0.5">%</span>
      </div>
      <Progress 
        value={value} 
        className="h-1 mt-2"
      />
    </div>
  );
}
