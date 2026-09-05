import { Link } from 'react-router-dom';
import type { BlogPostData } from '../../types/blog';

export function BlogCard({ post }: { post: BlogPostData }) {
    return (
        <Link
            to={`/blog/${post.slug}`}
            className="group flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-sky-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(2,132,199,0.3)] hover:-translate-y-1"
        >
            <div className="aspect-video w-full overflow-hidden bg-slate-800 relative">
                {post.thumbnail ? (
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-800">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                    <time className="text-xs font-medium text-slate-400">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </time>
                    {post.tags && post.tags.length > 0 && (
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                            {post.tags[0]}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-100 group-hover:text-white mb-2 line-clamp-2">
                    {post.title}
                </h3>

                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                </p>

                <div className="mt-auto flex items-center text-sky-400 text-sm font-semibold group-hover:text-sky-300 transition-colors">
                    Read Article <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </div>
        </Link>
    );
}
