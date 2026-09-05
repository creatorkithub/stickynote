import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { parseFrontmatter } from '../utils/frontmatter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSEO } from '../hooks/useSEO';
import type { BlogPostData } from '../types/blog';
import { ArrowLeft, ArrowUpRight, ArrowUp } from 'lucide-react';

export function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPostData | null>(null);
    const [error, setError] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!slug) return;

        // Vite eager load all md files and find the match
        const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });
        const targetPath = `../content/blog/${slug}.md`;

        if (modules[targetPath]) {
            const content = modules[targetPath];
            const parsed = parseFrontmatter(content as string);

            setPost({
                slug,
                content: parsed.content,
                // @ts-ignore
                title: parsed.data.title,
                // @ts-ignore
                date: parsed.data.date,
                // @ts-ignore
                excerpt: parsed.data.excerpt,
                // @ts-ignore
                thumbnail: parsed.data.thumbnail,
                // @ts-ignore
                tags: parsed.data.tags || [],
            });
        } else {
            setError(true);
        }
    }, [slug]);

    useSEO({
        title: post ? `${post.title} | Screen Stickynote Blog` : 'Loading... | Screen Stickynote Blog',
        description: post?.excerpt,
        imageUrl: post?.thumbnail,
    });

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
                <p className="text-slate-400 mb-8">The article you are looking for does not exist or has been moved.</p>
                <button onClick={() => navigate('/blog')} className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Return to Blog
                </button>
            </div>
        );
    }

    if (!post) {
        return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100 pb-20">
            <header className="py-6 px-6 sm:px-12 border-b border-slate-900/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link to="/blog" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold tracking-wide">Back</span>
                    </Link>
                    <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 group">
                        App <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </header>

            <main className="w-full max-w-6xl mx-auto px-6 pt-12 sm:pt-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    {/* Primary Content Column */}
                    <article className="flex-1 max-w-3xl">
                        {/* Post Header */}
                        <div className="mb-12">
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex gap-2 mb-6">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-xs tracking-wider uppercase font-bold text-sky-400 bg-sky-400/10 px-2.5 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
                                {post.title}
                            </h1>
                            <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                                <time>
                                    {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </time>
                                <span>•</span>
                                <span>{Math.ceil(post.content.length / 1000)} min read</span>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {post.thumbnail && (
                            <div className="w-full aspect-[21/9] sm:aspect-[2/1] rounded-2xl overflow-hidden mb-12 bg-slate-900 ring-1 ring-slate-800">
                                <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Markdown Content rendered via react-markdown + Tailwind @tailwindcss/typography plugins */}
                        <div className="prose prose-invert prose-lg prose-slate hover:prose-a:text-sky-400 prose-a:transition-colors prose-a:text-sky-500 max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </article>

                    {/* Sidebar Column */}
                    <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
                        {/* App Launch Widget */}
                        <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />
                            <h3 className="text-xl font-bold text-amber-400 mb-2">Try Screen Stickynote</h3>
                            <p className="text-sm text-slate-300 mb-6 leading-relaxed">Turn your browser into an infinite 3D workspace. No login required, entirely local-first.</p>
                            <Link to="/" className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 group-hover:shadow-amber-500/40">
                                Launch App <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Sidebar Ad Placeholder Widget */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl min-h-[300px] flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest absolute top-4 left-4">Advertisement</span>

                            <div className="w-16 h-16 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <div className="w-8 h-8 border-2 border-slate-600 border-dashed rounded" />
                            </div>

                            <p className="text-sm text-slate-500 font-medium max-w-[200px]">Support our independent development by discovering great products here.</p>
                        </div>

                        {/* Simple Links */}
                        <div className="pt-6 border-t border-slate-800 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 font-medium">
                            <Link to="/about" className="hover:text-amber-400 transition-colors">About Us</Link>
                            <Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
                            <Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Back to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-8 right-8 z-50 p-3 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-full shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
                    }`}
                aria-label="Back to top"
            >
                <ArrowUp className="w-6 h-6 stroke-[3]" />
            </button>
        </div>
    );
}
