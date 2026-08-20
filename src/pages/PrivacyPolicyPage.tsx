import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';

export const PrivacyPolicyPage: React.FC = () => {
    return (
        <PageLayout>
            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-16 flex flex-col items-start animate-in fade-in duration-300">
                <Link to="/" className="mb-8 flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-sm transition-colors bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-8 border-b border-slate-800 pb-6 w-full">Privacy Policy</h1>
                <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base w-full">
                    <p className="text-amber-400 font-medium">Last Updated: July 29, 2026</p>
                    <p className="text-slate-400">At Screen Stickynote, we believe your digital notes and ideas belong solely to you. This Privacy Policy outlines how our Progressive Web Application (PWA) functions on an offline-first basis and explains your global consumer rights under international regulations including the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).</p>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">1. What Data We Collect (And What We Don't)</h3>
                        <ul className="list-disc pl-5 space-y-4 mt-2">
                            <li><strong className="text-slate-200">No Server Storage:</strong> We do not collect, process, host, or store any of your note contents, titles, metadata, configurations, or alarm schedules on any server.</li>
                            <li><strong className="text-slate-200">Local Processing Only:</strong> All sticky notes and canvases are handled entirely in your web browser utilizing IndexedDB and local browser cache storage api mechanics.</li>
                            <li><strong className="text-slate-200">No Account Creation:</strong> There are no login or signup procedures. Therefore, we do not collect personal names, emails, phone numbers, or passwords.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">2. Website Analytics & Advertising Technology</h3>
                        <ul className="list-disc pl-5 space-y-4 mt-2">
                            <li><strong className="text-slate-200">Third-Party Advertising:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
                            <li><strong className="text-slate-200">Google Ads:</strong> Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet.</li>
                            <li><strong className="text-slate-200">Opt-Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">www.aboutads.info</a>.</li>
                            <li><strong className="text-slate-200">Server Logs:</strong> Like most online services, our hosting provider may collect basic, anonymous server-side connection headers (such as masked IP address and browser user-agent) purely for security debugging, firewalls, and application load-distribution. This traffic data is not cross-referenced to any personal identity.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">3. Your Global Data Rights</h3>
                        <p className="mb-4">Because your information remains locally isolated on your specific device, you enjoy complete individual autonomy over your data under Article 15-22 of the GDPR and CCPA regulations:</p>
                        <ul className="list-disc pl-5 space-y-4">
                            <li><strong className="text-slate-200">Right to Erasure (Deletion):</strong> You maintain full capability to instantly wipe all user-generated content by using the in-app storage reset tool or clearing your local web browser cache files.</li>
                            <li><strong className="text-slate-200">Right to Data Portability:</strong> You may export your entire digital canvas into a universally formatted .json file at any given moment without barriers or hidden fees.</li>
                            <li><strong className="text-slate-200">No Sale or Sharing:</strong> We do not sell, rent, monetize, or trade user data to any external business or advertising broker.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">4. Direct Support and Inquiries</h3>
                        <p>If you have any operational questions regarding our technical architecture or data-handling methods, please submit an issue on our official repository or contact us via email at: <a href="mailto:screenstickynote@gmail.com" className="text-amber-400 hover:underline">screenstickynote@gmail.com</a>.</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
