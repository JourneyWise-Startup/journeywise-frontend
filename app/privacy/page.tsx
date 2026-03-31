import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Database, Eye, Lock, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
    const lastUpdated = "March 31, 2026";

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container max-w-4xl mx-auto px-4">
                {/* Header Section */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 font-medium mb-6 transition-colors group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    </div>
                    <p className="text-muted-foreground italic">Last Updated: {lastUpdated}</p>
                </div>

                {/* Content Sections */}
                <div className="space-y-12 prose prose-slate dark:prose-invert max-w-none">
                    <section className="bg-accent/20 p-8 rounded-2xl border border-border/50">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-emerald-500" />
                            <h2 className="text-xl font-bold m-0">Commitment to Privacy</h2>
                        </div>
                        <p className="text-sm leading-relaxed mb-0">
                            Your privacy is our priority. This Privacy Policy explains how JourneyWise AI handles your personal data in compliance with the Information Technology Act, 2000 and the <strong>Digital Personal Data Protection Act (DPDP), 2023</strong> of India.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Database className="w-6 h-6 text-blue-500" /> 1. Data We Collect
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, profile picture (if provided).</li>
                            <li><strong>Professional Data:</strong> Resumes uploaded for analysis, current job title, skills, and target industries.</li>
                            <li><strong>AI Interaction Data:</strong> Career roadmap queries, chat history with our AI, and interview practice scores.</li>
                            <li><strong>Technical Data:</strong> IP address, browser type, and device information for security and optimization purposes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Eye className="w-6 h-6 text-purple-500" /> 2. How We Use Information
                        </h2>
                        <p>We use your data to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide personalized career roadmaps and resume insights.</li>
                            <li>Train and fine-tune our AI recommendations (anonymized data only).</li>
                            <li>Verify your identity and maintain account security.</li>
                            <li>Handle support requests and communicate updates.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Lock className="w-6 h-6 text-amber-500" /> 3. Data Protection Measures
                        </h2>
                        <p>
                            We employ state-of-the-art security measures to protect your personal information against unauthorized access, theft, or misuse. This includes <strong>SSL/TLS encryption</strong> for all data transmissions and secure server-side storage with restricted access protocols.
                        </p>
                        <div className="bg-emerald-500/5 border-l-4 border-emerald-500 p-4 mt-4 italic">
                            "Your personal career data is encrypted and never sold to third-party advertisers."
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Sharing with Third Parties</h2>
                        <p>
                            We do not sell your personal data. We only share data with service providers (e.g., Google Firebase, AWS, Gemini API) as necessary to host and deliver our core services, under strict confidentiality agreements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Your Rights in India</h2>
                        <p>Under the DPDP Act 2023, you have the following rights:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Right to Access and Correction of your personal data.</li>
                            <li>Right to Erasure (the "Right to be Forgotten").</li>
                            <li>Right to Withdraw Consent for future data processing.</li>
                            <li>Right to nominate a person in case of death or incapacity.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Cookies Policy</h2>
                        <p>
                            We use essential cookies for user authentication and session management. You can manage your cookie preferences through your browser settings.
                        </p>
                    </section>

                    <hr className="border-border/50" />

                    <div className="flex flex-col items-center justify-center p-8 text-center bg-accent/30 rounded-3xl border border-border/50 shadow-sm">
                        <Lock className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Concerned about your data?</h3>
                        <p className="text-muted-foreground mb-6">Our Data Protection Officer is ready to help.</p>
                        <Link href="mailto:sameersheikh0288@gmail.com" className="px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity">
                            Contact Privacy Team
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
