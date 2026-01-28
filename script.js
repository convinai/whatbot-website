/**
 * WhatBot Landing Page Interactions
 * Lightweight vanilla JavaScript for smooth user experience
 */

(function() {
  'use strict';

  // ============================================
  // 1. Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Close mobile menu if open
        const nav = document.querySelector('.nav');
        if (nav && nav.classList.contains('nav-open')) {
          nav.classList.remove('nav-open');
        }
      }
    });
  });

  // ============================================
  // 2. Navigation Background Change on Scroll
  // ============================================
  const nav = document.querySelector('.nav, nav, header');

  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
  }

  // ============================================
  // 3. Intersection Observer for Fade-in Animations
  // ============================================
  const fadeElements = document.querySelectorAll('.fade-in, .animate-on-scroll, [data-animate]');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target); // Stop observing once visible
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback: show all elements immediately
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // ============================================
  // 4. Mobile Menu Toggle
  // ============================================
  const menuToggle = document.querySelector('.menu-toggle, .hamburger, [data-menu-toggle]');
  const mobileNav = document.querySelector('.nav, .mobile-nav, [data-mobile-nav]');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileNav.classList.toggle('nav-open');
      document.body.classList.toggle('menu-open');
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('nav-open') &&
          !mobileNav.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('nav-open');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // ============================================
  // 5. Feature Cards Hover Animation
  // ============================================
  const featureCards = document.querySelectorAll('.feature-card, .card, [data-hover-animate]');

  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
      this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      this.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });

  // ============================================
  // 6. Counter Animation for Stats
  // ============================================
  const counters = document.querySelectorAll('.counter, .stat-number, [data-counter]');

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target') || el.textContent, 10);
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          el.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target.toLocaleString();
        }
      };

      updateCounter();
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      // Store original value as data attribute if not set
      if (!counter.getAttribute('data-target')) {
        counter.setAttribute('data-target', counter.textContent);
      }
      counter.textContent = '0';
      counterObserver.observe(counter);
    });
  }

  // ============================================
  // Utility: Debounce function for performance
  // ============================================
  window.debounce = function(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

})();
