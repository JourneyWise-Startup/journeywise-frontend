"use client"
import Link from 'next/link';
import { 
    Linkedin, Heart, ExternalLink, 
    MessageSquare, Target, FileText, Rocket, Sparkles, MapPin, Globe
} from 'lucide-react';
import { Logo } from './Logo';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand Section */}
                    <div className="flex flex-col space-y-5">
                        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
                            <Logo className="h-8 md:h-10 w-auto text-blue-600 dark:text-blue-500" />
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Empowering the next generation of professionals with AI-driven career guidance and real success stories.
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-500">
                                <Globe className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Proudly Made in India
                            </span>
                            <div className="flex gap-1.5 translate-y-[-1px]">
                                <div className="h-3 w-4 bg-[#FF9933] rounded-sm"></div>
                                <div className="h-3 w-4 bg-white border border-gray-100 rounded-sm flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full border-[0.5px] border-blue-900"></div>
                                </div>
                                <div className="h-3 w-4 bg-[#138808] rounded-sm"></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tools */}
                    <div className="flex flex-col space-y-5">
                        <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-blue-500" /> AI Tools
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/upload" className="text-muted-foreground hover:text-blue-500 transition-colors text-sm flex items-center gap-2 group">
                                    <Rocket className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    Roadmap Builder
                                </Link>
                            </li>
                            <li>
                                <Link href="/resume-analyzer" className="text-muted-foreground hover:text-emerald-500 transition-colors text-sm flex items-center gap-2 group">
                                    <FileText className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    Resume Analyzer
                                </Link>
                            </li>
                            <li>
                                <Link href="/interviews" className="text-muted-foreground hover:text-amber-500 transition-colors text-sm flex items-center gap-2 group">
                                    <Target className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    Interview Preparation
                                </Link>
                            </li>
                            <li>
                                <Link href="/chat" className="text-muted-foreground hover:text-purple-500 transition-colors text-sm flex items-center gap-2 group visualization-none">
                                    <MessageSquare className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    Career AI Chat
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Founder Section */}
                    <div className="flex flex-col space-y-5">
                        <h3 className="font-bold text-sm uppercase tracking-wider">Meet the Founder</h3>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/30 border border-border/50 hover:border-blue-500/30 transition-all duration-300 group shadow-sm hover:shadow-md">
                            <div className="relative">
                                <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-background ring-offset-2 ring-offset-accent">
                                    <img 
                                        src="/founder.png" 
                                        alt="Sameer Ali - Founder & CEO" 
                                        className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl ring-1 ring-background">
                                    <Linkedin className="h-2.5 w-2.5" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm group-hover:text-blue-500 transition-colors">Sameer Ali</span>
                                <span className="text-xs text-muted-foreground mb-2">Founder & CEO</span>
                                <Link 
                                    href="https://www.linkedin.com/in/sameer0288" 
                                    target="_blank"
                                    className="text-[10px] font-bold uppercase tracking-tighter text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:brightness-110"
                                >
                                    Founders Profile <ExternalLink className="h-2.5 w-2.5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Reach Out Section */}
                    <div className="flex flex-col space-y-5 lg:items-end">
                        <h3 className="font-bold text-sm uppercase tracking-wider">Stay Connected</h3>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-muted-foreground lg:text-right">
                                Join our professional community on LinkedIn for career insights and updates.
                            </p>
                            <Link 
                                href="https://www.linkedin.com/company/journeywise-ai/" 
                                target="_blank"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 transform hover:-translate-y-1 font-semibold group"
                                title="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                Official LinkedIn Page
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 order-2 md:order-1">
                        © {currentYear} <span className="font-semibold text-foreground">JourneyWise AI</span>. 
                        Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 transform hover:scale-125 transition-transform cursor-pointer" /> in India.
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground order-1 md:order-2">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                        <Link href="/contact" className="hover:text-foreground transition-colors">Support</Link>
                    </div>
                </div>
            </div>

            {/* Subtle background gradient at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        </footer>
    );
}
