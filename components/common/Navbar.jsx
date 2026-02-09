'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function Navbar() {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    // 1. Optimized Scroll Handler for Navbar Style (Throttled via RAF)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const navbar = document.querySelector('.navbar');
          if (navbar) {
            if (window.scrollY > 300) {
              navbar.classList.add('nav-scroll');
            } else {
              navbar.classList.remove('nav-scroll');
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // 2. Dynamic Active State Logic (ScrollSpy vs Route)
    const sections = document.querySelectorAll('main [id]');
    let observer;

    if (pathname === '/') {
      // Home Page: Use IntersectionObserver for ScrollSpy
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2, // Lowered to 0.2 to handle tall/long sections (like Portfolio)
      };

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      }, observerOptions);

      sections.forEach((section) => observer.observe(section));
    } else {
      // Internal Pages: Set Active based on Pathname
      // e.g., "/services" -> "services", "/contact" -> "contact"
      const pathKey = pathname.split('/')[1];
      setActiveLink(pathKey || 'home');
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer) {
        sections.forEach((section) => observer.unobserve(section));
        observer.disconnect();
      }
    };
  }, [pathname]); // Critical: Re-run on route change

  function handleToggleNav() {
    const collapse = document.querySelector('.navbar .navbar-collapse');
    collapse.classList.toggle('show');
  }

  const getNavLink = (id) => {
    return pathname === '/' ? `#${id}` : `/#${id}`;
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bord blur">
        <div className="container o-hidden">
          <Link className="logo icon-img-100" href="/">
            <Image
              src="/assets/imgs/logo-light.png"
              alt="logo"
              width={100}
              height={33}
              style={{ width: '100px', height: 'auto' }}
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={handleToggleNav}
          >
            <span className="icon-bar">
              <i className="fas fa-bars"></i>
            </span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeLink === 'home' ? 'active' : ''
                    }`}
                  href={getNavLink('home')}
                >
                  <span className="rolling-text">Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeLink === 'about' ? 'active' : ''
                    }`}
                  href={getNavLink('about')}
                >
                  <span className="rolling-text">About Me</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeLink === 'services' ? 'active' : ''
                    }`}
                  href={getNavLink('services')}
                >
                  <span className="rolling-text">Services</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeLink === 'portfolio' ? 'active' : ''
                    }`}
                  href={getNavLink('portfolio')}
                >
                  <span className="rolling-text">Portfolio</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${activeLink === 'blog' ? 'active' : ''
                    }`}
                  href={getNavLink('blog')}
                >
                  <span className="rolling-text">Blog</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="contact-button">
            <Link
              href="/contact"
              className="butn butn-sm butn-bg main-colorbg radius-5"
            >
              <span className="text">Contact</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
