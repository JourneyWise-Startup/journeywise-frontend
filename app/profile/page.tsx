"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'sonner';
import { Loader2, User, GraduationCap, Briefcase, Share2, Save, Camera } from 'lucide-react';
import { getAvatarUrl } from '@/lib/utils';

interface UserProfile {
    bio: string;
    role: string;
    schoolName: string;
    collegeName: string;
    grade: string;
    major: string;
    cgpa: string;
    company: string;
    jobRole: string;
    linkedInUrl: string;
    githubUrl: string;
    portfolioUrl: string;
    avatar?: string;
}

const ROLES = [
    { value: "School Student", label: "School Student" },
    { value: "College Student", label: "College Student" },
    { value: "Fresher", label: "Fresher / Job Seeker" },
    { value: "Professional", label: "Working Professional" },
];

export default function ProfilePage() {
    const router = useRouter();
    const { user, token, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile State
    const [formData, setFormData] = useState<UserProfile>({
        bio: "",
        role: "",
        schoolName: "",
        collegeName: "",
        grade: "",
        major: "",
        cgpa: "",
        company: "",
        jobRole: "",
        linkedInUrl: "",
        githubUrl: "",
        portfolioUrl: "",
        avatar: "",
    });

    const [progress, setProgress] = useState(0);

    // Initial Load
    useEffect(() => {
        if (!user || !token) {
            return;
        }

        setUserName(user.name || "");
        setUserEmail(user.email || "");

        // Only fetch if we have an ID
        if (user.id) {
            fetchProfile(user.id);
        }
    }, [user, token]);

    // Calculate Progress whenever formData changes
    useEffect(() => {
        calculateProgress();
    }, [formData]);

    const fetchProfile = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (data) {
                    setFormData(prev => ({ ...prev, ...data }));
                    // Check if avatar needs sync (either updated or removed)
                    if (data.avatar && user && data.avatar !== user.avatar) {
                        updateUser({ ...user, avatar: data.avatar });
                    } else if (!data.avatar && user && user.avatar) {
                        const updated = { ...user };
                        delete updated.avatar;
                        updateUser(updated);
                        setFormData(prev => ({ ...prev, avatar: "" }));
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateProgress = () => {
        let total = 0;
        let filled = 0;

        // Basic Fields (Always required for "completion" logic)
        const commonFields = ['bio', 'role', 'linkedInUrl', 'avatar'];
        total += commonFields.length;
        filled += commonFields.filter(f => !!formData[f as keyof UserProfile]).length;

        // Role Specific
        if (formData.role === 'School Student') {
            const schoolFields = ['schoolName', 'grade'];
            total += schoolFields.length;
            filled += schoolFields.filter(f => !!formData[f as keyof UserProfile]).length;
        } else if (formData.role === 'College Student') {
            const collegeFields = ['collegeName', 'major'];
            total += collegeFields.length;
            filled += collegeFields.filter(f => !!formData[f as keyof UserProfile]).length;
        } else if (formData.role === 'Fresher' || formData.role === 'Professional') {
            const gradFields = ['collegeName', 'major'];
            total += gradFields.length;
            filled += gradFields.filter(f => !!formData[f as keyof UserProfile]).length;

            if (formData.role === 'Professional') {
                total += 2; // Company, JobRole
                if (formData.company) filled++;
                if (formData.jobRole) filled++;
            }
        }

        // Normalize to 100
        const percentage = total === 0 ? 0 : Math.round((filled / total) * 100);
        setProgress(Math.min(percentage, 100));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as keyof UserProfile]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name as keyof UserProfile]: value }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user || !token) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: uploadData
            });

            if (res.ok) {
                const data = await res.json();
                if (data.avatar) {
                    setFormData(prev => ({ ...prev, avatar: data.avatar }));
                    updateUser({ ...user, avatar: data.avatar });
                    toast.success("Avatar updated successfully!");
                }
            } else {
                toast.error("Failed to upload avatar");
            }
        } catch (error) {
            console.error("Avatar upload failed", error);
            toast.error("Avatar upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !token) return;
        setSaving(true);

        // Convert CGPA to float if present
        const payload = {
            ...formData,
            cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Profile updated successfully!");
            } else {
                toast.error("Failed to save profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
            {/* Background Effects matching Home/Roadmap */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="container mx-auto max-w-4xl py-10 md:py-12 px-4 md:px-8 relative z-10 space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <Avatar className="h-20 md:h-24 w-20 md:w-24 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/10 group-hover:border-cyan-500/50 transition-all">
                                <AvatarImage src={getAvatarUrl(formData.avatar || user?.avatar)} className="object-cover" />
                                <AvatarFallback className="text-xl md:text-2xl font-bold bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400">
                                    {userName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                {uploading ? (
                                    <Loader2 className="h-5 md:h-6 w-5 md:w-6 text-white animate-spin" />
                                ) : (
                                    <Camera className="h-5 md:h-6 w-5 md:w-6 text-white" />
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                My Profile
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm md:text-base">
                                {formData.role || "Complete your profile to unlock insights"}
                            </p>
                        </div>
                    </div>

                    {/* Progress Card (Mini) */}
                    <div className="space-y-3 md:space-y-4 w-full md:w-72">
                        <Card className="border border-cyan-500/20 bg-card/60 backdrop-blur shadow-lg shadow-cyan-500/5 hover:border-cyan-500/40 transition-all">
                            <CardHeader className="pb-2 pt-4 px-4 md:px-6">
                                <CardTitle className="text-xs md:text-sm font-medium flex justify-between items-center text-foreground/80">
                                    Profile Strength
                                    <span className={`font-bold ${progress === 100 ? 'text-cyan-600 dark:text-cyan-400' : 'text-cyan-500'}`}>{progress}%</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 md:px-6 pb-4">
                                <Progress value={progress} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-2">
                                    {progress === 100 ? "Excellent! Your profile is complete." : "Add more details for better insights."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="basic" className="w-full space-y-6">
                        <TabsList className="grid w-full grid-cols-3 h-11 md:h-12 bg-muted/60 p-1 rounded-lg">
                            <TabsTrigger value="basic" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground text-xs md:text-sm rounded transition-all">
                                <User className="mr-1 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Basic</span><span className="md:hidden">Info</span>
                            </TabsTrigger>
                            <TabsTrigger value="education" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground text-xs md:text-sm rounded transition-all">
                                <GraduationCap className="mr-1 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Education</span><span className="md:hidden">Edu</span>
                            </TabsTrigger>
                            <TabsTrigger value="social" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground text-xs md:text-sm rounded transition-all">
                                <Share2 className="mr-1 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Social</span><span className="md:hidden">Links</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Basic Info Tab */}
                        <TabsContent value="basic" className="space-y-4">
                            <Card className="border border-border bg-card/50 backdrop-blur shadow-sm hover:shadow-md transition-all">
                                <CardHeader>
                                    <CardTitle className="text-lg md:text-xl">About You</CardTitle>
                                    <CardDescription>Tell us a bit about yourself and your current status.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-foreground">Full Name</Label>
                                            <Input value={userName} disabled className="bg-muted/50 cursor-not-allowed text-muted-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-foreground">Email</Label>
                                            <Input value={userEmail} disabled className="bg-muted/50 cursor-not-allowed text-muted-foreground" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-foreground">Current Role <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(val) => handleSelectChange("role", val)}
                                        >
                                            <SelectTrigger id="role" className="w-full md:w-1/2 bg-background border-input text-foreground">
                                                <SelectValue placeholder="Select your current status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ROLES.map(role => (
                                                    <SelectItem key={role.value} value={role.value}>
                                                        {role.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio" className="text-foreground">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            name="bio"
                                            className="min-h-[100px] bg-background text-foreground"
                                            placeholder="I am a passionate learner interested in..."
                                            value={formData.bio || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Education / Role Specific Tab */}
                        <TabsContent value="education" className="space-y-4">
                            <Card className="border border-border bg-card/50 backdrop-blur shadow-sm hover:shadow-md transition-all">
                                <CardHeader>
                                    <CardTitle>
                                        {formData.role === 'Professional' ? 'Professional Details' : 'Education Details'}
                                    </CardTitle>
                                    <CardDescription>Help us understand your academic or professional background.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {!formData.role && (
                                        <div className="flex items-center justify-center p-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                                            Please select a Role in the Basic Info tab first.
                                        </div>
                                    )}

                                    {formData.role === 'School Student' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="schoolName">School Name</Label>
                                                <Input id="schoolName" name="schoolName" placeholder="e.g. DPS, KV" value={formData.schoolName || ""} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="grade">Grade / Class</Label>
                                                <Input id="grade" name="grade" placeholder="e.g. 10th, 12th" value={formData.grade || ""} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cgpa">CGPA / Percentage (Optional)</Label>
                                                <Input id="cgpa" name="cgpa" type="number" step="0.01" placeholder="e.g. 9.5" value={formData.cgpa || ""} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    )}

                                    {formData.role === 'College Student' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="collegeName">College / University</Label>
                                                <Input id="collegeName" name="collegeName" placeholder="e.g. IIT, Amity" value={formData.collegeName || ""} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="major">Major / Branch</Label>
                                                <Input id="major" name="major" placeholder="e.g. Computer Science" value={formData.major || ""} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cgpa">Current CGPA</Label>
                                                <Input id="cgpa" name="cgpa" type="number" step="0.01" placeholder="e.g. 8.5" value={formData.cgpa || ""} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    )}

                                    {(formData.role === 'Fresher' || formData.role === 'Professional') && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="collegeName">Last College Attended</Label>
                                                <Input id="collegeName" name="collegeName" placeholder="College Name" value={formData.collegeName || ""} onChange={handleInputChange} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="major">Degree / Focus</Label>
                                                <Input id="major" name="major" placeholder="e.g. B.Tech, MBA" value={formData.major || ""} onChange={handleInputChange} />
                                            </div>
                                            {formData.role === 'Professional' && (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="company">Current Company</Label>
                                                        <Input id="company" name="company" placeholder="e.g. Google, Infosys" value={formData.company || ""} onChange={handleInputChange} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="jobRole">Job Title</Label>
                                                        <Input id="jobRole" name="jobRole" placeholder="e.g. Software Engineer" value={formData.jobRole || ""} onChange={handleInputChange} />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Social / Links Tab */}
                        <TabsContent value="social" className="space-y-4">
                            <Card className="border border-border bg-card/50 backdrop-blur shadow-sm hover:shadow-md transition-all">
                                <CardHeader>
                                    <CardTitle>Online Presence</CardTitle>
                                    <CardDescription>Connect your professional profiles.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="linkedInUrl" className="flex items-center gap-2">
                                                <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-500" /> LinkedIn Profile
                                            </Label>
                                            <Input
                                                id="linkedInUrl"
                                                name="linkedInUrl"
                                                placeholder="https://linkedin.com/in/..."
                                                value={formData.linkedInUrl || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="githubUrl" className="flex items-center gap-2">
                                                <Share2 className="w-4 h-4 text-foreground" /> GitHub Profile (Optional)
                                            </Label>
                                            <Input
                                                id="githubUrl"
                                                name="githubUrl"
                                                placeholder="https://github.com/..."
                                                value={formData.githubUrl || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="portfolioUrl" className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> Portfolio / Website (Optional)
                                            </Label>
                                            <Input
                                                id="portfolioUrl"
                                                name="portfolioUrl"
                                                placeholder="https://mywebsite.com"
                                                value={formData.portfolioUrl || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Submit Action */}
                    <div className="mt-8 flex justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Profile
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
