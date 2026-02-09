'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from '@/components/common/PostCard';
import SearchWidget from '@/components/common/SearchWidget';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function Blogs({ initialPostsData, categories, postsPerPage, initialCategory }) {
  const [posts, setPosts] = useState(initialPostsData.nodes || []);
  const [pageInfo, setPageInfo] = useState(initialPostsData.pageInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(initialCategory || '*');
  const isInitialMount = useRef(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fetchPosts = async (filter, afterCursor = null) => {
    setIsLoading(true);
    const isLoadMore = !!afterCursor;
    const params = new URLSearchParams({
      type: 'blog',
      first: String(postsPerPage),
    });
    if (filter && filter !== '*') {
      params.set('category', filter);
    }
    if (isLoadMore && afterCursor) {
      params.set('after', afterCursor);
    }

    try {
      const res = await fetch(`/api/posts?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const newData = await res.json();
      if (isLoadMore) {
        setPosts((prevPosts) => [...prevPosts, ...(newData.nodes || [])]);
      } else {
        setPosts(newData.nodes || []);
      }
      setPageInfo(newData.pageInfo);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchPosts(activeFilter, null);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (activeFilter === '*') {
      current.delete('category');
    } else {
      current.set('category', activeFilter);
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const handleFilterClick = (filter) => {
    if (isLoading) return;
    setActiveFilter(filter);
  };

  const loadMorePosts = () => {
    if (!pageInfo.hasNextPage || isLoading) return;
    fetchPosts(activeFilter, pageInfo.endCursor);
  };

  const latestPosts = initialPostsData.nodes.slice(0, 3);

  return (
    <section className="blog-main section-padding">
      <div className="container">
        <div className="row lg-marg justify-content-around">
          {/* Blog Posts Column */}
          <div className="col-lg-8">
            {/* Filtering Menu */}
            <div className="filtering d-flex justify-content-center mb-80">
              <div className="filter">
                <span
                  onClick={() => handleFilterClick('*')}
                  className={activeFilter === '*' ? 'active' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  All Posts
                </span>
                {categories.map((cat) => (
                  <span
                    key={cat.slug}
                    onClick={() => handleFilterClick(cat.slug)}
                    className={activeFilter === cat.slug ? 'active' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Posts Grid (Menggunakan PostCard, jadi aman) */}
            <motion.div layout className="row">
              <AnimatePresence>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.slug} post={post} type="blog" />
                  ))
                ) : (
                  !isLoading && (
                    <div className="col-12 text-center">
                      <p>No posts found in this category.</p>
                    </div>
                  )
                )}
              </AnimatePresence>
            </motion.div>

            {/* Loading Indicator */}
            {isLoading && posts.length > 0 && (
              <div className="text-center mt-30">
                <p>Loading...</p>
              </div>
            )}

            {/* Load More Button */}
            {pageInfo?.hasNextPage && !isLoading && (
              <div className="text-center mt-30">
                <button
                  onClick={loadMorePosts}
                  disabled={isLoading}
                  className="butn butn-md butn-bord radius-30"
                >
                  <span className="text">
                    {isLoading ? 'Loading...' : 'Load More'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="col-lg-4">
            <div className="sidebar">
              <SearchWidget />
              {/* Categories Widget */}
              <div className="widget catogry">
                <h6 className="title-widget">Categories</h6>
                <ul className="rest">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <span
                        onClick={() => handleFilterClick(cat.slug)}
                        style={{ cursor: 'pointer' }}
                        className={
                          activeFilter === cat.slug ? 'main-color' : ''
                        }
                      >
                        {cat.name}
                      </span>
                      <span className="ml-auto">{cat.count}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Latest Posts Widget (shows latest from initial load) */}
              <div className="widget last-post-thum">
                <h6 className="title-widget">Latest Posts</h6>
                {latestPosts.map((post) => (
                  <div
                    key={post.slug}
                    className="item d-flex align-items-center"
                  >
                    <div>
                      <div className="img">
                        <Link href={`/blog/${post.slug}`}>
                          {post.featuredImage ? (
                            <Image
                              src={post.featuredImage.node.sourceUrl}
                              alt={post.featuredImage.node.altText || post.title}
                              width={80}
                              height={80}
                              style={{
                                objectFit: 'cover',
                                borderRadius: '5px',
                                pointerEvents: 'none', // <-- PERUBAHAN DI SINI
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 80,
                                height: 80,
                                background: '#333',
                                borderRadius: '5px',
                              }}
                            />
                          )}
                        </Link>
                      </div>
                    </div>
                    <div className="cont">
                      <h6>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h6>
                      <span className="fz-12 opacity-7 mt-5 d-block">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
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
  );
}
export default Blogs;
