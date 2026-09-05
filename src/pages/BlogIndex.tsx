import { useState, useEffect } from 'react';
import { parseFrontmatter } from '../utils/frontmatter';
import { useSEO } from '../hooks/useSEO';
import { BlogCard } from '../components/blog/BlogCard';
import type { BlogPostData } from '../types/blog';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Latest Insights</h2>
                    <p className="text-lg text-slate-400 max-w-2xl">
                        Discover product updates, design philosophy, and deep dives into features helping you stay organized.
                    </p>
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
        </div>
    );
}
