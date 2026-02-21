"use client"
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Sparkles, Zap, BookOpen, Target, MessageSquare, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Message {
    role: 'user' | 'model';
    content: string;
    timestamp?: Date;
    id?: string;
}

const SUGGESTED_PROMPTS = [
    { text: "How can I improve my coding skills?", icon: Zap },
    { text: "Best way to prepare for interviews?", icon: Target },
    { text: "How to build a strong GitHub portfolio?", icon: BookOpen },
    { text: "What should I focus on next?", icon: MessageSquare },
    { text: "Learning resources for React?", icon: Sparkles }
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
            id: Date.now().toString()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            const aiMessage: Message = {
                role: 'model',
                content: data.response,
                timestamp: new Date(),
                id: (Date.now() + 1).toString()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                role: 'model',
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
                id: (Date.now() + 2).toString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestedPrompt = (prompt: string) => {
        setInput(prompt);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatTime = (date?: Date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4.1rem)] bg-background text-foreground relative overflow-hidden transition-colors duration-300">
            {/* Background Gradients - Matches Home UI */}
            <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="flex-1 container max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-2 md:py-4 flex flex-col h-full overflow-hidden">
                <Card className="flex-1 flex flex-col shadow-2xl bg-card/80 backdrop-blur border-border overflow-hidden h-full rounded-xl md:rounded-2xl">
                    <CardHeader className="border-b border-border bg-muted/30 pb-3 md:pb-4 shrink-0">
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="h-9 md:h-10 w-9 md:w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 flex-shrink-0">
                                <Bot className="w-5 md:w-6 h-5 md:h-6 text-white" />
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="flex items-center gap-2 text-base md:text-lg text-foreground">
                                    <span className="truncate">JourneyWise AI</span>
                                    <Sparkles className="w-3 md:w-4 h-3 md:h-4 text-cyan-600 dark:text-cyan-500 flex-shrink-0" />
                                </CardTitle>
                                <CardDescription className="text-xs md:text-sm text-muted-foreground">Your personal career mentor, 24/7</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 relative flex flex-col overflow-hidden min-h-0">
                        <ScrollArea className="flex-1 p-3 sm:p-4 md:p-6">
                            <div className="space-y-4 md:space-y-6 pb-4">
                                {messages.length === 0 && (
                                    <div className="py-6 md:py-10 text-center space-y-6 md:space-y-8 animate-in fade-in zoom-in duration-500 delay-100">
                                        <div className="space-y-3 md:space-y-4">
                                            <div className="mx-auto w-20 md:w-24 h-20 md:h-24 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center mb-4 md:mb-6 ring-1 ring-border">
                                                <Bot className="w-10 md:w-12 h-10 md:h-12 text-cyan-600 dark:text-cyan-500" />
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                                                How can I help you <span className="text-cyan-600 dark:text-cyan-500">succeed</span> today?
                                            </h3>
                                            <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
                                                Ask me about career paths, resume tips, coding doubts, or interview preparation.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 max-w-3xl mx-auto text-left">
                                            {SUGGESTED_PROMPTS.map((item, idx) => {
                                                const Icon = item.icon;
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSuggestedPrompt(item.text)}
                                                        className="group p-3 md:p-4 rounded-lg md:rounded-xl border border-border bg-card/50 hover:bg-muted transition-all duration-300 ease-out hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/50 flex flex-col gap-2 active:scale-95 md:active:scale-100"
                                                    >
                                                        <div className="p-2 w-fit rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300">
                                                            <Icon className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
                                                        </div>
                                                        <span className="font-medium text-xs md:text-sm text-muted-foreground group-hover:text-primary transition-colors text-left">
                                                            {item.text}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {messages.map((msg, index) => (
                                    <div
                                        key={msg.id || index}
                                        onMouseEnter={() => setHoveredMessageId(msg.id || String(index))}
                                        onMouseLeave={() => setHoveredMessageId(null)}
                                        className={cn(
                                            "flex gap-2 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out group",
                                            msg.role === 'user' ? "flex-row-reverse" : ""
                                        )}
                                    >
                                        <Avatar className={cn(
                                            "w-7 md:w-8 h-7 md:h-8 flex-shrink-0 mt-1 shadow-md bg-muted",
                                            msg.role === 'user' ? "bg-blue-600" : "bg-cyan-600 dark:bg-cyan-500"
                                        )}>
                                            <AvatarFallback className="text-white font-bold text-sm">
                                                {msg.role === 'user' ? <User className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" /> : <Bot className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className={cn(
                                            "flex flex-col gap-1 max-w-[calc(100%-2rem)] sm:max-w-[85%] md:max-w-[75%]",
                                            msg.role === 'user' ? "items-end" : "items-start"
                                        )}>
                                            <div
                                                className={cn(
                                                    "rounded-lg md:rounded-2xl px-3.5 md:px-5 py-2.5 md:py-3 text-xs sm:text-sm md:text-base leading-relaxed md:leading-loose shadow-sm max-w-none break-words transition-all duration-300",
                                                    msg.role === 'user'
                                                        ? "bg-blue-600 text-white rounded-br-none shadow-blue-500/10"
                                                        : "bg-muted text-foreground border border-border rounded-bl-none"
                                                )}
                                            >
                                                <div className="whitespace-pre-wrap font-medium leading-relaxed">{msg.content}</div>
                                            </div>

                                            <div className={cn(
                                                "flex items-center gap-1.5 md:gap-2 px-2 transition-all duration-200 h-5 md:h-6",
                                                hoveredMessageId === (msg.id || String(index)) ? "opacity-100" : "opacity-0"
                                            )}>
                                                <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                                {msg.role === 'model' && (
                                                    <div className="flex items-center gap-0.5 md:gap-1 border-l border-border pl-1.5 md:pl-2 ml-1 md:ml-2">
                                                        <button
                                                            onClick={() => copyToClipboard(msg.content, msg.id || String(index))}
                                                            className="p-1 hover:bg-muted rounded transition-all duration-200 hover:scale-110 active:scale-95"
                                                            title="Copy"
                                                        >
                                                            {copiedId === (msg.id || String(index)) ? (
                                                                <span className="text-cyan-600 dark:text-cyan-500 font-bold text-xs">✓</span>
                                                            ) : (
                                                                <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                                                            )}
                                                        </button>
                                                        <button className="p-1 hover:bg-muted rounded transition-all duration-200 hover:scale-110 active:scale-95">
                                                            <ThumbsUp className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex gap-2 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <Avatar className="w-7 md:w-8 h-7 md:h-8 mt-1 bg-cyan-600 dark:bg-cyan-500 shadow-lg shadow-cyan-500/20">
                                            <AvatarFallback><Bot className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" /></AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted border border-border rounded-lg md:rounded-2xl rounded-tl-none p-3 md:p-4 flex items-center gap-2 shadow-sm">
                                            <div className="flex gap-1.5 md:gap-2">
                                                <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-cyan-600 dark:bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-cyan-600 dark:bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-cyan-600 dark:bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4 border-t border-border bg-background/50 backdrop-blur-sm shrink-0">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative max-w-4xl mx-auto flex gap-2 md:gap-3"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="flex-1 min-h-[44px] md:min-h-[50px] bg-muted/50 border border-input focus:border-cyan-500 focus:ring-cyan-500/30 rounded-full px-4 md:px-6 shadow-sm focus:shadow-md text-sm md:text-base text-foreground placeholder:text-muted-foreground transition-all duration-300"
                                    disabled={loading}
                                    autoFocus
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={loading || !input.trim()}
                                    className="h-[44px] md:h-[50px] w-[44px] md:w-[50px] rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 md:active:scale-100 text-white"
                                >
                                    <Send className="w-4 md:w-5 h-4 md:h-5" />
                                </Button>
                            </form>
                            <p className="text-center text-[9px] md:text-[10px] text-muted-foreground mt-2 select-none">
                                AI can make mistakes. Always verify important information.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
