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
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-6">
                        No resources available. Check back soon!
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
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-6 w-1 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"></div>
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            Free Resources (Our Recommendation!)
                        </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Perfect for Indian audience - Zero cost, maximum learning</p>

                    <div className="grid grid-cols-1 gap-4">
                        {displayFree.map((resource: Resource, idx: number) => (
                            <ResourceCard key={idx} resource={resource} index={idx} />
                        ))}
                    </div>
                </div>
            )}

            {/* Paid Resources Section */}
            {displayPaid.length > 0 && (
                <div className="space-y-4 mt-8">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-6 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Premium Resources (Optional)
                        </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">When free resources aren't enough - Great value for serious learners</p>

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
            <Card className="bg-card border-border hover:border-cyan-500/50 dark:hover:border-cyan-500/30 shadow-sm hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
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
                                    <h4 className="font-semibold text-base md:text-lg text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                                        {resource.name}
                                    </h4>
                                    <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {resource.description || `Learn about ${resource.type}`}
                                    </p>
                                </div>
                            </div>

                            {/* Badges & Info */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {/* Priority Badge */}
                                {resource.priority && (
                                    <Badge className={`text-xs font-semibold ${getPriorityColor(resource.priority)}`}>
                                        {resource.priority.toUpperCase()}
                                    </Badge>
                                )}

                                {/* Category Badge */}
                                {resource.category && (
                                    <Badge className={`text-xs font-medium ${getCategoryColor(resource.category)}`}>
                                        {resource.category}
                                    </Badge>
                                )}

                                {/* Cost Badge */}
                                {resource.cost && (
                                    <Badge
                                        variant="outline"
                                        className={`text-xs font-semibold ${
                                            resource.cost.toLowerCase().includes('free')
                                                ? 'text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20'
                                                : 'text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20'
                                        }`}
                                    >
                                        {resource.cost.toLowerCase().includes('free') ? '✓ Free' : `₹${resource.cost.split('|')[0].trim()}`}
                                    </Badge>
                                )}

                                {/* Quality Badge */}
                                {resource.quality && (
                                    <Badge variant="secondary" className="text-xs font-medium">
                                        {resource.quality}
                                    </Badge>
                                )}
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground">
                                {(resource.estimatedTime || resource.timeRequired) && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{resource.estimatedTime || resource.timeRequired}</span>
                                    </div>
                                )}

                                {resource.difficulty && (
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        <span className="capitalize">{resource.difficulty}</span>
                                    </div>
                                )}
                            </div>

                            {/* Why This Resource */}
                            {resource.why && (
                                <p className="text-xs md:text-sm text-muted-foreground mt-3 p-2 bg-muted/30 rounded-md border border-border/50 italic">
                                    💡 {resource.why}
                                </p>
                            )}

                            {/* Strategy */}
                            {resource.strategy && (
                                <p className="text-xs md:text-sm text-blue-700 dark:text-blue-400 mt-2 p-2 bg-blue-50/50 dark:bg-blue-950/20 rounded-md border border-blue-200/50 dark:border-blue-800/50">
                                    <strong>Pro Tip:</strong> {resource.strategy}
                                </p>
                            )}
                        </div>

                        {/* Right Section - External Link Button */}
                        <div className="flex-shrink-0 pt-1">
                            <div className="p-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 group-hover:bg-cyan-600 dark:group-hover:bg-cyan-600 transition-colors">
                                <ExternalLink className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
}
