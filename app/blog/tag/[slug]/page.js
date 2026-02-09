import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  getPostBySlug,
  getBlogSlugs,
  getFilterCategories,
  getRelatedContent,
  getBlogPosts,
} from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import RelatedPostCard from '@/components/common/RelatedPostCard';
import SearchWidget from '@/components/common/SearchWidget';

export const revalidate = 60;

export async function generateStaticParams() {
  const allPosts = await getBlogSlugs();
  if (!allPosts) {
    console.error('Failed to fetch blog slugs for generateStaticParams.');
    return [];
  }
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  const plainExcerpt =
    post.excerpt?.replace(/<[^>]*>?/gm, '') || 'Read this blog post.';
  return {
    title: `${post.title} | Blog`,
    description: plainExcerpt.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound(); // Trigger 404 jika post not found
  }

  // Ambil data untuk sidebar dan related posts
  const { blogCategories } = await getFilterCategories();
  const latestPostsData = await getBlogPosts({ first: 3 });
  const latestPosts = latestPostsData?.nodes || [];

  const currentPostBlogSubCategories =
    post.allCategories?.nodes.filter(
      (cat) => cat.parent?.node?.slug === 'blog'
    ) || [];

  const relatedPosts = await getRelatedContent({
    categoriesIn: currentPostBlogSubCategories.map(cat => cat.id), // Kirim ID
    currentPostId: post.id,
    postType: 'blog',
  });

  const primarySubCategory = post.allCategories?.nodes.find(
    (cat) => cat.parent?.node?.slug === 'blog'
  );

  return (
    <main className="main-bg">
      {/* Header Detail Blog */}
      <div className="header blog-header section-padding pb-0">
        <div className="container mt-80">
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="caption">
                <div className="sub-title fz-12">
                  {primarySubCategory ? (
                    <span key={primarySubCategory.slug}>
                      <Link
                        href={`/blog?category=${primarySubCategory.slug}`}
                      >
                        {primarySubCategory.name}
                      </Link>
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
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Featured image */}
        {post.featuredImage && (
          <div
            className="featured-img-container mt-50 container"
            style={{ maxWidth: '900px' }}
          >
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              width={post.featuredImage.node.mediaDetails.width}
              height={post.featuredImage.node.mediaDetails.height}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                pointerEvents: 'none', // <-- PERUBAHAN DI SINI
              }}
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
                <div
                  className="wordpress-content item pb-60"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                >
                  {/* Konten WordPress akan di-render di sini */}
                </div>
              </div>
            </div>

            {/* Sidebar Lengkap */}
            <div className="col-lg-4">
              <div className="sidebar">
                {/* Widget Pencarian */}
                <SearchWidget />

                {/* Widget Kategori Blog */}
                <div className="widget catogry">
                  <h6 className="title-widget">Categories</h6>
                  <ul className="rest">
                    {blogCategories.map((cat) => (
                      <li key={cat.slug}>
                        <span>
                          <Link href={`/blog?category=${cat.slug}`}>
                            {cat.name}
                          </Link>
                        </span>
                        <span className="ml-auto">{cat.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Widget Postingan Blog Terbaru */}
                <div className="widget last-post-thum">
                  <h6 className="title-widget">Latest Posts</h6>
                  {latestPosts.map((latestPost) => (
                    <div
                      key={latestPost.slug}
                      className="item d-flex align-items-center"
                    >
                      <div>
                        <div className="img">
                          <Link href={`/blog/${latestPost.slug}`}>
                            {latestPost.featuredImage ? (
                              <Image
                                src={latestPost.featuredImage.node.sourceUrl}
                                alt={
                                  latestPost.featuredImage.node.altText || ''
                                }
                                width={80}
                                height={80}
                                style={{
                                  objectFit: 'cover',
                                  pointerEvents: 'none', // <-- PERUBAHAN DI SINI
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 80,
                                  height: 80,
                                  background: '#333',
                                }}
                              />
                            )}
                          </Link>
                        </div>
                      </div>
                      <div className="cont">
                        <h6>
                          <Link href={`/blog/${latestPost.slug}`}>
                            {latestPost.title}
                          </Link>
                        </h6>
                        <span className="fz-12 opacity-7 mt-5 d-block">
                          {new Date(latestPost.date).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
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

      {/* Seksi Postingan Terkait (Menggunakan RelatedPostCard, jadi aman) */}
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
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard
                  key={relatedPost.slug}
                  post={relatedPost}
                  type="blog"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
