'use client';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import loadBackgroudImages from '@/common/loadBackgroudImages';
import * as THREE from 'three';
import Image from 'next/image';
import Link from 'next/link';

function Header() {
  const mountRef = useRef(null);
  const headerRef = useRef(null);
  const hiIconRef = useRef(null);
  const nameRef = useRef(null);
  const [typedText, setTypedText] = useState('');

  const fullText = 'Software & IoT Engineer';

  useLayoutEffect(() => {
    let originalHTML = '';
    if (nameRef.current) {
      originalHTML = nameRef.current.innerHTML;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo('.header', { y: 200 }, { y: 0 }, '+=0.5');
      tl.fromTo(
        '.header .container',
        { opacity: 0, translateY: 40 },
        { opacity: 1, translateY: 0 },
        '-=0'
      );

      // Rotate Hi Icon
      gsap.to(hiIconRef.current, {
        rotation: -20,
        yoyo: true,
        repeat: -1,
        duration: 0.7,
        ease: 'power1.inOut',
        delay: 3,
      });

      // Split Text Animation
      if (typeof window.Splitting === 'function') {
        const results = window.Splitting({ target: '[data-splitting]', by: 'chars' });
        results.forEach((splitResult) => {
          gsap.from(splitResult.chars, {
            y: '100%',
            opacity: 0,
            stagger: 0.05,
            ease: 'power3.out',
            duration: 1,
            delay: 2.8,
          });
        });
      }
    });

    return () => {
      ctx.revert();
      // Restore original HTML to prevent corrupted text on re-mount
      if (nameRef.current && originalHTML) {
        nameRef.current.innerHTML = originalHTML;
      }
    };
  }, []);

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index > fullText.length) {
        clearInterval(intervalId);
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, [fullText]);

  useEffect(() => {
    loadBackgroudImages();
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // --- Optimization: Pause animation when off-screen ---
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    // ----------------------------------------------------

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 7000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 25;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );

    // Load local texture
    const sprite = new THREE.TextureLoader().load('/assets/textures/disc.png');

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      map: sprite,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      color: 0xaaaaaa,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onPointerMove = (event) => {
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      mouseX = clientX - windowHalfX;
      mouseY = clientY - windowHalfY;

      if (nameRef.current) {
        const rect = nameRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        nameRef.current.style.setProperty('--mouse-x', `${x}px`);
        nameRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    const clock = new THREE.Clock();
    let animationFrameId; // Track animation frame

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // OPTIMIZATION: Skip rendering if not visible
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();
      particlesMesh.rotation.y = -elapsedTime * 0.05;
      camera.position.x += ((mouseX / windowHalfX) * 5 - camera.position.x) * 0.05;
      camera.position.y += (-(mouseY / windowHalfY) * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect(); // Cleanup observer
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);

      // Cancel animation frame to prevent memory leak
      cancelAnimationFrame(animationFrameId);

      // Dispose Three.js resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      sprite.dispose();
      renderer.dispose();

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .interactive-glow {
          position: relative;
        }
        .interactive-glow::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle 200px at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(255, 255, 255, 0.2),
            transparent 80%
          );
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        .header:hover .interactive-glow::before {
          opacity: 1;
        }
        .header::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(253, 91, 56, 0.15) 0%, transparent 70%);
          z-index: 0;
          pointer-events: none;
        }
        .typing-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background-color: var(--main-color);
          animation: blink 0.7s infinite;
          vertical-align: middle;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
        
        /* Button Solid & Glow */
        .btn-solid-glow {
          background-color: #fd5b38 !important;
          color: #fff !important;
          border: 1px solid #fd5b38 !important;
          box-shadow: 0 0 15px rgba(253, 91, 56, 0.3);
          transition: all 0.3s ease;
        }
        .btn-solid-glow:hover {
          background-color: #e04a2f !important;
          border-color: #e04a2f !important;
          box-shadow: 0 0 25px rgba(253, 91, 56, 0.6);
          transform: translateY(-3px);
        }

        /* Status Pill */
        .status-pill {
          display: inline-flex;
          align-items: center;
          padding: 6px 15px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(5px);
          font-size: 13px;
          color: #eee;
          letter-spacing: 0.5px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .status-dot {
          width: 8px;
          height: 8px;
          background-color: #00fa9a; /* SpringGreen */
          border-radius: 50%;
          margin-right: 10px;
          box-shadow: 0 0 8px #00fa9a;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0% { box-shadow: 0 0 0 0 rgba(0, 250, 154, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(0, 250, 154, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 250, 154, 0); }
        }

        /* Floating Arrow */
        .floating-arrow {
          animation: float-arrow 2s ease-in-out infinite;
          opacity: 0.8;
        }
        @keyframes float-arrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
      <div
        ref={headerRef}
        className="header header-personal valign bg-img"
        data-background="/assets/imgs/header/p0.jpg"
        data-overlay-dark="2"
        style={{ position: 'relative', pointerEvents: 'none' }}
      >
        <div
          ref={mountRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            opacity: 0.7,
          }}
        ></div>
        <div
          className="container ontop"
          style={{ position: 'relative', zIndex: 2, pointerEvents: 'auto' }}
        >
          <div className="row">
            <div className="col-lg-7">
              <div className="caption">

                {/* Status Pill */}
                <div className="mb-30">
                  <div className="status-pill">
                    <span className="status-dot"></span>
                    Available for New Projects
                  </div>
                </div>

                <h6 className="mb-15">
                  <span className="icon-img-30 mr-10" ref={hiIconRef}>
                    <Image
                      src="/assets/imgs/header/hi.png"
                      alt="Hi Icon"
                      width={30}
                      height={30}
                      priority
                      style={{ pointerEvents: 'none' }}
                    />
                  </span>{' '}
                  Hello! I&apos;m
                </h6>
                <h2
                  className="fw-700 mb-10 interactive-glow"
                  data-splitting
                  ref={nameRef}
                >
                  Hendri Gunawan
                  <span className="main-color"> (a.k.a Hensen)</span>
                </h2>
                <h3>
                  I am a {typedText}
                  {typedText.length < fullText.length && (
                    <span className="typing-cursor"></span>
                  )}
                </h3>
                <div className="row">
                  <div className="col-lg-9">
                    <div className="text mt-30">
                      <p>
                        Mahasiswa Teknik Komputer dengan passion di bidang IoT,
                        Software Engineering, dan Cloud
                      </p>
                    </div>
                    {/* Button with Arrow on Top */}
                    <div className="mt-60 d-flex flex-column align-items-center" style={{ width: 'fit-content' }}>
                      <div className="floating-arrow mb-15">
                        {/* Using a font icon for the thin aesthetic */}
                        <span className="icon-img-20">
                          <i className="ti-arrow-down fz-20" style={{ color: '#fff' }}></i>
                        </span>
                      </div>
                      <Link
                        href="/contact"
                        className="butn butn-md btn-solid-glow radius-30"
                      >
                        <span className="text">Contact Me</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="info d-flex align-items-center justify-content-end mt-100">
            <div className="item">
              <h6 className="sub-title mb-10">Email :</h6>
              <span className="p-color fw-600">
                <a href="mailto:hensenisme@gmail.com">hensenisme@gmail.com</a>
              </span>
            </div>
            <div className="item">
              <h6 className="sub-title mb-10">Phone :</h6>
              <span className="p-color fw-600">
                <a
                  href="https://wa.me/6282171106310"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +628 217 110 6310
                </a>
              </span>
            </div>
            <div className="item">
              <h6 className="sub-title mb-10">Address :</h6>
              <span className="p-color fw-600">
                <a
                  href="https://maps.google.com/?q=Bojongsoang, Bandung, Indonesia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bojongsoang, Bandung, Indonesia
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Header;
