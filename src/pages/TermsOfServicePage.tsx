import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';

export const TermsOfServicePage: React.FC = () => {
    return (
        <PageLayout>
            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-16 flex flex-col items-start animate-in fade-in duration-300">
                <Link to="/" className="mb-8 flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-sm transition-colors bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-8 border-b border-slate-800 pb-6 w-full">Terms of Service</h1>
                <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base w-full">
                    <p className="text-amber-400 font-medium">Last Updated: July 29, 2026</p>
                    <p className="text-slate-400">Welcome to Screen Stickynote. By visiting or utilizing this open-source web application, you explicitly agree to follow and be legally bound by these basic Terms of Service.</p>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4 text-sky-400">1. License & Permitted Use</h3>
                        <p>You are granted a non-exclusive, non-transferable, global revocable license to access and load Screen Stickynote directly via compatible web browser software. The core layout structure is intended for general productivity, visual planning, and structural note-taking tasks.</p>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4 text-rose-400">2. Absolute Risk Disclaimer on Data Loss</h3>
                        <ul className="list-disc pl-5 space-y-4 mt-2">
                            <li><strong className="text-slate-200">Local Storage Vulnerability:</strong> Because this app operates exclusively offline via client-side storage, your files are saved strictly to your local machine.</li>
                            <li><strong className="text-slate-200">User Backup Obligation:</strong> We possess no capability to recover, restore, or retrieve your information. If you delete your browser profile history, purge site permissions, format your hard drive, or experience device failure, your local canvases will be lost permanently. You assume full responsibility for making frequent manual file exports (.json).</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4 text-amber-400">3. Absolute Prohibited Conduct</h3>
                        <p>You agree not to bypass, damage, or reverse-engineer the core utility layers of this website. You must not attempt to upload malicious scripts or use the layout structure to generate deceptive local phishing modules.</p>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4 text-emerald-400">4. Limitation of Liability & Warranties</h3>
                        <p>Screen Stickynote is delivered to the public "As Is" and "As Available" without warranties of any variety, express or implied. The developers shall not be held liable for any data destruction, operational interruptions, system hardware crashes, or financial impacts arising out of your reliance on the browser app layers.</p>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4 text-fuchsia-400">5. Jurisdictional Regulations & Updates</h3>
                        <p>These baseline agreements are interpreted under generalized global digital commerce guidelines. We reserve the absolute privilege to alter these layout clauses at any point. Continued use of the website platform indicates complete consensus with any fresh structural revisions.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
