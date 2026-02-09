import { getPortfolioSlugs, getBlogSlugs } from '@/lib/wordpress';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Static routes
    const routes = [
        '',
        '/contact',
        '/portfolio', // Archive page
        '/blog',      // Archive page
        '/services',  // Services page (if it exists as a separate route, otherwise remove)
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Portfolio Routes
    const portfolioSlugs = await getPortfolioSlugs();
    const portfolioRoutes = portfolioSlugs.map((post) => ({
        url: `${baseUrl}/portfolio/${post.slug}`,
        lastModified: new Date().toISOString(), // Idealnya ambil dari post.date/modified
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // Dynamic Blog Routes
    const blogSlugs = await getBlogSlugs();
    const blogRoutes = blogSlugs.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...routes, ...portfolioRoutes, ...blogRoutes];
}
