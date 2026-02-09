import React from 'react'; // Hapus { Suspense }
import Header from '@/components/p-grid/Header';
import Portfolio from '@/components/p-grid/Portfolio'; // Path ini sudah benar
import Marq2 from '@/components/common/Marq2';
import { getPortfolioPosts, getFilterCategories } from '@/lib/wordpress';

// 'export const dynamic = 'force-dynamic';' sudah dihapus (Bagus!)

const POSTS_PER_PAGE = 6;

// DIHAPUS: Komponen PortfolioLoading (tidak diperlukan lagi)

export const metadata = {
  title: "Portfolio",
};

export default async function PagePortfolioGrid({ searchParams }) {
  const initialCategorySlug = searchParams?.category || null;

  // Ambil data awal di server (ini tetap benar)
  const initialPostsData = await getPortfolioPosts({
    first: POSTS_PER_PAGE,
    after: null,
    categorySlug: initialCategorySlug,
  });
  const { portfolioCategories } = await getFilterCategories();

  console.log('[DEBUG/portfolio Page] Categories received:', portfolioCategories);
  console.log(
    `[DEBUG/portfolio Page] Initial posts fetched for: ${initialCategorySlug || 'All'
    }`
  );

  return (
    <>
      <main className="main-bg o-hidden">
        <Header />

        {/* PERBAIKAN: Hapus <Suspense> dan 'key' */}
        {/* Komponen <Portfolio> sekarang akan tetap ada (persist) 
            dan menangani animasi internalnya sendiri. */}
        <Portfolio
          initialPostsData={initialPostsData || { nodes: [], pageInfo: {} }}
          categories={portfolioCategories || []}
          postsPerPage={POSTS_PER_PAGE}
        />

        <Marq2 />
      </main>
    </>
  );
}
