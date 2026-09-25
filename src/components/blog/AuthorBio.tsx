import { ExternalLink } from 'lucide-react';

export function AuthorBio() {
    return (
        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/20 flex-shrink-0 flex items-center justify-center text-sky-400 font-bold text-2xl">
                BN
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Balachandar Nadar</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    Balachandar Nadar is the developer behind ScreenStickynote. They specialize in building privacy-first, zero-login utility apps designed to escape cloud fatigue and return control of data back to the user's local machine.
                </p>
                <a
                    href="https://www.linkedin.com/in/balachandar-nadar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                >
                    <ExternalLink className="w-4 h-4" /> Connect on LinkedIn
                </a>
            </div>
        </div>
    );
}
