import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, Shield, Target, Zap, Flame, CheckCircle2, AlertCircle, Activity, Clock, CheckSquare, BookOpen, Lightbulb } from 'lucide-react';
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
      <Card className="glass-panel border-blue-500/20 dark:border-blue-500/10 neo-glow">
        <CardContent className="p-12 flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative p-4 bg-blue-500/10 rounded-2xl">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Analyzing Your Readiness
            </h3>
            <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
              Recalculating your career trajectory based on recent activity...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!readinessData) {
    return (
      <Card className="glass-panel border-red-500/20 dark:border-red-500/10">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-base font-bold text-foreground">Readiness Assessment Unavailable</p>
            <p className="text-sm text-muted-foreground">{error || 'Please refresh to attempt recalculation.'}</p>
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
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* INITIAL ASSESSMENT CARD - Enhanced */}
        <Card className="glass-card border-blue-500/20 dark:border-blue-500/10 hover:border-blue-500/40 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              Baseline Assessment
            </CardTitle>
            <CardDescription className="text-xs">
              AI evaluation at start of journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tighter">
                {readinessData.initialScore}
                <span className="text-xl text-muted-foreground ml-1">/99</span>
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Initial Profile Score</p>
            </div>
            
            <Separator className="bg-white/10 dark:bg-white/5" />
            
            <div className="space-y-3">
              <p className="text-xs font-bold text-foreground/80 uppercase tracking-widest flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Baseline Factors
              </p>
              <ul className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Resume & Skill Matching</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Industry Benchmark Data</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Profile Sophistication</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* CURRENT READINESS SCORE CARD - Enhanced */}
        <Card className="glass-panel border-emerald-500/20 dark:border-emerald-500/10 neo-glow transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Real-time Readiness
            </CardTitle>
            <CardDescription className="text-xs">
              Live score based on your effort
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent tracking-tighter">
                  {readinessData.dynamicScore}
                  <span className="text-xl text-muted-foreground ml-1">/99</span>
                </div>
                <Badge className={`${getConfidenceBadgeColor(readinessData.confidenceLevel)} border shadow-sm`}>
                  {readinessData.confidenceLevel}
                </Badge>
              </div>
              
              {improvementValue !== 0 && (
                <div className={`p-4 rounded-2xl border text-center min-w-[80px] ${
                  improvementValue > 0 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-orange-500/5 border-orange-500/20 text-orange-600 dark:text-orange-400'
                }`}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">{improvementValue > 0 ? 'Gain' : 'Drop'}</p>
                  <div className="flex items-center justify-center gap-1 font-black text-xl">
                    {improvementValue > 0 ? <TrendingUp className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
                    {improvementValue > 0 ? '+' : ''}{improvementValue}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-widest">Goal Progress</span>
                <span className="text-emerald-600 dark:text-emerald-400">{Math.round((readinessData.dynamicScore / 99) * 100)}%</span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  style={{ width: `${(readinessData.dynamicScore / 99) * 100}%` }}
                />
              </div>
            </div>

            <Separator className="bg-white/10 dark:bg-white/5" />

            <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Tasks</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Skills</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Projects</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Activity</div>
            </div>
          </CardContent>
        </Card>
      </div>      {/* ENGAGEMENT METRICS CARD - Enhanced */}
      {readinessData.engagementMetrics && (
        <Card className="glass-card border-violet-500/20 dark:border-violet-500/10 hover:border-violet-500/40 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <div className="p-1.5 bg-violet-500/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              Consistency & Effort
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Days Active', value: readinessData.engagementMetrics.daysActive, icon: Clock, color: 'violet' },
                { label: 'Tasks Done', value: readinessData.engagementMetrics.tasksCompleted, icon: CheckSquare, color: 'emerald' },
                { label: 'Resources', value: readinessData.engagementMetrics.resourcesUsed, icon: BookOpen, color: 'blue' },
                { label: 'Last Active', value: readinessData.engagementMetrics.lastActiveDate 
                  ? new Date(readinessData.engagementMetrics.lastActiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'Never', icon: Flame, color: 'orange' }
              ].map((m, i) => (
                <div key={i} className="p-4 bg-white/5 dark:bg-black/20 rounded-xl border border-white/10 dark:border-white/5 backdrop-blur-sm group/item hover:bg-white/10 dark:hover:bg-black/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <m.icon className={`w-3.5 h-3.5 text-${m.color}-500`} />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{m.label}</p>
                  </div>
                  <p className="text-2xl font-black text-foreground">{m.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SCORE BREAKDOWN */}
      {readinessData.factors && (
        <Card className="glass-card border-white/10 dark:border-white/5 overflow-hidden">
          <CardHeader className="pb-3 bg-white/5 dark:bg-black/20">
            <CardTitle className="text-base font-bold">Calculation Breakdown</CardTitle>
            <CardDescription className="text-xs">
              Weighting based on industry readiness benchmarks
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ScoreFactor 
                label="Task Velocity" 
                value={readinessData.factors.taskCompletion}
                icon={<CheckCircle2 className="w-4 h-4" />}
                color="cyan"
              />
              <ScoreFactor 
                label="Resource Depth" 
                value={readinessData.factors.resourceCompletion}
                icon={<BookOpen className="w-4 h-4" />}
                color="blue"
              />
              <ScoreFactor 
                label="Skill Delta" 
                value={readinessData.factors.skillImprovement}
                icon={<TrendingUp className="w-4 h-4" />}
                color="emerald"
              />
              <ScoreFactor 
                label="Applied Knowledge" 
                value={readinessData.factors.projectCompletion}
                icon={<Shield className="w-4 h-4" />}
                color="purple"
              />
              <ScoreFactor 
                label="Platform Activity" 
                value={readinessData.factors.engagement}
                icon={<Flame className="w-4 h-4" />}
                color="orange"
              />
              <ScoreFactor 
                label="Learning Streak" 
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
        <Card className="glass-card border-cyan-500/20 dark:border-cyan-500/10 hover:border-cyan-500/40 transform hover:-translate-y-0.5 transition-all duration-300">
          <CardHeader className="pb-3 border-b border-white/5 bg-cyan-500/5">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Strategic Growth Steps
            </CardTitle>
            <CardDescription className="text-xs">
              Personalized AI suggestions to boost your readiness
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <ul className="space-y-3">
              {readinessData.recommendations.slice(0, 5).map((rec, idx) => (
                <li key={idx} className="flex gap-4 group/rec">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xs font-black border border-cyan-500/20 group-hover/rec:bg-cyan-500/20 transition-colors">
                    {idx + 1}
                  </div>
                  <span className="text-sm text-foreground/80 leading-relaxed group-hover/rec:text-foreground transition-colors">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* INFO FOOTER */}
      <div className="p-6 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/10 rounded-2xl relative overflow-hidden group">
        <div className="absolute -left-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed relative z-10 font-medium">
          <strong className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mr-2">Core Principle:</strong> 
          Your readiness score is a living metric. It only grows through <span className="text-foreground font-bold underline decoration-blue-500/30">consistent daily effort</span>. 
          Completing tasks, building projects, and engaging with resources are the only ways to climb towards your 99/99 goal.
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
    cyan: 'text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    blue: 'text-blue-600 dark:text-blue-400 border-blue-500/20',
    emerald: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    purple: 'text-purple-600 dark:text-purple-400 border-purple-500/20',
    orange: 'text-orange-600 dark:text-orange-400 border-orange-500/20',
    yellow: 'text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
  };

  const bgClasses: { [key: string]: string } = {
    cyan: 'bg-cyan-500',
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className={`p-4 rounded-xl border glass-card hover:translate-x-1 transition-all duration-300 ${colorClasses[color].split(' ')[2]}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={colorClasses[color].split(' ').slice(0, 2).join(' ')}>{icon}</span>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest line-clamp-1">{label}</p>
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <p className="text-2xl font-black text-foreground">{value}</p>
        <span className="text-xs font-bold text-muted-foreground">%</span>
      </div>
      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <div 
          className={`h-full ${bgClasses[color]} transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
