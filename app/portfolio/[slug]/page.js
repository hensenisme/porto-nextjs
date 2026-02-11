import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getPortfolioSlugs, getRelatedContent } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import RelatedPostCard from '@/components/common/RelatedPostCard';
import MagneticButton from '@/components/common/MagneticButton';

// Revalidate data
export const revalidate = 60;

// Generate static paths
export async function generateStaticParams() {
  try {
    const allPosts = await getPortfolioSlugs();
    if (!allPosts) {
      console.warn("generateStaticParams: No portfolio slugs found.");
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

export async function generateMetadata({ params }) {
  try {
    const post = await getPostBySlug(params.slug);
    if (!post) return { title: 'Portfolio Item Not Found' };
    const plainExcerpt =
      post.excerpt?.replace(/<[^>]*>?/gm, '') || 'View this portfolio item.';
    return {
      title: `${post.title} | Portfolio`,
      description: plainExcerpt.substring(0, 160),
    };
  } catch (error) {
    return { title: 'Error Loading Portfolio' };
  }
}

export default async function PortfolioItemPage({ params }) {
  const { slug } = params;
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (e) {
    console.error("Error fetching portfolio post:", e);
  }

  if (!post) {
    notFound();
  }

  // Get related Portfolio items
  // Safe filtering with optional chaining
  const currentPostPortfolioSubCategories =
    post.allCategories?.nodes?.filter(
      (cat) => cat.parent?.node?.slug === 'portfolio'
    ) || [];

  let relatedPosts = [];
  if (currentPostPortfolioSubCategories.length > 0) {
    try {
      relatedPosts = await getRelatedContent({
        categoriesIn: currentPostPortfolioSubCategories.map(cat => cat.id),
        currentPostId: post.id,
        postType: 'portfolio',
      });
    } catch (e) {
      console.error("Error fetching related portfolio content:", e);
    }
  }

  // Determine Primary Subcategory
  const primarySubCategory =
    post.allCategories?.nodes.find(
      (cat) => cat.parent?.node?.slug === 'portfolio'
    ) || null;

  return (
    <main className="main-bg o-hidden">
      {/* Header Section */}
      <div
        className="header header-project d-flex align-items-end position-relative"
        data-overlay-dark="8"
      >
        {post.featuredImage?.node?.sourceUrl && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
            <Image
              src={post.featuredImage.node.sourceUrl.replace('https://blog.hendri.tech/wp-content', '/wp-content')}
              alt={post.title}
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="caption">
                <div className="mb-30">
                  <MagneticButton href="/portfolio" className="butn butn-sm radius-30">
                    <span className="icon ti-arrow-left mr-10"></span>
                    <span className="text">Back to Portfolio</span>
                  </MagneticButton>
                </div>
                <h1>{post.title}</h1>
                {primarySubCategory && (
                  <p className="mt-10 fz-16">
                    <Link href={`/ portfolio ? category = ${primarySubCategory.slug} `}>
                      {primarySubCategory.name}
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <section className="section-padding">
        <div className="container">
          {/* Info Items */}
          <div className="info mb-80 pb-20 bord-thin-bottom">
            <div className="row">
              <div className="col-md-6 col-lg-4">
                <div className="item mb-30">
                  <span className="opacity-8 mb-5">Category:</span>
                  <h6>
                    {post.allCategories?.nodes
                      .filter((cat) => cat.parent?.node?.slug === 'portfolio')
                      .map((cat) => cat.name)
                      .join(', ')}
                  </h6>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                {/* Placeholder for Client info if needed */}
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="item mb-30">
                  <span className="opacity-8 mb-5">Date:</span>
                  <h6>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section - Rendered Server Side to ensure visibility */}
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="wordpress-content">
                {post.content && (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects Section */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="related-posts section-padding bord-top-grd">
          <div className="container">
            <div className="sec-head mb-80">
              <h3 className="fw-600 fz-50 text-u d-rotate wow">
                <span className="rotate-text">
                  Related <span className="fw-200">Projects</span>
                </span>
              </h3>
            </div>
            <div className="row">
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard
                  key={relatedPost.slug}
                  post={relatedPost}
                  type="portfolio"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
