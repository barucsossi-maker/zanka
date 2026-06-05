/* =============================================================
 * ANIMATIONS.JS — GSAP enhancement ZANKA
 * =============================================================
 * Header scroll et burger sont déjà gérés en inline dans index.html.
 * Ce fichier ne fait que les animations GSAP (parallax, apparitions).
 * Si GSAP ne charge pas, le site reste 100% fonctionnel.
 * ============================================================= */

document.addEventListener('DOMContentLoaded', function() {

  /* ─── 1. REVEAL AU SCROLL (INTERSECTION OBSERVER) ─────────
   * Fonctionne sans GSAP. Ajoute la classe .visible.
   * ============================================================= */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(function(el) {
      revealObserver.observe(el);
    });
  }

  /* ─── 2. GSAP — ENHANCEMENT UNIQUEMENT ────────────────────
   * Si GSAP est chargé, on ajoute des animations.
   * Sinon, le site fonctionne parfaitement sans.
   * ============================================================= */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  try {
    // Hero parallax
    var heroImage = document.querySelector('.hero-image');
    if (heroImage) {
      gsap.to(heroImage, {
        y: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

    // Timeline hero : apparition des textes
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-sous-titre', { y: 20, opacity: 0, duration: 0.8 })
      .from('.hero-titre', { y: 30, opacity: 0, duration: 1 }, '-=0.4')
      .from('.hero-accroche', { y: 20, opacity: 0, duration: 0.8 }, '-=0.3')
      .from('.hero-actions', { y: 20, opacity: 0, duration: 0.8 }, '-=0.3');

    // Catégories : apparition au scroll
    gsap.from('.categorie-grande, .categorie-petite', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.categories',
        start: 'top 80%'
      }
    });

    // Cartes produits : apparition au scroll
    gsap.from('.carte-produit', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.bestsellers',
        start: 'top 80%'
      }
    });

    // Histoire : apparition
    gsap.from('.histoire-image', {
      x: -40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.histoire',
        start: 'top 80%'
      }
    });

    gsap.from('.histoire-contenu', {
      x: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.histoire',
        start: 'top 80%'
      }
    });

  } catch (error) {
    console.log('ℹ ZANKA — GSAP:', error.message);
  }

});
