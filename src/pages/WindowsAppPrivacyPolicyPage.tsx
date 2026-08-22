import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';

export const WindowsAppPrivacyPolicyPage: React.FC = () => {
    useEffect(() => {
        // Add noindex, nofollow meta tag dynamically on mount
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);

        return () => {
            // Clean up upon unmount
            document.head.removeChild(meta);
        };
    }, []);

    return (
        <PageLayout>
            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-16 flex flex-col items-start animate-in fade-in duration-300">
                <Link to="/" className="mb-8 flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-sm transition-colors bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-8 border-b border-slate-800 pb-6 w-full">Privacy Policy for Screen StickyNote</h1>
                <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base w-full">
                    <p className="text-amber-400 font-medium">Last Updated: August 21, 2026</p>
                    <p className="text-slate-400">Your privacy is critically important to us. This Privacy Policy governs the data processing practices of Screen StickyNote ("the Application"), a Windows desktop application published on the Microsoft Store.</p>
                    <p className="text-slate-400">In strict alignment with the core data reduction principles outlined in the Microsoft Privacy Statement, Screen StickyNote is engineered from the ground up as a 100% offline local utility. We do not harvest, track, profile, or transmit your personal information.</p>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">1. Personal Data We Collect (And What We Do Not Collect)</h3>
                        <p className="mb-4">According to the Microsoft Privacy Statement, personal data typically encompasses information used to interact with a service.</p>
                        <ul className="list-disc pl-5 space-y-4">
                            <li><strong className="text-slate-200">No Collection of Personal Data:</strong> Screen StickyNote does not collect your name, email address, mailing address, phone number, account credentials, payment information, or biometric information.</li>
                            <li><strong className="text-slate-200">No Telemetry or Analytics:</strong> The Application contains zero tracking hooks. We do not gather automated performance telemetry, usage tracking logs, or web-browsing histories.</li>
                            <li><strong className="text-slate-200">No Crash Reporting Over the Web:</strong> If a technical failure occurs, crash dump details are handled purely via local system files or standard Windows diagnostics depending on your operating system preferences; the app itself does not transmit software error logs back to the developer.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">2. Required Application Operational Data (Local Processing Only)</h3>
                        <p className="mb-4">To allow you to build, customize, and save your desktop sticky notes, the Application must store certain internal configurations. This transactional information is processed exclusively on your physical device and is never uploaded anywhere:</p>
                        <ul className="list-disc pl-5 space-y-4">
                            <li><strong className="text-slate-200">User Content:</strong> Text, titles, lists, tags, and formatting notes created inside the app interfaces.</li>
                            <li><strong className="text-slate-200">Layout Attributes:</strong> The exact X and Y layout coordinates of where you position note windows on your multi-monitor setups.</li>
                            <li><strong className="text-slate-200">Aesthetic Parameters:</strong> Personalized theme preferences, font selections, transparency tiers, and sticky note window background colors.</li>
                            <li><strong className="text-slate-200">Time Variables:</strong> Specific calendar times or countdown alerts mapped to notes for custom reminders.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">3. Storage and Processing Framework</h3>
                        <ul className="list-disc pl-5 space-y-4">
                            <li><strong className="text-slate-200">100% Offline Database:</strong> All of your sticky note contents, settings, and histories are saved directly onto your device's hard drive into an encapsulated SQLite database configuration (notes_storage.db).</li>
                            <li><strong className="text-slate-200">Zero Cloud Synchronization:</strong> Unlike enterprise or online consumer apps, Screen StickyNote does not utilize remote cloud servers, web portals, or distributed storage instances to back up data.</li>
                            <li><strong className="text-slate-200">Permanent Local Erasure:</strong> Because the developer maintains no copies or backups of your note fragments, deleting the Application or wiping its corresponding data directories will permanently remove your information from your device.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">4. Third-Party Interactions and Third-Party Links</h3>
                        <ul className="list-disc pl-5 space-y-4">
                            <li><strong className="text-slate-200">No Advertising Identification Tracking:</strong> The Application ignores the default Windows Advertising ID token and does not transmit variables to third-party ad networks, content brokers, or analytic handlers.</li>
                            <li><strong className="text-slate-200">No Network Traffic Execution:</strong> The app does not maintain outbound network connectivity permissions. It is structurally impossible for your note records to be disclosed to data vendors or marketing affiliates.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">5. Operating System and Device Capabilities</h3>
                        <p className="mb-4">For your benefit, the Application can request permission to perform certain low-level system integrations:</p>
                        <ul className="list-disc pl-5 space-y-4">
                            <li><strong className="text-slate-200">Startup Launch Shortcut:</strong> If selected, the app writes an operational reference block into your local Windows Registry profile allowing it to launch automatically upon system boot. It does not look at or capture adjacent registry processes.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">6. Updates and Changes to This Policy</h3>
                        <p>We evaluate our compliance benchmarks routinely. If the functional source code of Screen StickyNote is expanded in the future to introduce internet-dependent cloud syncing features, this Privacy Policy will be comprehensively revised, and clear warning options will be provided within the Microsoft Store update prompt prior to download.</p>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h3 className="text-xl font-bold text-slate-200 mb-4">7. Contact Information</h3>
                        <p>If you have questions regarding the structural local layout of this program, please submit an inquiry through our dedicated developer message channel provided on the Microsoft Store listing.</p>
                        <p className="mt-4"><strong>Contact mail is same as this website:</strong> <a href="mailto:screenstickynote@gmail.com" className="text-amber-400 hover:underline">screenstickynote@gmail.com</a></p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
