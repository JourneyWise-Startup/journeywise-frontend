"use client"
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, FileText, Map, Users, TrendingUp, CheckCircle2, Rocket, Bot } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-16 pb-16 md:pb-20 lg:pt-32 lg:pb-40">
        {/* Background Gradients - Responsive Sizes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[500px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[600px] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-3xl -z-10" />

        <div className="container flex flex-col items-center gap-6 md:gap-8 text-center px-4 mx-auto max-w-6xl">
          <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs md:text-sm font-medium text-cyan-600 dark:text-cyan-300 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-0">
            <span className="flex h-2 w-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
            Built for India's Future Leaders 🇮🇳
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight md:leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 text-foreground">
            Stop Guessing. <br className="block md:hidden" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 dark:from-cyan-400 dark:via-blue-400 dark:to-blue-500">
              Start Achieving.
            </span>
          </h1>

          <p className="max-w-[42rem] leading-relaxed text-muted-foreground text-sm sm:text-base md:text-lg md:leading-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Confused about your career path? Get a personalized
            <span className="font-semibold text-cyan-600 dark:text-cyan-300 mx-1">AI-powered roadmap</span>
            based on your resume, goals, and real success stories from Tier-2/3 college graduates.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full justify-center animate-in fade-in zoom-in duration-700 delay-300">
            <Link href={isAuthenticated ? "/dashboard" : "/login?tab=register"} className="flex-1 sm:flex-none">
              <Button size="lg" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25 transition-all w-full sm:w-auto font-semibold">
                {isAuthenticated ? "Go to Dashboard" : "Start Your Journey"} <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
              </Button>
            </Link>
            <Link href="/journeys" className="flex-1 sm:flex-none">
              <Button size="lg" variant="outline" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg border-primary/20 text-muted-foreground hover:bg-primary/5 hover:text-primary w-full sm:w-auto font-semibold transition-all duration-300">
                Explore Success Stories
              </Button>
            </Link>
          </div>

          {/* Stats / Trust */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-6 md:mt-8 text-muted-foreground text-xs md:text-sm font-medium">
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <CheckCircle2 className="h-4 w-4 text-cyan-500 flex-shrink-0" /> <span className="hidden sm:inline">Free for Students</span><span className="sm:hidden">Free</span>
            </div>
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <CheckCircle2 className="h-4 w-4 text-cyan-500 flex-shrink-0" /> <span className="hidden sm:inline">AI-Powered Analysis</span><span className="sm:hidden">AI Powered</span>
            </div>
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <CheckCircle2 className="h-4 w-4 text-cyan-500 flex-shrink-0" /> <span className="hidden sm:inline">Community Support</span><span className="sm:hidden">Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition / How It Works */}
      <section className="container py-16 md:py-20 px-4 mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-foreground">
            From Confusion to <span className="text-blue-600 dark:text-blue-400">Clarity</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            We simplify your career journey into 3 actionable steps. No more overwhelming advice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <Card className="bg-card/50 border-border hover:border-cyan-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-500/10">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg md:text-xl text-foreground">1. Upload Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base text-muted-foreground">
                Our advanced JourneyWise AI analyzes your current skills, projects, and education to understand exactly where you stand today.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border hover:border-cyan-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-500/10">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Map className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <CardTitle className="text-lg md:text-xl text-foreground">2. Get Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base text-muted-foreground">
                Receive a month-by-month actionable plan. We tell you exactly what to learn, where to learn it (free resources), and what to build.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border hover:border-cyan-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-500/10">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-lg md:text-xl text-foreground">3. Accelerate Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base text-muted-foreground">
                Track your progress, get mentorship from seniors who've been there, and land your dream job with confidence.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground">
                Everything you need to <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
                  crack product companies
                </span>
              </h2>
              <div className="space-y-4 md:space-y-6">
                <div className="flex gap-3 md:gap-4 group">
                  <div className="h-9 md:h-10 w-9 md:w-10 flex-shrink-0 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-4 md:h-5 w-4 md:w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm md:text-lg text-foreground">Skill Gap Analysis</h3>
                    <p className="text-muted-foreground text-xs md:text-base">Know exactly what skills you are missing for your target role.</p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4 group">
                  <div className="h-9 md:h-10 w-9 md:w-10 flex-shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-4 md:h-5 w-4 md:w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm md:text-lg text-foreground">Community & Mentorship</h3>
                    <p className="text-muted-foreground text-xs md:text-base">Connect with students from similar backgrounds and learn together.</p>
                  </div>
                </div>
                <div className="flex gap-3 md:gap-4 group">
                  <div className="h-9 md:h-10 w-9 md:w-10 flex-shrink-0 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-4 md:h-5 w-4 md:w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm md:text-lg text-foreground">ATS-Optimized Resumes</h3>
                    <p className="text-muted-foreground text-xs md:text-base">Get tips to make your resume stand out to recruiters.</p>
                  </div>
                </div>
              </div>
              <Link href={isAuthenticated ? "/dashboard" : "/login?tab=register"} className="inline-block">
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 text-base md:text-lg font-semibold h-11 md:h-12 px-6 md:px-8">
                  {isAuthenticated ? "Go to Dashboard" : "Join JourneyWise Today"}
                </Button>
              </Link>
            </div>

            {/* Visual Element / Placeholder for Dashboard Preview */}
            <div className="relative rounded-lg md:rounded-xl border border-border bg-card p-2 shadow-2xl shadow-cyan-500/10 flex items-center justify-center overflow-hidden group min-h-[300px] md:min-h-[500px]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 md:w-64 h-40 md:h-64 bg-cyan-500/10 rounded-full blur-[60px] md:blur-[100px] group-hover:bg-cyan-500/20 transition-colors duration-500"></div>

              <div className="relative z-10 text-center space-y-3 md:space-y-4 p-6 md:p-8 bg-card/80 backdrop-blur-md rounded-lg md:rounded-xl border border-border max-w-xs group-hover:border-cyan-500/30 transition-all duration-300">
                <Rocket className="h-12 md:h-16 w-12 md:w-16 text-cyan-500 mx-auto mb-2 md:mb-4 animate-bounce" />
                <h3 className="text-xl md:text-2xl font-bold text-foreground">Your Success Awaits</h3>
                <p className="text-muted-foreground text-sm md:text-base">Join 10,000+ students transforming their careers with JourneyWise.</p>
                <Link href={isAuthenticated ? "/dashboard" : "/login?tab=register"} className="block">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm md:text-base font-semibold h-9 md:h-10">Get Started for Free</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Feature Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-600/5 rounded-full blur-3xl -z-10" />
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 lg:order-1 relative rounded-lg md:rounded-xl border border-purple-500/20 bg-card p-4 md:p-6 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 min-h-[250px] md:min-h-auto">
              {/* Mock Chat UI */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex gap-2 md:gap-3">
                  <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] md:text-xs flex-shrink-0 font-bold text-cyan-600 dark:text-cyan-400">U</div>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2.5 md:p-3 text-xs md:text-sm max-w-[80%] text-foreground">How do I start learning React?</div>
                </div>
                <div className="flex gap-2 md:gap-3 flex-row-reverse">
                  <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0"><Bot className="w-3 md:w-4 h-3 md:h-4 text-purple-600 dark:text-purple-400" /></div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2.5 md:p-3 text-xs md:text-sm max-w-[80%] text-left text-foreground">Start with the official documentation. Focus on components, props, and state...</div>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] md:text-xs flex-shrink-0 font-bold text-cyan-600 dark:text-cyan-400">U</div>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2.5 md:p-3 text-xs md:text-sm max-w-[80%] text-foreground">What projects should I build?</div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-4 md:space-y-6">
              <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs md:text-sm font-medium text-purple-600 dark:text-purple-300">
                <Bot className="w-3 h-3 mr-2" /> New Feature
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground">
                Stuck? Just Ask <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                  JourneyWise AI
                </span>
              </h2>
              <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">
                Get instant answers to your coding doubts, career questions, and roadmap confusion. Our AI mentor is available 24/7 to guide you.
              </p>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-center text-sm md:text-base text-muted-foreground"><CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-purple-500 mr-2 flex-shrink-0" /> Instant Coding Help</li>
                <li className="flex items-center text-sm md:text-base text-muted-foreground"><CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-purple-500 mr-2 flex-shrink-0" /> Career Guidance</li>
                <li className="flex items-center text-sm md:text-base text-muted-foreground"><CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-purple-500 mr-2 flex-shrink-0" /> Personalized Explanations</li>
              </ul>
              <Link href={isAuthenticated ? "/chat" : "/login?tab=register"} className="inline-block">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-500 text-white text-base md:text-lg font-semibold h-11 md:h-12 px-6 md:px-8 transition-all duration-300">
                  Chat with AI Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Crack Interviews Feature Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-cyan-500/5 to-blue-500/5">
        <div className="absolute top-0 left-0 w-[500px] md:w-[800px] h-[400px] md:h-[600px] bg-cyan-600/10 rounded-full blur-3xl -z-10" />
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs md:text-sm font-bold text-cyan-600 dark:text-cyan-300 animate-pulse">
                <span className="animate-pulse mr-2">🎯</span> NEW: AI Interview War Room
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-foreground">
                Got an Interview Call?<br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
                  Convert It Into an Offer
                </span>
              </h2>
              <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">
                JourneyWise's <strong>Crack Interviews</strong> is your personal interview coach + company researcher + mock interviewer. Get AI-powered gap analysis, role-specific questions, company insights, and unlimited mock practice.
              </p>
              <ul className="space-y-3 md:space-y-4">
                <li className="flex items-start text-sm md:text-base text-foreground gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Resume vs JD Gap Analysis</strong> - Know exactly what to emphasize and what to prepare</span>
                </li>
                <li className="flex items-start text-sm md:text-base text-foreground gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Role-Specific Interview Questions</strong> - Get the actual questions they'll ask, with model answers</span>
                </li>
                <li className="flex items-start text-sm md:text-base text-foreground gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Company Intelligence</strong> - Culture, tech stack, what they look for</span>
                </li>
                <li className="flex items-start text-sm md:text-base text-foreground gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Mock Interviews with AI Feedback</strong> - Practice and get scored instantly</span>
                </li>
                <li className="flex items-start text-sm md:text-base text-foreground gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Interview Strategy Guide</strong> - How to introduce yourself, answer tough questions, negotiate salary</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link href={isAuthenticated ? "/interviews/new" : "/login?tab=register"} className="flex-1 sm:flex-none">
                  <Button size="lg" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-base md:text-lg font-semibold h-11 md:h-12 px-6 md:px-8 shadow-lg shadow-cyan-500/30 transition-all duration-300">
                    🎯 Crack My Interview
                  </Button>
                </Link>
                <Link href="/interviews" className="flex-1 sm:flex-none">
                  <Button size="lg" variant="outline" className="w-full text-base md:text-lg font-semibold h-11 md:h-12 px-6 md:px-8 border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300">
                    View All Preps
                  </Button>
                </Link>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                ✨ <strong>Core Promise:</strong> If you got the interview call, JourneyWise helps you convert it into an offer.
              </p>
            </div>
            <div className="relative">
              {/* Visual Element for Interview War Room */}
              <div className="relative rounded-lg md:rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-6 md:p-8 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(6,182,212,0.03)_100%)] rounded-lg md:rounded-xl pointer-events-none" />
                <div className="relative z-10 space-y-4 md:space-y-6">
                  <div>
                    <p className="text-xs md:text-sm text-cyan-600 dark:text-cyan-400 font-semibold mb-2">Interview Readiness</p>
                    <div className="flex items-end gap-3 mb-3">
                      <span className="text-3xl md:text-4xl font-bold text-cyan-600">72</span>
                      <span className="text-muted-foreground text-xs md:text-sm pb-1">/100</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[72%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-cyan-500/20 pt-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">📋</span>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-semibold text-foreground">Gap Analysis Complete</p>
                        <p className="text-xs text-muted-foreground">2 critical skills to prepare</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">❓</span>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-semibold text-foreground">12 Interview Questions</p>
                        <p className="text-xs text-muted-foreground">With model answers</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">🏢</span>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-semibold text-foreground">Company Intelligence</p>
                        <p className="text-xs text-muted-foreground">Tech stack & culture insights</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">🎤</span>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-semibold text-foreground">Mock Interview Practice</p>
                        <p className="text-xs text-muted-foreground">Get AI feedback on answers</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    </div>
                  </div>

                  <Link href={isAuthenticated ? "/interviews/new" : "/login?tab=register"} className="block pt-2">
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm md:text-base font-semibold h-10 md:h-11">
                      Start War Room
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-20 px-4 mx-auto text-center max-w-4xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 md:mb-6 text-foreground">
          Ready to define your future?
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
          Don&apos;t let confusion hold you back. The comprehensive roadmap you need is just one click away.
        </p>
        <Link href={isAuthenticated ? "/dashboard" : "/login?tab=register"} className="inline-block">
          <Button size="lg" className="h-12 md:h-16 px-8 md:px-10 text-base md:text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-xl hover:shadow-cyan-500/30 transition-all duration-300">
            {isAuthenticated ? "Go to Dashboard" : "Create Free Account"}
          </Button>
        </Link>
      </section>
    </div>
  );
}
