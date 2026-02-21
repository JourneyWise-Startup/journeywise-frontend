"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Linkedin, Upload, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareJourneyPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [linkedinConnected, setLinkedinConnected] = useState(false);
    const [linkedinData, setLinkedinData] = useState<any>(null);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [enablePaidCalls, setEnablePaidCalls] = useState(false); // Used for Roadmap Selling
    const [enableMentorship, setEnableMentorship] = useState(false);
    const [mentorshipPrice, setMentorshipPrice] = useState("");

    const handleLinkedinConnect = () => {
        setLoading(true);
        // Mock LinkedIn OAuth Delay
        setTimeout(() => {
            setLinkedinConnected(true);
            setLinkedinData({
                name: "Rahul Sharma",
                headline: "Associate Software Engineer at TechCorp",
                profileUrl: "https://linkedin.com/in/rahul-mock",
                image: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=0D8ABC&color=fff"
            });
            setLoading(false);
            toast.success("LinkedIn Profile Connected!");
        }, 1500);
    };

    const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProofFile(e.target.files[0]);
            toast.success("Proof document uploaded successfully");
        }
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const { user } = useAuth(); // Get authenticated user

    const handleSubmit = async () => {
        if (!user) {
            toast.error("You must be logged in to submit.");
            return;
        }
        setLoading(true);
        try {
            // 1. Mock Upload Proof (In real app, upload to S3/Cloudinary)
            const proofUrl = "https://journeywise-assets.s3.amazonaws.com/proofs/mock-offer-letter.pdf";

            // 2. Become Guide
            // Pack detailed form data into Bio/Headline for MVP simplicity
            const formattedHeadline = `${linkedinData?.headline || "JourneyWise User"}`;
            const formattedBio = `**Transformation Story**\n${document.querySelector<HTMLTextAreaElement>('textarea')?.value || "No story provided."}\n\n**Stats**\nPrevious: ${document.querySelectorAll('input')[0]?.value || "N/A"}\nNew: ${document.querySelectorAll('input')[2]?.value || "N/A"}`;

            const guideRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/become-guide`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    headline: formattedHeadline,
                    bio: formattedBio,
                    proofs: [proofUrl]
                })
            });

            if (!guideRes.ok) throw new Error("Failed to create guide profile");

            // 3. Create Services
            // A. Roadmap Access
            if (enablePaidCalls) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/services`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        type: "ROADMAP_ACCESS",
                        title: "Unlock Detailed Roadmap",
                        description: "Access my exact week-by-week plan & resources.",
                        price: 199
                    })
                });
            }

            // B. Mentorship Calls
            if (enableMentorship) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/services`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        type: "ONE_ON_ONE_CALL",
                        title: "1:1 Mentorship Call",
                        description: "30-min video call for career guidance.",
                        price: Number(mentorshipPrice) || 499,
                        duration: 30
                    })
                });
            }

            toast.success("Journey Submitted & Profile Verified! You are now a Guide.");
            router.push('/journeys');

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Share Your Journey</h1>
                    <p className="text-muted-foreground"> inspire others and earn by mentoring. Verification required.</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between items-center px-10">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">
                                {s === 1 ? 'Verify' : s === 2 ? 'Details' : 'Proof'}
                            </span>
                        </div>
                    ))}
                </div>

                <Card className="border-emerald-500/20 shadow-lg">
                    {step === 1 && (
                        <>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Linkedin className="w-6 h-6 text-blue-600" />
                                    Step 1: LinkedIn Verification
                                </CardTitle>
                                <CardDescription>
                                    To prevent fake profiles, we require a valid LinkedIn connection.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {!linkedinConnected ? (
                                    <div className="bg-blue-50 dark:bg-blue-950/30 p-8 rounded-xl border border-blue-100 dark:border-blue-900 text-center">
                                        <div className="mb-4">
                                            <Linkedin className="w-12 h-12 text-blue-600 mx-auto" />
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2">Connect your LinkedIn Profile</h3>
                                        <p className="text-sm text-muted-foreground mb-6">
                                            We'll verify your current role and history. Your profile URL will remain private until you approve.
                                        </p>
                                        <Button onClick={handleLinkedinConnect} disabled={loading} className="bg-[#0077b5] hover:bg-[#006097] text-white">
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Linkedin className="w-4 h-4 mr-2" />}
                                            Verify with LinkedIn
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900 flex items-center gap-4">
                                        <img src={linkedinData.image} alt="Profile" className="w-16 h-16 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">{linkedinData.name}</h3>
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Verified
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-foreground/80">{linkedinData.headline}</p>
                                            <p className="text-xs text-muted-foreground mt-1">LinkedIn ID Connected Successfully</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button onClick={handleNext} disabled={!linkedinConnected}>Continue</Button>
                            </CardFooter>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <CardHeader>
                                <CardTitle>Step 2: Journey Details</CardTitle>
                                <CardDescription>Tell us about your transformation.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Previous Role</Label>
                                        <Input placeholder="e.g. Support Executive" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Previous Salary (Optional)</Label>
                                        <Input placeholder="e.g. 3 LPA" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>New Role / Outcome</Label>
                                    <Input placeholder="e.g. Data Analyst at Swiggy" />
                                </div>
                                <div className="space-y-2">
                                    <Label>New Salary / Hike</Label>
                                    <Input placeholder="e.g. 9 LPA (200% Hike)" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Your Story (The struggle, the shift, the tools)</Label>
                                    <Textarea placeholder="Share your real experience..." className="h-32" />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="ghost" onClick={handleBack}>Back</Button>
                                <Button onClick={handleNext}>Continue</Button>
                            </CardFooter>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-orange-500" />
                                    Step 3: Real-World Proof
                                </CardTitle>
                                <CardDescription>
                                    Upload proof to get the <span className="font-semibold text-emerald-500">"Verified Proof"</span> badge.
                                    Required for offering paid calls.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50 text-sm text-orange-800 dark:text-orange-200 flex gap-3">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    <p>Your documents are <strong>never shared publicly</strong>. We only use them to verify your employment. You can blur sensitive data like phone numbers.</p>
                                </div>

                                <div className="space-y-4">
                                    <Label>Upload Offer Letter, ID Card, or LinkedIn Screenshot</Label>
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                        <input type="file" onChange={handleProofUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.png" />
                                        {proofFile ? (
                                            <div className="flex flex-col items-center text-emerald-600">
                                                <CheckCircle2 className="w-10 h-10 mb-2" />
                                                <p className="font-medium">{proofFile.name}</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-muted-foreground">
                                                <Upload className="w-10 h-10 mb-2" />
                                                <p>Click to upload proof (PDF/Image)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border">
                                    <Label className="text-base font-semibold">How do you want to help & earn?</Label>
                                    <div className="grid gap-3">
                                        {/* Option 1: Roadmap */}
                                        <div
                                            className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${enablePaidCalls ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-border hover:border-emerald-200'}`}
                                            onClick={() => setEnablePaidCalls(!enablePaidCalls)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={enablePaidCalls}
                                                onChange={() => { }}
                                                className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="font-semibold text-sm">Sell My Roadmap Access</h4>
                                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Passive Income</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Allow users to unlock your exact week-by-week plan, resources, and project details for a small fee (e.g., ₹199).
                                                </p>
                                            </div>
                                        </div>

                                        {/* Option 2: 1:1 Calls (Platform Native) */}
                                        <div
                                            className={`p-3 rounded-xl border flex flex-col gap-3 cursor-pointer transition-all ${enableMentorship ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-border hover:border-emerald-200'}`}
                                            onClick={(e) => {
                                                if ((e.target as HTMLElement).tagName !== 'INPUT') {
                                                    setEnableMentorship(!enableMentorship);
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                                                    id="opt_calls"
                                                    checked={enableMentorship}
                                                    onChange={(e) => setEnableMentorship(e.target.checked)}
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label htmlFor="opt_calls" className="font-semibold text-sm cursor-pointer">1:1 Mentorship Calls</label>
                                                        <Badge variant="outline">High Value</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Offer 30-min guidance sessions. You set the price and schedule.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Configuration Inputs */}
                                            {enableMentorship && (
                                                <div className="pl-7 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">Price per 30 mins (₹)</Label>
                                                            <Input
                                                                placeholder="e.g. 499"
                                                                className="h-8 text-xs bg-background"
                                                                value={mentorshipPrice}
                                                                onChange={(e) => setMentorshipPrice(e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">Availability</Label>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full h-8 text-xs justify-start font-normal bg-background"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toast.success("Availability slots configured (Mock)");
                                                                }}
                                                            >
                                                                Configure Slots...
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                        Platform Feature: Users pay FIRST, then pick from your slots.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Option 3: Resume Review */}
                                        <div className="p-3 rounded-xl border border-border flex items-start gap-3 cursor-pointer hover:bg-muted/30">
                                            <input type="checkbox" className="mt-1 w-4 h-4 rounded" id="opt_resume" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm">Resume Reviews</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Critique resumes for aspiring candidates in your field.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center pt-2">
                                        * Earnings are paid out monthly. <span className="underline cursor-pointer">View Creator Terms</span>
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="ghost" onClick={handleBack}>Back</Button>
                                <Button onClick={handleSubmit} disabled={loading || (!proofFile && enablePaidCalls)} className="bg-emerald-600 hover:bg-emerald-700">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Submit Journey'}
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
