'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

function RelatedPostCard({ post, type = 'blog' }) {
  const href = `/${type}/${post.slug}`;
  
  // Ambil sub-kategori pertama (jika ada)
  const displayCategory = post.allCategories?.nodes.find(cat => cat.parent !== null);

  let term = displayCategory ? displayCategory.name : (post.tags?.nodes[0]?.name || '');

  return (
    <>
      <style jsx global>{`
        .related-post-card-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3.5;
          overflow: hidden;
          border-radius: 10px;
          background-color: #2a2a2a;
        }
        .related-post-card-image-wrapper img {
          object-fit: cover;
          transition: transform 0.4s ease-in-out;
        }
        .related-post-card:hover .related-post-card-image-wrapper img {
          transform: scale(1.08);
        }
      `}</style>
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="col-lg-4 col-md-6"
      >
        <div className="item mb-50 related-post-card">
          <div className="related-post-card-image-wrapper mb-30">
            <Link href={href}>
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: 'cover',
                    pointerEvents: 'none', // <-- PERUBAHAN DI SINI
                  }}
                />
              ) : (
                <div
                  style={{ width: '100%', height: '100%', background: '#333' }}
                />
              )}
            </Link>
          </div>
          <div className="cont">
            <div className="info sub-title p-color d-flex align-items-center mb-15">
              <div className="op-7">
                <span>{term}</span>
              </div>
              <div className="ml-auto op-7">
                <span>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <h5 className="fz-20">
              <Link href={href}>{post.title}</Link>
            </h5>
          </div>
        </div>
      </motion.div>
    </>
  );
}
export default RelatedPostCard;
