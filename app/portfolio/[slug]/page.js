import React from 'react';
import { getPostBySlug, getPortfolioSlugs, getRelatedContent } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import RelatedPostCard from '@/components/common/RelatedPostCard';
// 1. Impor komponen UI baru yang akan kita buat
import PortfolioDetailContent from './PortfolioDetailContent';

// Revalidate data (tidak berubah)
export const revalidate = 60;

// Generate static paths (tidak berubah)
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

  return (
    <PortfolioDetailContent
      post={post}
      relatedPosts={relatedPosts || []}
    />
  );
}
