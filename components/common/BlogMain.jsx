'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

function Blog({ posts = [] }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const itemsRef = useRef([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    gsap.registerPlugin(ScrollTrigger);

    // Refresh ScrollTrigger to ensure correct positioning after DOM readiness
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      // Title Animation
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Items Animation
      itemsRef.current.forEach((item, index) => {
        if (!item) return;
        const image = item.querySelector('.img');
        const content = item.querySelector('.cont');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });

        tl.from(image, {
          clipPath: 'inset(100% 0 0 0)',
          duration: 1.2,
          ease: 'power4.out',
          delay: index * 0.2,
        }).from(content, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.3,
        }, '-=1');
      });
    }, sectionRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [isMounted, posts]);

  if (!isMounted) return null; // Hydration guard


  return (
    <>
      <style jsx global>{`
        /* ... (style Anda yang lain tetap sama) ... */
        .blog.style2 .item .img {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          clip-path: inset(0 0 0 0);
        }
        .blog.style2 .item .img img {
          transition: transform 0.8s cubic-bezier(0.2, 1, 0.2, 1);
        }
        /* ... (style Anda yang lain tetap sama) ... */
      `}</style>
      <section className="blog style2" ref={sectionRef}>
        <div className="container">
          <div className="sec-head mb-80" ref={titleRef}>
            <div className="d-flex align-items-center">
              <div>
                <span className="sub-title main-color mb-5">Our Blogs</span>
                <h3 className="fw-600 fz-50 text-u d-rotate wow">
                  <span className="rotate-text">
                    Latest <span className="fw-200">News.</span>
                  </span>
                </h3>
              </div>
              <div className="ml-auto vi-more">
                <Link
                  href="/blog"
                  className="butn butn-sm butn-bord radius-30"
                >
                  <span>View All</span>
                </Link>
                <span className="icon ti-arrow-top-right"></span>
              </div>
            </div>
          </div>
          <div className="row">
            {posts.map((post, index) => {
              const subCategories =
                post.allCategories?.nodes
                  .filter((cat) => cat.parent !== null)
                  .map((cat) => cat.name)
                  .join(', ') || '';
              return (
                <div className="col-lg-4" key={post.slug}>
                  <div
                    className="item md-mb50"
                    ref={(el) => (itemsRef.current[index] = el)}
                  >
                    <div className="img fit-img">
                      <Link href={`/blog/${post.slug}`}>
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.title}
                            width={
                              post.featuredImage.node.mediaDetails.width || 400
                            }
                            height={
                              post.featuredImage.node.mediaDetails.height || 500
                            }
                            style={{
                              width: '100%',
                              height: 'auto',
                              aspectRatio: '4 / 5',
                              objectFit: 'cover',
                              pointerEvents: 'none', // <-- PERUBAHAN DI SINI
                            }}
                            priority={index < 3}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              aspectRatio: '4 / 5',
                              backgroundColor: '#2a2a2a',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#555',
                            }}
                          >
                            No Image
                          </div>
                        )}
                      </Link>
                    </div>
                    <div className="cont pt-30">
                      <div className="info sub-title p-color d-flex align-items-center mb-20">
                        <div>
                          <span className="op-7">{subCategories}</span>
                        </div>
                        <div className="ml-30">
                          <span className="op-7">
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <h5>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h5>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="butn-crev d-flex align-items-center"
                      >
                        <span className="hover-this">
                          <span className="circle hover-anim">
                            <i className="ti-arrow-top-right"></i>
                          </span>
                        </span>
                        <span className="text">Read more</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
export default Blog;
