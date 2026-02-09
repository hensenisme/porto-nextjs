'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 1. Tambahkan prop baru 'columnClass' dengan nilai default
function PostCard({ post, type = 'blog', columnClass = 'col-md-6' }) {
  if (!post) {
    return null;
  }
  const href = `/${type}/${post.slug}`;
  const subCategories =
    post.allCategories?.nodes.filter(
      (cat) => cat.parent?.node?.slug === type
    ) || [];
  const tags = post.tags?.nodes || [];

  return (
    <>
      <style jsx global>{`
        /* ... (style Anda yang lain tetap sama) ... */
        .post-card-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          border-radius: 10px;
          background-color: #2a2a2a;
        }
        .post-card-image-wrapper img {
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .item:hover .post-card-image-wrapper img {
          transform: scale(1.05);
        }
        .post-card-info .tag-list span {
          display: inline-block;
          margin-right: 8px;
          margin-bottom: 5px;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          line-height: 1.4;
        }
        .post-card-info .category-tag {
          background-color: var(--main-color);
          color: #fff;
        }
        .post-card-info .tag-tag {
          background-color: #333;
          color: #ccc;
        }
      `}</style>
      {/* 2. Gunakan 'columnClass' di sini */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className={columnClass} // Gunakan prop untuk kelas kolom
      >
        <div className="item mb-50">
          <div className="post-card-image-wrapper">
            <Link href={href}>
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mMm+w8AAW8BH0916QoAAAAASUVORK5CYII="
                  style={{
                    objectFit: 'cover',
                    pointerEvents: 'none',
                  }}
                />
              ) : (
                <div
                  style={{ width: '100%', height: '100%', background: '#333' }}
                />
              )}
            </Link>
          </div>
          <div className="cont pt-40">
            <div className="info post-card-info sub-title p-color mb-15">
              <div className="tag-list">
                {subCategories.map((cat) => (
                  <span key={`cat-${cat.slug}`} className="category-tag">
                    {cat.name}
                  </span>
                ))}
                {tags.map((tag) => (
                  <span key={`tag-${tag.slug}`} className="tag-tag">
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="mt-10">
                <span>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <h4 className="fz-30">
              <Link href={href}>{post.title}</Link>
            </h4>
            <Link
              href={href}
              className="butn-crev d-flex align-items-center mt-40"
            >
              <span className="hover-this">
                <span className="circle hover-anim">
                  <i className="ti-arrow-top-right"></i>
                </span>
              </span>
              <span className="text">View Details</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
export default PostCard;
