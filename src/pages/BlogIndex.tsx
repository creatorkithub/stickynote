import { useState, useEffect } from 'react';
import { parseFrontmatter } from '../utils/frontmatter';
import { useSEO } from '../hooks/useSEO';
import { BlogCard } from '../components/blog/BlogCard';
import type { BlogPostData } from '../types/blog';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SiteFooter } from '../components/SiteFooter';

export function BlogIndex() {
    const [posts, setPosts] = useState<BlogPostData[]>([]);

    useSEO({
        title: 'Development Blog | Screen Stickynote',
        description: 'Read the latest updates, tutorials, and deep-dives about the Screen Stickynote application.',
    });

    useEffect(() => {
        // Dynamic import of markdown files in Vite
        // query: '?raw' ensures we get the text content
        const modules = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });

        const loadedPosts = Object.entries(modules).map(([path, content]) => {
            const slug = path.replace('../content/blog/', '').replace('.md', '');
            const parsed = parseFrontmatter(content as string);
            return {
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
            } as BlogPostData;
        });

        // Sort heavily newest first
        loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(loadedPosts);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
            <header className="py-6 px-6 sm:px-12 border-b border-slate-900/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">Back to App</span>
                    </Link>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                        App Blog
                    </h1>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 py-16">
                <div className="mb-20 relative">
                    {/* Background glow effects */}
                    <div className="absolute inset-0 bg-sky-500/10 blur-[100px] rounded-full w-[300px] h-[300px] top-1/2 left-0 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full w-[400px] h-[400px] top-0 left-[30%] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-sm font-semibold tracking-wide mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                            Screen Stickynote Blog
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500">
                            Ideas, insights, <br className="hidden sm:block" /> and deep dives.
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl font-medium leading-relaxed">
                            Discover product updates, design philosophy, and cognitive strategies to help you stay organized in a chaotic digital world.
                        </p>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        Loading posts...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>
                )}
            </main>
            <SiteFooter />
        </div>
    );
}
