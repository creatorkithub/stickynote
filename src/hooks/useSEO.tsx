import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    canonicalUrl?: string;
    imageUrl?: string;
}

export function useSEO({ title, description, canonicalUrl, imageUrl }: SEOProps) {
    // We can return a Helmet component to be rendered by the consumer page
    return (
        <Helmet>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph Meta Tags for social sharing */}
            <meta property="og:title" content={title} />
            {description && <meta property="og:description" content={description} />}
            {imageUrl && <meta property="og:image" content={imageUrl} />}
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            {description && <meta name="twitter:description" content={description} />}
            {imageUrl && <meta name="twitter:image" content={imageUrl} />}
        </Helmet>
    );
}
