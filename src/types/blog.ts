export interface BlogPostMeta {
    title: string;
    date: string;
    excerpt: string;
    thumbnail?: string;
    tags?: string[];
}

export interface BlogPostData extends BlogPostMeta {
    slug: string;
    content: string;
}
