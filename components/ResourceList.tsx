"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BookOpen, ExternalLink, Clock, TrendingUp, DollarSign, Star, Zap, Award
} from 'lucide-react';

interface Resource {
    name: string;
    url: string;
    type: string;
    category?: string;
    description?: string;
    estimatedTime?: string;
    difficulty?: string;
    cost?: string;
    quality?: string;
    why?: string;
    priority?: string;
    timeRequired?: string;
    strategy?: string;
}

interface ResourceListProps {
    resources: Resource[];
    title?: string;
    description?: string;
    showOnlyBest?: boolean;
}

export function ResourceList({
    resources,
    title = "📚 Recommended Resources",
    description = "Hand-picked resources for your learning journey",
    showOnlyBest = false
}: ResourceListProps) {
    if (!resources || resources.length === 0) {
        return (
            <Card className="glass-panel border-white/10 dark:border-white/5 neo-glow overflow-hidden">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-12 text-center">
                    <div className="p-4 bg-muted/20 rounded-2xl w-fit mx-auto mb-4">
                        <BookOpen className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
                        No resources available for this section yet. Our AI is curating the best content for you!
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Group resources by cost
    const freeResources = resources.filter(r => r.cost?.toLowerCase().includes('free'));
    const paidResources = resources.filter(r => !r.cost?.toLowerCase().includes('free'));

    // Sort by priority if available
    const priorityOrder = ['CRITICAL', 'URGENT', 'HIGH', 'MEDIUM'];
    const sortedFree = [...freeResources].sort((a, b) => {
        const aPriority = priorityOrder.indexOf(a.priority?.toUpperCase() || 'MEDIUM');
        const bPriority = priorityOrder.indexOf(b.priority?.toUpperCase() || 'MEDIUM');
        return aPriority - bPriority;
    });

    const sortedPaid = [...paidResources].sort((a, b) => {
        const aPriority = priorityOrder.indexOf(a.priority?.toUpperCase() || 'MEDIUM');
        const bPriority = priorityOrder.indexOf(b.priority?.toUpperCase() || 'MEDIUM');
        return aPriority - bPriority;
    });

    const displayFree = showOnlyBest ? sortedFree.slice(0, 5) : sortedFree;
    const displayPaid = showOnlyBest ? sortedPaid.slice(0, 3) : sortedPaid;

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-foreground mb-1">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
            </div>

            {/* Free Resources Section */}
            {displayFree.length > 0 && (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel border-emerald-500/20 dark:border-emerald-500/10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl opacity-50" />
                        <div className="space-y-1 relative z-10">
                            <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent flex items-center gap-3">
                                <DollarSign className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                                Master These (Free)
                            </h3>
                            <p className="text-sm font-medium text-muted-foreground">High-quality, zero-cost resources curated for Indian students</p>
                        </div>
                        <Badge className="w-fit bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold uppercase tracking-widest px-4 py-1.5 h-fit relative z-10">
                            Highly Recommended
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {displayFree.map((resource: Resource, idx: number) => (
                            <ResourceCard key={idx} resource={resource} index={idx} />
                        ))}
                    </div>
                </div>
            )}

            {/* Paid Resources Section */}
            {displayPaid.length > 0 && (
                <div className="space-y-6 mt-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel border-indigo-500/20 dark:border-indigo-500/10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl opacity-50" />
                        <div className="space-y-1 relative z-10">
                            <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                                <Star className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                                Premium Selection
                            </h3>
                            <p className="text-sm font-medium text-muted-foreground">Investment-worthy resources for fast-tracking your career</p>
                        </div>
                        <Badge className="w-fit bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-bold uppercase tracking-widest px-4 py-1.5 h-fit relative z-10">
                            Fast Track
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {displayPaid.map((resource: Resource, idx: number) => (
                            <ResourceCard key={idx + 100} resource={resource} index={idx} isPaid={true} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ResourceCard({ resource, index, isPaid = false }: { resource: Resource; index: number; isPaid?: boolean }) {
    const getTypeIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'video': return '🎥';
            case 'article': return '📄';
            case 'tutorial': return '📖';
            case 'interactive': return '⚡';
            case 'practice': return '💻';
            case 'interview-prep': return '🎯';
            case 'documentation': return '📚';
            case 'youtube': return '▶️';
            case 'github': return '🐙';
            case 'course': return '🎓';
            default: return '📌';
        }
    };

    const getPriorityColor = (priority?: string) => {
        if (!priority) return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
        const p = priority.toLowerCase();
        if (p === 'critical') return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700';
        if (p === 'urgent') return 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-700';
        if (p === 'high') return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700';
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300';
    };

    const getCategoryColor = (category?: string) => {
        if (!category) return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
        const c = category.toLowerCase();
        if (c.includes('dsa') || c.includes('algorithm')) return 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300';
        if (c.includes('interview')) return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300';
        if (c.includes('system')) return 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300';
        if (c.includes('foundation') || c.includes('core')) return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300';
        if (c.includes('reference')) return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300';
        return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300';
    };

    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
        >
            <Card className="glass-card border-white/10 dark:border-white/5 hover:border-cyan-500/40 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group/card shadow-sm hover:shadow-cyan-500/10">
                <div className={`h-1.5 w-full bg-gradient-to-r opacity-60 dark:opacity-40 transition-opacity group-hover/card:opacity-100 ${
                    isPaid ? 'from-indigo-600 to-purple-600' : 'from-emerald-500 to-teal-500'
                }`} />
                <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                                    {getTypeIcon(resource.type)}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-lg md:text-xl text-foreground group-hover/card:text-cyan-600 dark:group-hover/card:text-cyan-400 transition-colors line-clamp-2 tracking-tight">
                                        {resource.name}
                                    </h4>
                                    <p className="text-xs md:text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2 font-medium opacity-80">
                                        {resource.description || `Comprehensive guide and learning path for ${resource.type}`}
                                    </p>
                                </div>
                            </div>

                            {/* Badges & Info */}
                            <div className="flex flex-wrap items-center gap-2.5 mb-4">
                                {/* Priority Badge */}
                                {resource.priority && (
                                    <Badge className={`text-[10px] px-2.5 py-0.5 font-black uppercase tracking-widest ${getPriorityColor(resource.priority)}`}>
                                        {resource.priority}
                                    </Badge>
                                )}

                                {/* Category Badge */}
                                {resource.category && (
                                    <Badge className={`text-[10px] px-2.5 py-0.5 font-black uppercase tracking-widest ${getCategoryColor(resource.category)}`}>
                                        {resource.category}
                                    </Badge>
                                )}

                                {/* Cost Badge */}
                                {resource.cost && (
                                    <Badge
                                        className={`text-[10px] px-2.5 py-0.5 font-black uppercase tracking-widest border border-white/10 ${
                                            resource.cost.toLowerCase().includes('free')
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                        }`}
                                    >
                                        {resource.cost.toLowerCase().includes('free') ? 'FREE' : 'PREMIUM'}
                                    </Badge>
                                )}
                            </div>

                            {/* Meta Info */}
                            <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 text-xs font-bold text-muted-foreground/70 uppercase tracking-widest mb-4">
                                {(resource.estimatedTime || resource.timeRequired) && (
                                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full group-hover/card:bg-cyan-500/5 group-hover/card:text-cyan-600 transition-colors">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{resource.estimatedTime || resource.timeRequired}</span>
                                    </div>
                                )}

                                {resource.difficulty && (
                                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full group-hover/card:bg-cyan-500/5 group-hover/card:text-cyan-600 transition-colors">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        <span className="capitalize">{resource.difficulty}</span>
                                    </div>
                                )}
                            </div>

                            {/* Why This Resource */}
                            {resource.why && (
                                <div className="mt-4 p-4 bg-white/5 dark:bg-black/20 rounded-xl border border-white/5 backdrop-blur-sm group-hover/card:border-cyan-500/20 transition-colors">
                                    <p className="text-xs md:text-sm text-foreground/70 leading-relaxed italic">
                                        <span className="font-black text-cyan-600 dark:text-cyan-400 not-italic uppercase tracking-widest mr-2 text-[10px]">Curation Insight:</span> 
                                        {resource.why}
                                    </p>
                                </div>
                            )}

                            {/* Strategy */}
                            {resource.strategy && (
                                <div className="mt-2 p-4 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-xl border border-indigo-500/10">
                                    <p className="text-xs md:text-sm text-indigo-700 dark:text-indigo-400 font-medium">
                                        <Zap className="w-4 h-4 inline mr-2 text-indigo-600 animate-pulse" />
                                        {resource.strategy}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Section - External Link Button */}
                        <div className="flex-shrink-0 pt-1 self-center md:self-start">
                            <div className="p-3.5 rounded-2xl bg-muted/50 group-hover/card:bg-cyan-600 dark:group-hover/card:bg-cyan-600 transition-all duration-300 group-hover/card:shadow-[0_0_15px_rgba(8,145,178,0.4)] transform group-hover/card:rotate-12">
                                <ExternalLink className="w-6 h-6 text-foreground/40 group-hover/card:text-white transition-colors" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
}
