'use client';

import React, { useState, useEffect, useCallback, useTransition, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '@/components/common/PostCard'; // Pastikan ini diimpor
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
// 1. Impor 'useInView' untuk infinite scroll
import { useInView } from 'react-intersection-observer';

// Komponen spinner kecil (dari perbaikan error sebelumnya)
function SmallSpinner() {
  return (
    <>
      <style jsx>{`
        .loading-indicator-small {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          width: 100%;
        }
        .loading-indicator-small .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: var(--main-color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div className="loading-indicator-small">
        <div className="spinner"></div>
      </div>
    </>
  );
}

function Portfolio({ initialPostsData, categories, postsPerPage }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ambil initialCategory dari URL, bukan dari prop
  const initialCategory = searchParams.get('category') || '*';

  const [posts, setPosts] = useState(initialPostsData?.nodes || []);
  const [pageInfo, setPageInfo] = useState(
    initialPostsData?.pageInfo || { hasNextPage: false, endCursor: null }
  );
  
  // State loading terpisah untuk filter dan load-more
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [activeFilter, setActiveFilter] = useState(initialCategory);
  const [isPending, startTransition] = useTransition();

  // 2. Setup 'useInView'
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // Gunakan 'useRef' untuk menyimpan 'initialPostsData' agar tidak memicu 'useEffect'
  const initialDataRef = useRef(initialPostsData);

  const fetchPosts = useCallback(
    async (filter = '*', afterCursor = null, isFilterChange = false) => {
      // Set state loading yang sesuai
      if (isFilterChange) {
        setIsLoadingFilter(true);
      } else {
        setIsLoadingMore(true);
      }

      let apiUrl = `/api/posts?type=portfolio&first=${postsPerPage}`;
      if (afterCursor) apiUrl += `&after=${afterCursor}`;
      if (filter !== '*') apiUrl += `&category=${encodeURIComponent(filter)}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (afterCursor) {
          // Append untuk 'Load More'
          setPosts((prevPosts) => [...prevPosts, ...(data.nodes || [])]);
        } else {
          // Replace untuk 'Filter Change'
          setPosts(data.nodes || []);
        }
        setPageInfo(data.pageInfo || { hasNextPage: false, endCursor: null });
      } catch (error) {
        console.error("Failed to fetch portfolio posts:", error);
        if (isFilterChange) setPosts([]);
        setPageInfo({ hasNextPage: false, endCursor: null });
      } finally {
        // Matikan state loading
        setIsLoadingFilter(false);
        setIsLoadingMore(false);
      }
    },
    [postsPerPage]
  );

  // Effect untuk menangani klik filter
  useEffect(() => {
    // Hanya jalankan jika filter berubah
    if (activeFilter === initialCategory) return;
    
    // Jangan fetch jika sudah ada request filter lain yang berjalan
    if (isLoadingFilter) return;

    fetchPosts(activeFilter, null, true); // true = ini adalah perubahan filter

    // Update URL tanpa 'key' (menggunakan startTransition)
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (activeFilter === '*') {
        params.delete('category');
      } else {
        params.set('category', activeFilter);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]); // Hanya bergantung pada 'activeFilter'

  // 3. Effect baru untuk 'infinite scroll'
  useEffect(() => {
    // Cek jika:
    // 1. Trigger 'inView' terlihat
    // 2. Ada halaman berikutnya
    // 3. Tidak sedang loading (baik filter maupun load more)
    if (inView && pageInfo.hasNextPage && !isLoadingFilter && !isLoadingMore) {
      fetchPosts(activeFilter, pageInfo.endCursor, false); // false = ini bukan perubahan filter
    }
  }, [inView, pageInfo, isLoadingFilter, isLoadingMore, activeFilter, fetchPosts]);

  const handleFilterClick = (filterSlug) => {
    if (filterSlug !== activeFilter && !isLoadingFilter) {
      setActiveFilter(filterSlug);
    }
  };

  const showNoPostsMessage = !isLoadingFilter && Array.isArray(posts) && posts.length === 0;

  return (
    <section className="work-grid section-padding pb-0">
      {/*
        --- PERBAIKAN STYLING FILTER DIMULAI DI SINI ---
      */}
      <style jsx>{`
        /* ... spinner styles ... */
        .loading-indicator-small {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          width: 100%;
        }
        .loading-indicator-small .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: var(--main-color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .filter span.disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        /* --- PERBAIKAN FILTER LAYOUT BARU --- */
        .filtering .filter {
          display: flex; /* 1. Terapkan Flexbox */
          flex-wrap: wrap; /* 2. Izinkan wrapping ke baris baru */
          justify-content: flex-end; /* 3. Rata kanan di desktop */
          gap: 10px 20px; /* 4. Spasi (vertikal 10px, horizontal 20px) */
        }

        .filtering .filter span {
          margin: 0 !important; /* Hapus margin default dari template */
          padding: 5px 0; /* Beri sedikit padding vertikal */
        }

        @media (max-width: 991px) {
          .filtering {
            justify-content: center !important; /* Ratakan container di mobile */
          }
          .filtering .filter {
            justify-content: center; /* 5. Ratakan item di tengah di mobile */
          }
        }
        /* --- AKHIR PERBAIKAN FILTER LAYOUT --- */

        /* Styling PostCard (dari PostCard.jsx) */
        .work-grid .item .img {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          aspect-ratio: 4 / 3;
          background-color: #2a2a2a;
        }
        .work-grid .item .img img {
          transition: transform 0.4s ease;
        }
        .work-grid .item:hover .img img {
          transform: scale(1.05);
        }
      `}</style>

      {/*
        --- AKHIR PERBAIKAN STYLING FILTER ---
      */}

      <div className="container">
        {/* Filter Section */}
        <div className="row mb-80">
          <div className="col-lg-4">
            <div className="sec-head">
              <h6 className="sub-title main-color mb-10">DISCOVER OUR CASES</h6>
              <h3>Latest Projects</h3>
            </div>
          </div>
          <div className="filtering col-lg-8 d-flex justify-content-end align-items-end">
            <div>
              <div className="filter">
                <span
                  onClick={() => handleFilterClick('*')}
                  className={`${activeFilter === '*' ? 'active' : ''} ${
                    isLoadingFilter ? 'disabled' : ''
                  }`}
                >
                  All
                </span>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <span
                      key={cat.slug}
                      onClick={() => handleFilterClick(cat.slug)}
                      className={`${
                        activeFilter === cat.slug ? 'active' : ''
                      } ${isLoadingFilter ? 'disabled' : ''}`}
                    >
                      {cat.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Indikator loading HANYA untuk perubahan filter */}
        {isLoadingFilter && <SmallSpinner />}

        {/* Container Utama dengan animasi layout TWEEN */}
        <motion.div
          layout // Animate layout changes on the row
          transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
          className="row md-marg"
        >
          {/* AnimatePresence untuk item masuk/keluar */}
          <AnimatePresence initial={false}>
            {Array.isArray(posts) &&
              posts.length > 0 &&
              posts.map((post) => (
                // Menggunakan PostCard yang sudah standar
                <PostCard
                  key={post.slug}
                  post={post}
                  type="portfolio"
                  // Gunakan col-lg-4 untuk 3 kolom
                  columnClass="col-lg-4 col-md-6" 
                />
              ))}
          </AnimatePresence>
        </motion.div>

        {showNoPostsMessage && (
          <div className="col-12 text-center my-5">
            <p>No projects found in this category.</p>
          </div>
        )}

        {/* 4. Trigger 'useInView' dan Indikator 'Load More' */}
        <div ref={ref} className="mt-30 mb-80">
          {pageInfo.hasNextPage && <SmallSpinner />}
        </div>
      </div>
    </section>
  );
}

export default Portfolio;

