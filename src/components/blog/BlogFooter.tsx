import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ThumbsUp, Lightbulb, Share2 } from 'lucide-react';
import { parseFrontmatter } from '../../utils/frontmatter';
import type { BlogPostData } from '../../types/blog';

interface BlogFooterProps {
    tags: string[];
    currentSlug: string;
}

export function BlogFooter({ tags, currentSlug }: BlogFooterProps) {
    const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);

    // Reaction states (mock client-side state for now)
    const [hasLiked, setHasLiked] = useState(false);
    const [hasLoved, setHasLoved] = useState(false);
    const [hasInsight, setHasInsight] = useState(false);

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Fetch all blogs to find related/latest ones
        const modules = import.meta.glob('../../content/blog/*.md', { query: '?raw', import: 'default', eager: true });
        const loadedPosts = Object.entries(modules).map(([path, content]) => {
            const slug = path.replace('../../content/blog/', '').replace('.md', '');
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

        // Exclude current post and pick up to 2 most recent or related ones
        const otherPosts = loadedPosts.filter(p => p.slug !== currentSlug);
        otherPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setRelatedPosts(otherPosts.slice(0, 2));
    }, [currentSlug]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-16 pt-8 border-t border-slate-800/50">
            {/* Tags Section */}
            {tags && tags.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-slate-800/50 text-slate-300 rounded-lg text-sm font-medium border border-slate-700/50 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Reactions & Share Section */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-16 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
                <div className="flex items-center gap-4">
                    <span className="text-slate-400 font-medium text-sm">React:</span>
                    <button
                        onClick={() => setHasLiked(!hasLiked)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${hasLiked
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-slate-300'
                            }`}
                    >
                        <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-sky-400/20' : ''}`} />
                        Like
                    </button>

                    <button
                        onClick={() => setHasLoved(!hasLoved)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${hasLoved
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-slate-300'
                            }`}
                    >
                        <Heart className={`w-4 h-4 ${hasLoved ? 'fill-rose-400/20 text-rose-400' : ''}`} />
                        Love
                    </button>

                    <button
                        onClick={() => setHasInsight(!hasInsight)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${hasInsight
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-slate-300'
                            }`}
                    >
                        <Lightbulb className={`w-4 h-4 ${hasInsight ? 'fill-amber-400/20' : ''}`} />
                        Insightful
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium text-sm"
                    >
                        <Share2 className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Share Post'}
                    </button>
                </div>
            </div>

            {/* Read Next Section */}
            {relatedPosts.length > 0 && (
                <div className="pt-8 border-t border-slate-800/50">
                    <h3 className="text-2xl font-black text-white mb-6">Read More Box</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {relatedPosts.map(post => (
                            <Link key={post.slug} to={`/blog/${post.slug}`} className="group block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
                                {post.thumbnail && (
                                    <div className="h-32 overflow-hidden w-full bg-slate-800 relative">
                                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <h4 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-sky-400 transition-colors">{post.title}</h4>
                                    <p className="text-xs text-slate-500 font-medium">Read Article →</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
