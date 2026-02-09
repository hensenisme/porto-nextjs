import React from 'react';
import Header from '@/components/blog-grid-sidebar/Header';
import Blogs from '@/components/blog-grid-sidebar/Blogs';
// UPDATED: Import new function names
import { getBlogPosts, getFilterCategories } from '@/lib/wordpress';

export const metadata = {
  title: 'Blog', // Updated title
  description: 'Artikel dan tutorial terbaru tentang Web Development, IoT, dan teknologi.',
};

const POSTS_PER_PAGE = 6;

// UPDATED: Accept searchParams to read URL query
export default async function PageBlogGridSidebar({ searchParams }) {
  // NEW: Get initial category from URL, e.g., /blog?category=react
  const initialCategory = searchParams.category || null;

  // UPDATED: Fetch initial posts *for that specific category*
  const initialPostsData = await getBlogPosts({
    first: POSTS_PER_PAGE,
    after: null,
    categorySlug: initialCategory, // Pass the category slug
  });

  // UPDATED: Get only blog sub-categories for filtering
  const { blogCategories } = await getFilterCategories();

  return (
    <>
      <main className="main-bg">
        <Header />
        <Blogs
          initialPostsData={initialPostsData || { nodes: [], pageInfo: {} }}
          categories={blogCategories || []}
          postsPerPage={POSTS_PER_PAGE}
          initialCategory={initialCategory} // Pass the initial category to the client component
        />
      </main>
    </>
  );
}

