// script.js
// Simple interactive behaviors:
// - Smooth scroll (CSS handles most of it)
// - CTA button scroll to Sports
// - Scrollspy to update active nav link
// - Respect prefers-reduced-motion

(function(){
  const exploreBtn = document.getElementById('exploreBtn');
  const sportsSection = document.getElementById('sports');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const header = document.querySelector('.site-header');

  function headerHeight(){
    return header ? header.getBoundingClientRect().height : 0;
  }

  // If user prefers reduced motion, skip JS scroll animations
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  exploreBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if(!sportsSection) return;
    const top = sportsSection.getBoundingClientRect().top + window.scrollY - headerHeight();
    window.scrollTo({top, behavior: reduceMotion ? 'auto' : 'smooth'});
  });

  // Nav link clicks: offset the fixed header
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if(!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if(!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight();
      window.scrollTo({top, behavior: reduceMotion ? 'auto' : 'smooth'});
    });
  });

  // Scrollspy: highlight the nav link for the currently visible section
  function onScroll(){
    const offset = headerHeight() + 12; // account for fixed header
    let current = sections[0];
    for(const sec of sections){
      const rect = sec.getBoundingClientRect();
      if(rect.top - offset <= 0){ current = sec; }
    }
    // Update links
    navLinks.forEach(a => {
      a.classList.toggle('active', document.querySelector(a.getAttribute('href')) === current);
    });
  }

  // Throttle scroll handler for performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, {passive:true});

  // Initialize
  onScroll();
})();
