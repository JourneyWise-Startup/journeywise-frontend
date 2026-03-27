"use client"
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
    CheckCircle2, XCircle, ArrowRight, BookOpen, Ban, Target, Zap,
    Lightbulb, LinkIcon, Calendar, Trophy, ChevronRight, Building2,
    Users, MessageSquare, Code2, Layers, BrainCircuit, Star, Search, Trash2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ReadinessScoreDisplay } from "@/components/ReadinessScoreDisplay";
import { ResourceList } from "@/components/ResourceList";
import { MilestoneDisplay } from "@/components/MilestoneDisplay";
import { SkillGapsDisplay } from "@/components/SkillGapsDisplay";
import { WeeklyRoadmapDisplay } from "@/components/WeeklyRoadmapDisplay";
import { ProjectsDisplay } from "@/components/ProjectsDisplay";
import { toast } from 'sonner';

export default function RoadmapDetail() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("weekly");
    const [deleting, setDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
    const [updatingProgress, setUpdatingProgress] = useState(false);

    // Company Insights State
    const [companyInput, setCompanyInput] = useState("");
    const [fetchingInsights, setFetchingInsights] = useState(false);
    const [dynamicInsights, setDynamicInsights] = useState<any>(null);

    const router = useRouter();

    // Scroll listener effect
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth scroll to top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmap/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setData(data);
                // Load completed weeks from data
                setCompletedWeeks(data.completedWeeks || []);
                // If initial data has company insights, set them
                if (data.companyInsights) {
                    setDynamicInsights(data.companyInsights);
                    setActiveTab("insider"); // Open insider tab by default if it exists
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    // Auto-fetch company insights if company was provided during upload
    useEffect(() => {
        if (data?.targetCompany && !dynamicInsights && !fetchingInsights) {
            // Auto-fetch insights for the provided company
            const token = localStorage.getItem('token');
            if (!token) return;

            setFetchingInsights(true);
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmap/company-insights`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    company: data.targetCompany,
                    role: data.careerGoal
                })
            })
                .then(res => res.json())
                .then(insights => {
                    setDynamicInsights(insights);
                    setCompanyInput(data.targetCompany);
                })
                .catch(err => {
                    console.error('Error fetching company insights:', err);
                })
                .finally(() => {
                    setFetchingInsights(false);
                });
        }
    }, [data?.targetCompany, data?.careerGoal, dynamicInsights, fetchingInsights]);

    const handleFetchInsights = async () => {
        if (!companyInput.trim()) return;
        setFetchingInsights(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmap/company-insights`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    company: companyInput,
                    role: data.careerGoal // Use the career goal from roadmap as role
                })
            });

            if (res.ok) {
                const insights = await res.json();
                setDynamicInsights(insights);
                toast.success(`Insights generated for ${companyInput}`);
            } else {
                toast.error("Failed to generate insights. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred.");
        } finally {
            setFetchingInsights(false);
        }
    };

    const handleDeleteRoadmap = async () => {
        if (!id) return;
        setDeleting(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmap/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                toast.success('Roadmap deleted successfully');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);
            } else {
                toast.error('Failed to delete roadmap');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while deleting');
        } finally {
            setDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const handleToggleWeekCompletion = async (weekIndex: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const isCompleted = completedWeeks.includes(weekIndex);
        const endpoint = isCompleted
            ? `${process.env.NEXT_PUBLIC_API_URL}/roadmap/${id}/week/${weekIndex}/incomplete`
            : `${process.env.NEXT_PUBLIC_API_URL}/roadmap/${id}/week/${weekIndex}/complete`;

        setUpdatingProgress(true);

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const updatedData = await res.json();
                const newCompletedWeeks = updatedData.data.completedWeeks || [];
                const newProgress = updatedData.data.progress || 0;

                // Update state with new values
                setCompletedWeeks(newCompletedWeeks);
                setData((prev: any) => ({
                    ...prev,
                    progress: newProgress,
                    completedWeeks: newCompletedWeeks
                }));

                // Toast notification
                if (newProgress === 100) {
                    toast.success('🎉 Congratulations! You completed the roadmap!');
                } else if (isCompleted) {
                    toast.success(`Week ${weekIndex + 1} marked as incomplete`);
                } else {
                    toast.success(`Week ${weekIndex + 1} completed! Progress: ${newProgress}%`);
                }

                // Trigger readiness score refresh after a short delay
                setTimeout(() => {
                    fetchReadinessData();
                }, 500);
            } else {
                toast.error('Failed to update week status');
            }
        } catch (error) {
            console.error('Error updating progress:', error);
            toast.error('An error occurred while updating progress');
        } finally {
            setUpdatingProgress(false);
        }
    };

    const fetchReadinessData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/readiness/report/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const readinessReport = await res.json();
                // This will trigger a re-render of ReadinessScoreDisplay
                // The component will fetch the updated data
            }
        } catch (error) {
            console.error('Error fetching readiness data:', error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
            <h1 className="text-2xl font-bold text-foreground">Roadmap not found</h1>
            <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
        </div>
    );

    const monthlyPlan = data.monthlyPlan || {};
    const weeklyPlan = monthlyPlan.weeklyPlan || data.weeklyPlan || [];
    const monthlyMilestones = monthlyPlan.monthlyMilestones || data.monthlyMilestones || [];
    const practiceProjects = monthlyPlan.practiceProjects || data.practiceProjects || [];
    const timelineToGoal = monthlyPlan.timelineToGoal || data.timelineToGoal || '3-6 months';
    const skillGapsDetails = monthlyPlan.skillGapsDetails || [];
    const skillGapStrings = data.skillGaps || [];

    // Merge skill gaps from both sources (detail from monthlyPlan + strings from data)
    // If we have detailed skill gaps from monthlyPlan, use those; otherwise parse from strings
    const enhancedSkillGaps = skillGapsDetails.length > 0
        ? skillGapsDetails
        : skillGapStrings.map((gapStr: string) => {
            // Parse string like "JavaScript (novice → intermediate)" into object
            const match = gapStr.match(/^(.+?)\s*\((\w+)\s*→\s*(\w+)\)$/);
            if (match) {
                return {
                    skill: match[1],
                    currentLevel: match[2],
                    requiredLevel: match[3],
                    difficulty: 'medium',
                    estimatedHoursToMastery: 50,
                    whyNeeded: `${match[1]} is required for your target role`,
                    learnThis: `Master ${match[1]} from ${match[2]} to ${match[3]} level`,
                    companyRequirement: data.targetCompany ? true : false,
                    beginnerFriendlyResource: `Official ${match[1]} Documentation`
                };
            }
            return {
                skill: gapStr,
                currentLevel: 'beginner',
                requiredLevel: 'intermediate',
                difficulty: 'medium',
                estimatedHoursToMastery: 40,
                whyNeeded: 'This skill is important for your target role',
                learnThis: `Learn ${gapStr}`,
                companyRequirement: false,
                beginnerFriendlyResource: 'Official Documentation'
            };
        });

    // Helper to get nice colors based on index or type
    const getWeekColor = (index: number) => {
        const colors = [
            'from-cyan-500/5 to-blue-500/5 border-cyan-500/10',
            'from-purple-500/5 to-pink-500/5 border-purple-500/10',
            'from-orange-500/5 to-red-500/5 border-orange-500/10',
            'from-emerald-500/5 to-green-500/5 border-emerald-500/10',
        ];
        return colors[index % colors.length];
    };

    // Context-aware resource mapping based on topic with specific, direct URLs
    const getContextAwareResources = (weekTitle: string, weekFocus?: string) => {
        const topicText = `${weekTitle} ${weekFocus || ''}`.toLowerCase();

        // Comprehensive topic-specific resource mappings with SPECIFIC, DIRECT URLs
        const resourceMap: { [key: string]: any[] } = {
            // ============ JAVASCRIPT & BASICS ============
            'javascript|js|basics|fundamentals|variable|function|scope|closure': [
                { name: 'JavaScript.info Complete Guide', url: 'https://javascript.info/', type: '📖 Documentation', estimatedTime: '30-40 hours' },
                { name: 'Kyle Simpson JavaScript Series', url: 'https://www.youtube.com/playlist?list=PLIylHD_VX69tW6W-wFTJoHw1qczfroQNk', type: '🎥 YouTube', estimatedTime: '12-15 hours' },
                { name: 'GeeksforGeeks JavaScript Tutorial', url: 'https://www.geeksforgeeks.org/javascript-tutorial/', type: '📄 Article Series', estimatedTime: 'Self-paced' },
                { name: 'Traversy Media JS Crash Course', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', type: '🎥 YouTube Video', estimatedTime: '1 hour' },
            ],
            // ============ HTML & CSS ============
            'html|html5|markup': [
                { name: 'MDN HTML Complete Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', type: '📖 MDN Docs', estimatedTime: 'Reference' },
                { name: 'GeeksforGeeks HTML Tutorial', url: 'https://www.geeksforgeeks.org/html-tutorial/', type: '📄 Article Series', estimatedTime: '15-20 hours' },
                { name: 'Traversy Media HTML Basics', url: 'https://www.youtube.com/watch?v=UB3IzDdx7mc', type: '🎥 YouTube Video', estimatedTime: '1.5 hours' },
            ],
            'css|styling|flexbox|grid|responsive|design': [
                { name: 'Kevin Powell CSS Masterclass', url: 'https://www.youtube.com/watch?v=OfoKwIsp_-c', type: '🎥 YouTube Video', estimatedTime: '8 hours' },
                { name: 'MDN CSS Complete Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', type: '📖 MDN Docs', estimatedTime: 'Reference' },
                { name: 'GeeksforGeeks CSS Tutorial', url: 'https://www.geeksforgeeks.org/css-tutorial/', type: '📄 Article Series', estimatedTime: '20-25 hours' },
                { name: 'CSS Tricks - Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: '📄 Detailed Guide', estimatedTime: '5 hours' },
            ],
            // ============ REACT & FRONTEND FRAMEWORKS ============
            'react|reactjs|jsx|component|state|hook': [
                { name: 'Official React Documentation', url: 'https://react.dev/', type: '📖 Official Docs', estimatedTime: 'Self-paced' },
                { name: 'Scrimba React Course (Free)', url: 'https://scrimba.com/learn/learnreact', type: '🎥 Interactive Course', estimatedTime: '10-12 hours' },
                { name: 'Traversy Media React Course', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', type: '🎥 YouTube', estimatedTime: '2 hours' },
                { name: 'GeeksforGeeks React Tutorial', url: 'https://www.geeksforgeeks.org/reactjs-tutorial/', type: '📄 Article Series', estimatedTime: '25-30 hours' },
            ],
            'typescript|types|interface': [
                { name: 'Official TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', type: '📖 Official Docs', estimatedTime: '15-20 hours' },
                { name: 'TypeScript Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=d56mHqF0rP4', type: '🎥 YouTube Video', estimatedTime: '35 minutes' },
                { name: 'GeeksforGeeks TypeScript Guide', url: 'https://www.geeksforgeeks.org/typescript/', type: '📄 Article Series', estimatedTime: '10-15 hours' },
            ],
            'nextjs|next.js|ssr|server component': [
                { name: 'Official Next.js Documentation', url: 'https://nextjs.org/docs', type: '📖 Official Docs', estimatedTime: 'Self-paced' },
                { name: 'Traversy Media Next.js Crash Course', url: 'https://www.youtube.com/watch?v=842nZ9FKL0w', type: '🎥 YouTube Video', estimatedTime: '1.5 hours' },
                { name: 'Next.js Full Course', url: 'https://www.youtube.com/watch?v=ZjAqacIm9iI', type: '🎥 YouTube', estimatedTime: '2.5 hours' },
            ],
            // ============ DOM & MANIPULATION ============
            'dom|manipulation|events|selector': [
                { name: 'MDN DOM Introduction', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model', type: '📖 MDN Docs', estimatedTime: '10-15 hours' },
                { name: 'GeeksforGeeks DOM Tutorial', url: 'https://www.geeksforgeeks.org/dom-document-object-model/', type: '📄 Article Series', estimatedTime: '12-18 hours' },
                { name: 'Traversy Media DOM Crash Course', url: 'https://www.youtube.com/watch?v=0ik6X7EV5KU', type: '🎥 YouTube Video', estimatedTime: '1 hour' },
            ],
            // ============ BACKEND & NODE.JS ============
            'nodejs|node.js|express|backend': [
                { name: 'Official Node.js Documentation', url: 'https://nodejs.org/en/docs/', type: '📖 Official Docs', estimatedTime: 'Reference' },
                { name: 'Traversy Media Node.js Playlist', url: 'https://www.youtube.com/playlist?list=PLillGF-RfqbZ2ybcoK2SFlgzLcWGVeIub', type: '🎥 YouTube Playlist', estimatedTime: '15-20 hours' },
                { name: 'Express.js Official Guide', url: 'https://expressjs.com/en/starter/basic-routing.html', type: '📖 Official Docs', estimatedTime: '10-15 hours' },
                { name: 'GeeksforGeeks Node.js Tutorial', url: 'https://www.geeksforgeeks.org/nodejs/', type: '📄 Article Series', estimatedTime: '20-25 hours' },
            ],
            'api|rest|restful|http|endpoint|routing': [
                { name: 'RESTful API Design Best Practices', url: 'https://www.geeksforgeeks.org/rest-api-introduction/', type: '📄 Article', estimatedTime: '6-8 hours' },
                { name: 'Traversy Media REST API Video', url: 'https://www.youtube.com/watch?v=SLwpqD8n3d0', type: '🎥 YouTube Video', estimatedTime: '2 hours' },
                { name: 'MDN HTTP Basics', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP', type: '📖 MDN Docs', estimatedTime: '8-10 hours' },
            ],
            // ============ DATABASES ============
            'database|sql|mysql|postgresql': [
                { name: 'SQL Tutorial - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/sql-tutorial/', type: '📄 Article Series', estimatedTime: '25-30 hours' },
                { name: 'MySQL Official Documentation', url: 'https://dev.mysql.com/doc/', type: '📖 Official Docs', estimatedTime: 'Reference' },
                { name: 'Traversy Media SQL Crash Course', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', type: '🎥 YouTube Video', estimatedTime: '1 hour' },
                { name: 'PostgreSQL Tutorial', url: 'https://www.postgresql.org/docs/', type: '📖 Official Docs', estimatedTime: 'Reference' },
            ],
            'mongodb|nosql|firebase|database design': [
                { name: 'MongoDB Official Documentation', url: 'https://docs.mongodb.com/', type: '📖 Official Docs', estimatedTime: 'Reference' },
                { name: 'Traversy Media MongoDB Playlist', url: 'https://www.youtube.com/watch?v=4yqu8YF29D0', type: '🎥 YouTube Video', estimatedTime: '2.5 hours' },
                { name: 'GeeksforGeeks MongoDB Tutorial', url: 'https://www.geeksforgeeks.org/mongodb-tutorial/', type: '📄 Article Series', estimatedTime: '15-20 hours' },
            ],
            // ============ SYSTEM DESIGN ============
            'system design|scalability|architecture|database design|microservice|distributed': [
                { name: 'Gaurav Sen System Design Channel', url: 'https://www.youtube.com/channel/UCRPMAqdtSgd0Ipeef7hy-UQ', type: '🎥 YouTube Channel', estimatedTime: '20-30 hours' },
                { name: 'ByteByteGo System Design', url: 'https://www.youtube.com/@ByteByteGo', type: '🎥 YouTube Channel', estimatedTime: '15-25 hours' },
                { name: 'System Design Primer GitHub', url: 'https://github.com/donnemartin/system-design-primer', type: '📖 GitHub', estimatedTime: '30-40 hours' },
                { name: 'GeeksforGeeks System Design', url: 'https://www.geeksforgeeks.org/system-design-tutorial/', type: '📄 Article Series', estimatedTime: '20-25 hours' },
            ],
            // ============ DSA & ALGORITHMS ============
            'dsa|data structure|algorithm|sorting|searching|graph|tree|linked list|array|hash': [
                { name: 'GeeksforGeeks DSA Complete Course', url: 'https://www.geeksforgeeks.org/data-structures/', type: '📄 Article Series', estimatedTime: '40-50 hours' },
                { name: 'Abdul Bari DSA Complete Series', url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkP2qBRE7tvQcS_0-jEqv', type: '🎥 YouTube Playlist', estimatedTime: '35-45 hours' },
                { name: 'Striver DSA Sheet with Code', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2', type: '📖 Complete Guide', estimatedTime: '50-60 hours' },
                { name: 'CodeHelp DSA Complete', url: 'https://www.youtube.com/playlist?list=PLDzeHZWIZsQoM6STlVPP--IlD_8eMhAde', type: '🎥 YouTube Playlist', estimatedTime: '30-40 hours' },
            ],
            // ============ PYTHON ============
            'python|django|flask|fastapi': [
                { name: 'Official Python Documentation', url: 'https://docs.python.org/3/', type: '📖 Official Docs', estimatedTime: 'Reference' },
                { name: 'Real Python - Full Tutorials', url: 'https://realpython.com/', type: '📄 Detailed Guides', estimatedTime: 'Self-paced' },
                { name: 'Corey Schafer Python Complete', url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU', type: '🎥 YouTube Playlist', estimatedTime: '12-15 hours' },
                { name: 'GeeksforGeeks Python Tutorial', url: 'https://www.geeksforgeeks.org/python-tutorial/', type: '📄 Article Series', estimatedTime: '30-40 hours' },
            ],
            // ============ Machine Learning & AI ============
            'machine learning|deep learning|neural network|tensorflow|pytorch|ai|nlp|cv|computer vision': [
                { name: 'Andrew Ng Machine Learning Specialization', url: 'https://www.coursera.org/specializations/machine-learning-introduction', type: '📚 Coursera Course', estimatedTime: '60-70 hours' },
                { name: 'TensorFlow Official Tutorials', url: 'https://www.tensorflow.org/tutorials', type: '📖 Official Docs', estimatedTime: '25-35 hours' },
                { name: '3Blue1Brown Neural Networks Playlist', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_LFDT5_B-', type: '🎥 YouTube Playlist', estimatedTime: '5-6 hours' },
                { name: 'Jeremy Howard Fast.AI', url: 'https://fast.ai/', type: '📚 Full Course', estimatedTime: '30-40 hours' },
            ],
            // ============ DevOps & Cloud ============
            'devops|docker|kubernetes|aws|gcp|azure|ci/cd|jenkins|gitlab|cloud|deployment': [
                { name: 'Docker Official Documentation', url: 'https://docs.docker.com/', type: '📖 Official Docs', estimatedTime: 'Reference' },
                { name: 'freeCodeCamp Docker Full Course', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', type: '🎥 YouTube Video', estimatedTime: '4 hours' },
                { name: 'Kubernetes Official Tutorial', url: 'https://kubernetes.io/docs/tutorials/', type: '📖 Official Docs', estimatedTime: 'Self-paced' },
                { name: 'AWS Certified Developer', url: 'https://www.youtube.com/c/KevinBromonisBreakthrough', type: '🎥 YouTube', estimatedTime: '40-50 hours' },
                { name: 'GeeksforGeeks DevOps Tutorial', url: 'https://www.geeksforgeeks.org/devops/', type: '📄 Article Series', estimatedTime: '20-25 hours' },
            ],
        };

        // Find matching resources based on keywords
        for (const [keywords, resources] of Object.entries(resourceMap)) {
            const keywordsList = keywords.split('|');
            if (keywordsList.some(keyword => topicText.includes(keyword))) {
                return resources;
            }
        }

        // Fallback: Return diverse learning resources if no specific topic match
        return [
            { name: 'GeeksforGeeks - Comprehensive Tutorials', url: 'https://www.geeksforgeeks.org/', type: '📄 Article Series', estimatedTime: 'Self-paced' },
            { name: 'YouTube - Official Documentation Channels', url: 'https://www.youtube.com/results?search_query=official+documentation+tutorial', type: '🎥 YouTube Search', estimatedTime: 'Self-paced' },
            { name: 'Coursera - Guided Learning Paths', url: 'https://www.coursera.org/', type: '📚 Courses', estimatedTime: 'Self-paced' },
            { name: 'MDN Web Docs - Developer Resources', url: 'https://developer.mozilla.org/', type: '📖 Documentation', estimatedTime: 'Self-paced' },
        ];
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* Navigation */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border transition-all">
                <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" /> Back
                    </button>
                    <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-foreground/80">
                        {data.targetCompany && <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800">{data.targetCompany}</Badge>}
                        <span>{data.careerGoal}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-xs md:text-sm">Delete</span>
                    </Button>
                </div>
            </div>

            <div className="container py-8 md:py-12 max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Header Section */}
                <div className="mb-10 md:mb-14 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5 px-3 py-1">
                                {data.isResumeBased ? '📄 Resume-Based' : '🎯 Industry Standard'}
                            </Badge>
                            {!data.isResumeBased && (
                                <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 px-3 py-1">
                                    General Roadmap
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{data.careerGoal}</span>
                            {data.targetCompany && <span className="block text-2xl md:text-3xl mt-2 font-medium text-muted-foreground">at <span className="text-cyan-600 dark:text-cyan-400">{data.targetCompany}</span></span>}
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                            {data.isResumeBased
                                ? 'A tailored path designed to take you from your current skills to your dream career.'
                                : 'A general industry-standard roadmap based on market research. ' + (data.targetCompany ? `Customized for ${data.targetCompany}.` : '')
                            }
                        </p>

                        {!data.isResumeBased && (
                            <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50 rounded-lg">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    <span className="font-semibold">💡 Tip:</span> Upload your resume to get personalized skill gap analysis and readiness scoring.
                                </p>
                            </div>
                        )}

                        {/* Progress Bar */}
                        <div className="mt-6 max-w-2xl">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-muted-foreground">Your Progress</p>
                                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">{data.progress || 0}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/40"
                                    style={{ width: `${data.progress || 0}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
                                <span>{completedWeeks.length} weeks completed</span>
                                <span>{weeklyPlan.length} weeks total</span>
                            </div>
                            {data.progress === 100 && (
                                <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-400/30 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Roadmap Completed! Great job! 🎉</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Coaching Message & Resume Analysis */}
                        {data.resumeAnalysis && (
                            <Card className="md:col-span-2 glass-panel border-[#0D5CDF]/20 dark:border-[#0D5CDF]/10 neo-glow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D5CDF]/5 rounded-full blur-3xl group-hover:bg-[#0D5CDF]/10 transition-colors duration-500" />
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl text-[#0D5CDF] dark:text-[#4A90E2]">
                                        <div className="p-2 bg-[#0D5CDF]/10 rounded-lg">
                                            <Lightbulb className="w-5 h-5" />
                                        </div>
                                        Your AI Coaching Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Resume Analysis */}
                                    <div>
                                        <div className="inline-block mb-3">
                                            <Badge className="bg-[#0D5CDF] hover:bg-[#0D5CDF]/90 text-white border-none shadow-lg shadow-blue-500/20 px-3 py-1">
                                                {data.resumeAnalysis.detectedType?.replace(/-/g, ' ').toUpperCase() || 'ANALYZED'} PROFILE
                                            </Badge>
                                        </div>
                                        <p className="text-base text-foreground/90 font-medium leading-relaxed">
                                            {data.resumeAnalysis.currentBackground}
                                        </p>
                                    </div>

                                    {/* Coaching Message */}
                                    {data.coachingMessage && (
                                        <div className="space-y-4 pt-4 border-t border-white/10 dark:border-white/5">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/20 dark:border-emerald-500/10 hover:border-emerald-500/40 transition-colors group/item">
                                                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Competitive Edge
                                                    </p>
                                                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">{data.coachingMessage.goodNews}</p>
                                                </div>
                                                <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl border border-amber-500/20 dark:border-amber-500/10 hover:border-amber-500/40 transition-colors group/item">
                                                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                        <Zap className="w-3.5 h-3.5" />
                                                        Primary Focus
                                                    </p>
                                                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">{data.coachingMessage.challenge}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-[#0D5CDF]/5 dark:bg-[#0D5CDF]/10 rounded-xl border border-[#0D5CDF]/20 dark:border-[#0D5CDF]/10">
                                                <p className="text-xs font-bold text-[#0D5CDF] dark:text-[#4A90E2] uppercase tracking-widest mb-1">Expected Timeline</p>
                                                <p className="text-lg font-bold bg-gradient-to-r from-[#0D5CDF] to-[#00D2FF] bg-clip-text text-transparent">
                                                    {data.coachingMessage.timelineReality}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Readiness Score Display */}
                        {data.isResumeBased && (
                            <div className={data.resumeAnalysis ? 'lg:col-span-1' : 'md:col-span-2 lg:col-span-3'}>
                                <ReadinessScoreDisplay
                                    roadmapId={id as string}
                                    token={typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}
                                    initialScore={data.readinessScore || 0}
                                />
                            </div>
                        )}

                        {/* Right Side Stats Cards (Mobile/Tablet stacking) */}
                        <div className={`grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 ${data.isResumeBased ? 'lg:col-span-1' : 'md:col-span-2 lg:col-span-3'}`}>
                            <Card className="glass-card border-blue-500/20 dark:border-blue-500/10 hover:border-blue-500/40 transition-all duration-300 group">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Duration</p>
                                        <p className="text-xl font-bold text-foreground">{timelineToGoal}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-emerald-500/20 dark:border-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 group">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Lessons</p>
                                        <p className="text-xl font-bold text-foreground">{weeklyPlan.length} Weeks</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-purple-500/20 dark:border-purple-500/10 hover:border-purple-500/40 transition-all duration-300 group">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                        <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Projects</p>
                                        <p className="text-xl font-bold text-foreground">{practiceProjects.length} Builds</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Main Content - Tabs */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                                <div className="h-8 w-1.5 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                                Your Learning Path
                            </h2>
                        </div>

                        {/* Enhanced Tab List */}
                        <div className="overflow-x-auto pb-4 md:pb-0">
                            <TabsList className="bg-muted/50 p-1 flex w-max md:w-full rounded-xl gap-2 h-auto">
                                <TabsTrigger value="weekly" className="rounded-lg py-2.5 px-4 md:flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 transition-all">
                                    📅 Weekly Plan
                                </TabsTrigger>
                                <TabsTrigger value="gaps" className="rounded-lg py-2.5 px-4 md:flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400 transition-all">
                                    🎯 Skill Gaps
                                </TabsTrigger>
                                <TabsTrigger value="monthly" className="rounded-lg py-2.5 px-4 md:flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 transition-all">
                                    📊 Milestones
                                </TabsTrigger>
                                <TabsTrigger value="projects" className="rounded-lg py-2.5 px-4 md:flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 transition-all">
                                    🛠️ Projects
                                </TabsTrigger>
                                <TabsTrigger value="resources" className="rounded-lg py-2.5 px-4 md:flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-yellow-600 dark:data-[state=active]:text-yellow-400 transition-all">
                                    📚 Resources
                                </TabsTrigger>
                                <TabsTrigger value="insider" className="rounded-lg py-2.5 px-4 md:flex-1 data-[state=active]:bg-gradient-to-r from-cyan-600 to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                    <Building2 className="w-4 h-4 mr-2" /> Company Insider
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Company Insider Tab - DYNAMIC & ENHANCED */}
                        <TabsContent value="insider" className="space-y-6 mt-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Show loading/search ONLY if NO company insights exist yet */}
                            {!dynamicInsights && (
                                <div className="mb-8">
                                    <div className="max-w-xl mx-auto">
                                        {data?.targetCompany ? (
                                            // If company was provided during upload - AUTO LOADING
                                            <div className="text-center space-y-4 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                                                {fetchingInsights ? (
                                                    <>
                                                        <div className="flex justify-center">
                                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-bold text-foreground mb-2">
                                                                Getting {data.targetCompany} Insights...
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Analyzing company culture, hiring process, and insider tips
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Building2 className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400" />
                                                        <div>
                                                            <p className="text-lg font-bold text-foreground mb-2">
                                                                {data.targetCompany} Insights
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mb-4">
                                                                Get AI-powered company insights including interview patterns, culture, and insider tips tailored to this company.
                                                            </p>
                                                            <Button
                                                                onClick={() => {
                                                                    setCompanyInput(data.targetCompany);
                                                                    handleFetchInsights();
                                                                }}
                                                                disabled={fetchingInsights}
                                                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                                                            >
                                                                {fetchingInsights ? (
                                                                    <>
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                        Loading...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Zap className="w-4 h-4 mr-2" />
                                                                        Generate Insights
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            // If NO company was provided, show search option
                                            <div className="space-y-4">
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Enter target company name (e.g. Google, Swiggy)..."
                                                            value={companyInput}
                                                            onChange={(e) => setCompanyInput(e.target.value)}
                                                            className="pl-9 h-11 bg-background border-border text-base"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleFetchInsights()}
                                                            autoFocus
                                                        />
                                                    </div>
                                                    <Button onClick={handleFetchInsights} disabled={fetchingInsights || !companyInput.trim()} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white h-11 px-6">
                                                        {fetchingInsights ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        ) : (
                                                            <>
                                                                <Zap className="w-4 h-4 mr-2" />
                                                                Get Insights
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                                <p className="text-center text-sm text-muted-foreground">
                                                    ✨ Enter any company to get AI-powered interview insights, culture analysis, and insider tips.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {dynamicInsights && (
                                <div className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Culture Card */}
                                        <Card className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20 shadow-sm h-full overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Building2 className="w-24 h-24 text-cyan-600" />
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-xl text-cyan-700 dark:text-cyan-400">
                                                    <Building2 className="w-5 h-5" /> Company Culture
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-foreground/80 leading-relaxed text-sm md:text-base">{dynamicInsights.culture || "Details about company culture..."}</p>
                                            </CardContent>
                                        </Card>

                                        {/* Hiring Process - NEW */}
                                        <Card className="bg-card border-border shadow-sm h-full">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                                                    <Layers className="w-5 h-5 text-purple-600" /> Hiring Rounds & Process
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {dynamicInsights.hiringProcess ? (
                                                        dynamicInsights.hiringProcess.map((round: any, i: number) => (
                                                            <div key={i} className="flex gap-3">
                                                                <div className="flex flex-col items-center">
                                                                    <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-200 dark:border-purple-800">
                                                                        {i + 1}
                                                                    </div>
                                                                    {i < dynamicInsights.hiringProcess.length - 1 && <div className="w-0.5 flex-grow bg-purple-100 dark:bg-purple-900/30 my-1"></div>}
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-semibold text-foreground">{round.stage}</h4>
                                                                    <p className="text-sm text-muted-foreground">{round.description}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-muted-foreground">Standard 3-4 round process (Coding, System Design, HR)</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Key Tech */}
                                        <Card className="bg-card border-border shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                                                    <Code2 className="w-5 h-5 text-blue-600" /> Key Technologies & Skills
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap gap-2">
                                                    {dynamicInsights.keyTechnologies?.map((tech: string, i: number) => (
                                                        <Badge key={i} variant="outline" className="py-1.5 px-3 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300">{tech}</Badge>
                                                    )) || <p className="text-muted-foreground">General tech stack</p>}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Insider Tips */}
                                        <Card className="bg-card border-border shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                                                    <BrainCircuit className="w-5 h-5 text-yellow-500" /> Insider Strategy
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-3">
                                                    {dynamicInsights.insiderTips?.map((tip: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 md:text-base p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                                                            <span className="text-yellow-500 shrink-0 mt-0.5">★</span> {tip}
                                                        </li>
                                                    )) || <p className="text-muted-foreground">No specific tips available.</p>}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        {/* Skill Gaps Tab - IMPROVED */}
                        <TabsContent value="gaps" className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <SkillGapsDisplay
                                skillGaps={enhancedSkillGaps}
                                careerGoal={data.careerGoal}
                                targetCompany={data.targetCompany}
                            />
                        </TabsContent>

                        {/* Weekly Plan Tab - IMPROVED */}
                        <TabsContent value="weekly" className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <WeeklyRoadmapDisplay
                                weeklyPlan={weeklyPlan}
                                careerGoal={data.careerGoal}
                                targetCompany={data.targetCompany}
                                completedWeeks={completedWeeks}
                                onWeekComplete={handleToggleWeekCompletion}
                            />
                        </TabsContent>

                        {/* Monthly Milestones Tab */}
                        <TabsContent value="monthly" className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <MilestoneDisplay
                                milestones={monthlyMilestones}
                                currentMonth={1}
                                completedMonths={[]}
                            />
                        </TabsContent>

                        {/* Practice Projects Tab - IMPROVED */}
                        <TabsContent value="projects" className="space-y-6 mt-6">
                            <ProjectsDisplay
                                projects={practiceProjects}
                                careerGoal={data.careerGoal}
                                targetCompany={data.targetCompany}
                            />
                        </TabsContent>

                        {/* Resources Tab */}
                        <TabsContent value="resources" className="space-y-6 mt-6 animate-in fade-in slide-in-from-left-4 duration-500">
                            <ResourceList
                                resources={data.resources || []}
                                title="📚 All Recommended Learning Resources"
                                description="Free resources preferred for Indian audience, with premium options when needed"
                                showOnlyBest={false}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <Card className="max-w-md w-full border-red-200 dark:border-red-900 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <Trash2 className="w-5 h-5" />
                                    Delete Roadmap?
                                </CardTitle>
                                <CardDescription>
                                    This action cannot be undone. Your roadmap and all its data will be permanently deleted.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground/80 mb-4">
                                    Are you sure you want to delete "<strong>{data.careerGoal}</strong>"?
                                </p>
                            </CardContent>
                            <CardFooter className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteDialog(false)}
                                    disabled={deleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteRoadmap}
                                    disabled={deleting}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {deleting ? 'Deleting...' : 'Delete Roadmap'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}

                {/* Scroll to Top Button - Fixed Position */}
                {showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 p-3 sm:p-4 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:scale-110 active:scale-95 border-2 border-violet-500/60 group"
                        aria-label="Scroll to top"
                    >
                        <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
