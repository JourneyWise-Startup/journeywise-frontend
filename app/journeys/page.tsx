"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Award, Briefcase, MapPin, Search } from 'lucide-react';

export default function JourneysPage() {
    const [journeys, setJourneys] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/journeys`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setJourneys(data);
                } else if (data && Array.isArray(data.data)) {
                    setJourneys(data.data);
                } else {
                    console.error('Unexpected API response format:', data);
                    setJourneys([]);
                }
            })
            .catch(err => {
                console.error(err);
                setJourneys([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = journeys.filter((j: any) =>
        j.domain.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground py-10 md:py-12 px-3 sm:px-4 md:px-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Effects - Matches Home Page */}
            <div className="absolute top-0 -right-40 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl md:blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-3xl md:blur-[100px] pointer-events-none" />

            <div className="container max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-10 md:mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 md:mb-3">
                                Success <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 dark:from-cyan-400 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent">Journeys</span>
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Discover how professionals like you made it. Get inspired and learn from their experiences.</p>
                        </div>
                    </div>

                    {/* Search Box */}
                    <div className="mt-6 md:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by domain, company, or name..."
                            className="w-full md:max-w-2xl h-10 md:h-12 pl-10 text-sm md:text-base bg-card border-border focus:border-cyan-500 focus:ring-cyan-500 text-foreground placeholder:text-muted-foreground rounded-lg transition-all shadow-sm"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground text-sm md:text-base">Loading success stories...</p>
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <Card className="border border-border bg-card animate-in fade-in duration-700 delay-200">
                        <CardContent className="text-center py-16 md:py-20">
                            <Award className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">No journeys found</h3>
                            <p className="text-muted-foreground">Try adjusting your search filters to find more stories</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((j: any, idx: number) => (
                            <Card key={j.id} className="h-full border border-border bg-card hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer group animate-in fade-in slide-in-from-bottom-4 shadow-sm hover:shadow-md" style={{ transitionDelay: `${(idx % 3) * 100 + 300}ms` }}>
                                <CardHeader className="pb-3 md:pb-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="line-clamp-2 text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-sm md:text-base">
                                                {j.name}
                                            </CardTitle>
                                            <CardDescription className="text-muted-foreground font-medium flex items-center gap-1 mt-1 text-xs md:text-sm">
                                                <Briefcase className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                                                <span className="truncate">{j.role} @ {j.company}</span>
                                            </CardDescription>
                                        </div>
                                        {j.cgpa && (
                                            <div className="text-xs font-bold text-center bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 px-2 md:px-3 py-1.5 rounded-lg flex-shrink-0">
                                                <div>CGPA</div>
                                                <div>{j.cgpa}</div>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 md:space-y-5">
                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-500/20 text-xs">
                                            {j.domain}
                                        </Badge>
                                        {j.city && (
                                            <Badge variant="outline" className="border-border text-muted-foreground flex items-center gap-1 text-xs">
                                                <MapPin className="h-3 w-3" />
                                                {j.city}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Story */}
                                    <p className="text-xs md:text-sm text-foreground/80 line-clamp-3 leading-relaxed">
                                        {j.story}
                                    </p>

                                    {/* Tips Section */}
                                    <div className="pt-4 border-t border-border">
                                        <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1">
                                            <Award className="h-3 w-3 text-cyan-600 dark:text-cyan-500" />
                                            Key Tips
                                        </p>
                                        <ul className="text-xs text-muted-foreground space-y-1">
                                            {j.tips?.slice(0, 2).map((t: string, i: number) => (
                                                <li key={i} className="flex gap-2">
                                                    <span className="text-cyan-600 dark:text-cyan-500 flex-shrink-0">✓</span>
                                                    <span>{t}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* View Full Button */}
                                    <div className="pt-2">
                                        <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                            Read Full Story
                                            <span>→</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Result Count */}
                {!loading && journeys.length > 0 && (
                    <div className="mt-8 text-center text-xs md:text-sm text-muted-foreground">
                        Showing {filtered.length} of {journeys.length} success {journeys.length === 1 ? 'story' : 'stories'}
                    </div>
                )}
            </div>
        </div>
    );
}
