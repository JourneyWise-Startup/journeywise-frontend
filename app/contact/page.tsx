"use client"
import { useState } from 'react';
import { 
    Mail, MessageSquare, Send, User, 
    Linkedin, MapPin, Globe, Sparkles, 
    ShieldCheck, CheckCircle2, AlertCircle, Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                if (res.status === 429) {
                    throw new Error("Too many requests. Please try again later to prevent spam.");
                }
                throw new Error(errorData.message || "Failed to send message.");
            }

            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden pt-20 pb-20">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 -left-60 w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-cyan-600/10 dark:bg-cyan-900/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="container max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> 24/7 Support for Students
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                        Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Touch</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Have a question about your career roadmap? Want to partner with JourneyWise? 
                        We're here to help you navigate your professional journey.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Left side: Contact Form */}
                    <div className="lg:col-span-3 animate-in fade-in slide-in-from-left-4 duration-1000">
                        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />
                            <CardContent className="p-8 md:p-10">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-500" /> Full Name
                                            </label>
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-muted-foreground/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-blue-500" /> Email Address
                                            </label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-muted-foreground/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-blue-500" /> Subject
                                        </label>
                                        <input 
                                            type="text" 
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="How can we help?"
                                            className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-muted-foreground/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-blue-500" /> Message
                                        </label>
                                        <textarea 
                                            rows={5}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us more about your career goals or any issues you're facing..."
                                            className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                                        />
                                    </div>

                                    <div className="bg-blue-500/5 rounded-xl p-4 flex items-start gap-3 border border-blue-500/10">
                                        <ShieldCheck className="w-5 h-5 text-blue-500 mt-0.5" />
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            To protect our platform and users from spam, your IP address will be logged during submission. 
                                            We respect your privacy under Indian IT laws.
                                        </p>
                                    </div>

                                    <Button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-blue-500/20 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98] group"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                                                Sending secure message...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right side: Contact Info Cards */}
                    <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
                        {/* Founder Card */}
                        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden group">
                            <CardContent className="p-8">
                                <h3 className="font-bold text-lg mb-6 border-b border-border/50 pb-3">Founder Direct</h3>
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="relative">
                                        <div className="h-20 w-20 rounded-full overflow-hidden ring-4 ring-background ring-offset-2 ring-offset-blue-500/20">
                                            <img 
                                                src="/founder.png" 
                                                alt="Sameer Ali" 
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-blue-600 p-1.5 rounded-full text-white shadow-lg ring-2 ring-background">
                                            <Linkedin className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl">Sameer Ali</h4>
                                        <p className="text-blue-500 font-medium">Founder & CEO</p>
                                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                                            <MapPin className="w-3 h-3" /> India
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Link 
                                        href="https://www.linkedin.com/in/sameer0288" 
                                        target="_blank"
                                        className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 hover:bg-blue-600 hover:text-white transition-all group/link"
                                    >
                                        <Linkedin className="w-5 h-5 text-blue-600 group-hover/link:text-white" />
                                        <span className="text-sm font-medium">Professional Profile</span>
                                    </Link>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <Globe className="w-5 h-5 text-emerald-500" />
                                        <span className="text-xs text-muted-foreground">Always looking for partnerships & feedback</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Startup Hub Card */}
                        <Card className="border-border/50 bg-blue-600 text-white shadow-xl overflow-hidden relative">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            <CardContent className="p-8 relative z-10">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Rocket className="w-6 h-6" /> Our Startup Hub
                                </h3>
                                <p className="text-blue-50 leading-relaxed mb-6">
                                    JourneyWise AI is an Indian tech startup revolutionizing how students prepare for MNC and Product careers.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-blue-200" /> AI-First Career Guidance
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-blue-200" /> Personalized Roadmaps
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-blue-200" /> Success-Fact Based
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Toaster position="top-right" richColors />
        </div>
    );
}
