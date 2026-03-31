import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Gavel, Scale, AlertCircle } from 'lucide-react';

export default function TermsOfService() {
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
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                            <Gavel className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                    </div>
                    <p className="text-muted-foreground italic">Last Updated: {lastUpdated}</p>
                </div>

                {/* Content Sections */}
                <div className="space-y-12 prose prose-slate dark:prose-invert max-w-none">
                    <section className="bg-accent/20 p-8 rounded-2xl border border-border/50">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            <h2 className="text-xl font-bold m-0">Legal Disclaimer</h2>
                        </div>
                        <p className="text-sm leading-relaxed mb-0">
                            The information provided by JourneyWise AI is for general career guidance purposes only. We do not guarantee employment, academic success, or specific career outcomes. All career choices should be made after individual research and professional consultation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using JourneyWise AI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                        <p>
                            JourneyWise AI provides an AI-powered platform for career roadmap generation, resume analysis, and interview preparation. Our services are based on advanced AI algorithms and curated industry success stories.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. User Responsibility & Content Protection</h2>
                        <p>
                            Users are responsible for maintaining the confidentiality of their account credentials. You agree not to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Attempt to "scrape", copy, or replicate our AI algorithms or proprietary databases.</li>
                            <li>Use our content for commercial purposes without explicit written consent from JourneyWise AI.</li>
                            <li>Engage in any fraudulent activity, including but not limited to impersonating success stories or providing false credentials.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Intellectual Property Rights</h2>
                        <p>
                            All original content, features, and functionality on JourneyWise (including the logo, AI-generated roadmap structures, and success story databases) are the exclusive property of <strong>JourneyWise AI</strong> and are protected by Indian and international copyright, trademark, and other intellectual property laws.
                        </p>
                        <div className="bg-blue-500/5 border-l-4 border-blue-500 p-4 mt-4 italic">
                            "Any unauthorized reproduction of this platform's proprietary systems will be subject to legal action under the Copyright Act, 1957."
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Governing Law</h2>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of <strong>India</strong>, without regard to its conflict of law provisions. Disputes shall be subject to the exclusive jurisdiction of the courts in India.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Modification of Services</h2>
                        <p>
                            We reserve the right to withdraw or amend our service, and any service or material we provide on the platform, in our sole discretion without notice.
                        </p>
                    </section>

                    <hr className="border-border/50" />

                    <div className="flex flex-col items-center justify-center p-8 text-center bg-accent/30 rounded-3xl border border-border/50">
                        <Scale className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Have questions about our terms?</h3>
                        <p className="text-muted-foreground mb-6">Contact our legal team for clarification.</p>
                        <Link href="mailto:sameersheikh0288@gmail.com" className="px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:opacity-90 transition-opacity">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
