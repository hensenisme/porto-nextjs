import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getBlogSlugs, getFilterCategories, getRelatedContent, getBlogPosts } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import RelatedPostCard from '@/components/common/RelatedPostCard';
import SearchWidget from '@/components/common/SearchWidget';
import MagneticButton from '@/components/common/MagneticButton';

// Revalidate data periodically (optional)
export const revalidate = 60;

// Generate static paths for blog posts
export async function generateStaticParams() {
    try {
        const allPosts = await getBlogSlugs();
        if (!allPosts) {
            console.warn("generateStaticParams: No blog posts found or fetch failed.");
            return [];
        }
        return allPosts.map((post) => ({
            slug: post.slug,
        }));
    } catch (error) {
        console.error("generateStaticParams Error:", error);
        return [];
    }
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
    try {
        const post = await getPostBySlug(params.slug);
        if (!post) {
            return { title: 'Post Not Found' };
        }
        const plainExcerpt = post.excerpt?.replace(/<[^>]*>?/gm, '') || 'Read this blog post.';

        return {
            title: `${post.title} | Blog`,
            description: plainExcerpt.substring(0, 160),
        };
    } catch (error) {
        return { title: 'Error Loading Post' };
    }
}

export default async function BlogPostPage({ params }) {
    const { slug } = params;
    let post;

    try {
        post = await getPostBySlug(slug);
    } catch (error) {
        console.error("Error fetching post:", error);
        // Fallback to notFound or custom error handling depending on preference
        // notFound() will show the 404 page, which is safer than 500
    }

    if (!post) {
        notFound();
    }

    // Ambil data untuk sidebar dan related posts
    let latestPosts = [];
    let blogCategories = [];
    let relatedPosts = [];
    let primarySubCategory = null;

    try {
        // Safe parallel fetching
        const [categoriesData, latestPostsData] = await Promise.all([
            getFilterCategories().catch(e => ({ blogCategories: [] })),
            getBlogPosts({ first: 3 }).catch(e => ({ nodes: [] }))
        ]);

        blogCategories = categoriesData?.blogCategories || [];
        latestPosts = latestPostsData?.nodes || [];

        // Calculate related posts
        const currentPostBlogSubCategories = post.allCategories?.nodes
            ?.filter(cat => cat.parent?.node?.slug === 'blog')
            ?.map(cat => cat.id) || [];

        primarySubCategory = post.allCategories?.nodes?.find(cat => cat.parent?.node?.slug === 'blog') || null;

        if (currentPostBlogSubCategories.length > 0) {
            relatedPosts = await getRelatedContent({
                categoriesIn: currentPostBlogSubCategories,
                currentPostId: post.id,
                postType: 'blog'
            }).catch(e => []);
        }

    } catch (error) {
        console.error("Error fetching sidebar/related data:", error);
        // Continue rendering the main post even if sidebar fails
    }


    return (
        <main className="main-bg">
            {/* Header Detail Blog */}
            <div className="header blog-header section-padding pb-0">
                <div className="container mt-80">
                    <div className="row justify-content-center">
                        <div className="col-lg-11">
                            <div className="caption">
                                <div className="mb-30">
                                    <MagneticButton href="/blog" className="butn butn-sm radius-30">
                                        <span className="icon ti-arrow-left mr-10"></span>
                                        <span className="text">Back to Blog</span>
                                    </MagneticButton>
                                </div>
                                <div className="sub-title fz-12">
                                    {/* Display the primary sub-category */}
                                    {primarySubCategory ? (
                                        <span key={primarySubCategory.slug}>
                                            <Link href={`/blog?category=${primarySubCategory.slug}`}>{primarySubCategory.name}</Link>
                                        </span>
                                    ) : (
                                        <span>Blog Post</span>
                                    )}
                                </div>
                                <h1 className="fz-55 mt-30">{post.title}</h1>
                            </div>
                            <div className="info d-flex mt-40 align-items-center">
                                <div className="date">
                                    <span className="opacity-7">Published on</span>
                                    <h6 className="fz-16">
                                        {post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date unknown'}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Safe image rendering */}
                {post.featuredImage?.node?.sourceUrl && (
                    <div className="featured-img-container mt-50 container" style={{ maxWidth: '900px', margin: '50px auto 0 auto', borderRadius: '10px', overflow: 'hidden' }}>
                        <Image
                            src={post.featuredImage.node.sourceUrl.replace('https://blog.hendri.tech/wp-content', '/wp-content')}
                            alt={post.featuredImage.node.altText || post.title || 'Blog Image'}
                            width={post.featuredImage.node.mediaDetails?.width || 800}
                            height={post.featuredImage.node.mediaDetails?.height || 500}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            priority
                        />
                    </div>
                )}
            </div>

            <section className="blog section-padding">
                <div className="container">
                    <div className="row xlg-marg">
                        {/* Konten Utama Postingan */}
                        <div className="col-lg-8">
                            <div className="main-post">
                                {post.content && (
                                    <div className="wordpress-content item pb-60" dangerouslySetInnerHTML={{ __html: post.content }} />
                                )}
                            </div>
                        </div>

                        {/* Sidebar Lengkap */}
                        <div className="col-lg-4">
                            <div className="sidebar">
                                <SearchWidget />

                                <div className="widget catogry">
                                    <h6 className="title-widget">Categories</h6>
                                    <ul className="rest">
                                        {blogCategories?.map((cat) => (
                                            <li key={cat.slug}>
                                                <span><Link href={`/blog?category=${cat.slug}`}>{cat.name}</Link></span>
                                                <span className="ml-auto">{cat.count}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="widget last-post-thum">
                                    <h6 className="title-widget">Latest Posts</h6>
                                    {latestPosts?.map((latestPost) => (
                                        <div key={latestPost.slug} className="item d-flex align-items-center">
                                            <div>
                                                <div className="img">
                                                    <Link href={`/blog/${latestPost.slug}`}>
                                                        {latestPost.featuredImage?.node?.sourceUrl ? (
                                                            <Image
                                                                src={latestPost.featuredImage.node.sourceUrl.replace('https://blog.hendri.tech/wp-content', '/wp-content')}
                                                                alt={latestPost.featuredImage.node.altText || latestPost.title}
                                                                width={80} height={80} style={{ objectFit: 'cover', borderRadius: '5px' }}
                                                            />
                                                        ) : (
                                                            <div style={{ width: 80, height: 80, background: '#333', borderRadius: '5px' }} />
                                                        )}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="cont">
                                                <h6><Link href={`/blog/${latestPost.slug}`}>{latestPost.title}</Link></h6>
                                                <span className="fz-12 opacity-7 mt-5 d-block">
                                                    {latestPost.date ? new Date(latestPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {relatedPosts && relatedPosts.length > 0 && (
                <section className="related-posts section-padding bord-top-grd">
                    <div className="container">
                        <div className="sec-head mb-80">
                            <h3 className="fw-600 fz-50 text-u d-rotate wow">
                                <span className="rotate-text">
                                    Related <span className="fw-200">Articles</span>
                                </span>
                            </h3>
                        </div>
                        <div className="row">
                            {relatedPosts.map(relatedPost => (
                                <RelatedPostCard key={relatedPost.slug} post={relatedPost} type="blog" />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

