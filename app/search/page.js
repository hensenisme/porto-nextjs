import React from 'react';
import { getSearchResults } from '@/lib/wordpress';
import PostCard from '@/components/common/PostCard';

// Opt-out dari caching statis untuk halaman ini, karena hasilnya selalu dinamis
export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }) {
  const query = searchParams.query || '';
  return {
    title: `Search Results for "${query}"`,
    robots: {
      index: false, // Mencegah mesin pencari mengindeks halaman hasil pencarian
    },
  };
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams.query || '';
  let results = [];

  if (query) {
    results = await getSearchResults(query);
  }

  // --- PERBAIKAN DI SINI ---
  // Membagi array 'results' menjadi dua array terpisah (blog dan portfolio)
  const { blogPosts, portfolioPosts } = results.reduce(
    (acc, post) => {
      // Menggunakan 'post.allCategories' (nama field dari GraphQL Fragment)
      // dan optional chaining (?.) untuk mencegah error jika 'allCategories' atau 'nodes' null.
      const isPortfolio = post.allCategories?.nodes?.some(
        (cat) => cat.slug === 'portfolio' || cat.parent?.node?.slug === 'portfolio'
      );

      if (isPortfolio) {
        acc.portfolioPosts.push(post);
      } else {
        acc.blogPosts.push(post);
      }
      return acc;
    },
    { blogPosts: [], portfolioPosts: [] } // Inisialisasi accumulator
  );
  // --- AKHIR PERBAIKAN ---

  return (
    <main className="main-bg">
      {/* Header Halaman */}
      <div className="header blog-header section-padding pb-0">
        <div className="container mt-80">
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="caption">
                <div className="sub-title fz-12">Search Results</div>
                {query ? (
                  <h1 className="fz-45 mt-30">
                    Showing results for: <span className="fw-200">{query}</span>
                  </h1>
                ) : (
                  <h1 className="fz-45 mt-30">Please enter a search term.</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Konten Hasil Pencarian */}
      <section className="blog-main section-padding">
        <div className="container">
          {/* --- Hasil Blog --- */}
          {blogPosts.length > 0 && (
            <div className="mb-80">
              <h3 className="fz-40 mb-40 pb-20 bord-thin-bottom">
                Blog Posts
              </h3>
              <div className="row">
                {blogPosts.map((post) => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    type="blog"
                  />
                ))}
              </div>
            </div>
          )}

          {/* --- Hasil Portfolio --- */}
          {portfolioPosts.length > 0 && (
            <div>
              <h3 className="fz-40 mb-40 pb-20 bord-thin-bottom">
                Portfolio Projects
              </h3>
              <div className="row">
                {portfolioPosts.map((post) => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    type="portfolio"
                  />
                ))}
              </div>
            </div>
          )}

          {/* --- Pesan Jika Tidak Ada Hasil --- */}
          {blogPosts.length === 0 && portfolioPosts.length === 0 && query && (
            <p>No results found for your search.</p>
          )}
        </div>
      </section>
    </main>
  );
}

