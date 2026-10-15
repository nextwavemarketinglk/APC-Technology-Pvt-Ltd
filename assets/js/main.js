(() => {
  'use strict';
  const header = document.getElementById('site-header');
  const menuButton = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const backTop = document.getElementById('back-to-top');
  function onScroll() {
    const scrolled = window.scrollY > 12;
    header?.classList.toggle('scrolled', scrolled);
    backTop?.classList.toggle('visible', window.scrollY > 450);
  }
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  function closeMenu() {
    if (!mobileMenu || !menuButton) return;
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    menuButton.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-menu"></use></svg>';
  }
  menuButton?.addEventListener('click', () => {
    const willOpen = mobileMenu.hidden;
    mobileMenu.hidden = !willOpen;
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
    menuButton.innerHTML = `<svg class="ico" aria-hidden="true"><use href="#i-${willOpen ? 'close' : 'menu'}"></use></svg>`;
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {if (event.key === 'Escape') closeMenu();});
  window.addEventListener('resize', () => {if (window.innerWidth > 980) closeMenu();});
  backTop?.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
  const year = document.getElementById('year'); if (year) year.textContent = String(new Date().getFullYear());

  const items = document.querySelectorAll('.reveal');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(({target, isIntersecting}) => {
        if (isIntersecting) {target.classList.add('is-visible'); obs.unobserve(target);}
      });
    }, {threshold: 0.06, rootMargin: '0px 0px -30px 0px'});
    items.forEach(item => observer.observe(item));
  } else {items.forEach(item => item.classList.add('is-visible'));}

  // Preselect the service if a customer came from a specific service page.
  const choices = {
    cctv: 'CCTV & Surveillance',
    'access-control': 'Biometric & Door Access',
    networking: 'Data Network Solutions',
    maintenance: 'Maintenance & Support',
    consultation: 'Multiple Services / Consultation'
  };
  const query = new URLSearchParams(window.location.search);
  const serviceSelect = document.getElementById('service-select');
  if (serviceSelect && choices[query.get('service')]) serviceSelect.value = choices[query.get('service')];

  const quoteForm = document.getElementById('quote-form');
  quoteForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = document.getElementById('form-message');
    status.classList.remove('success');
    quoteForm.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
    const fields = Object.fromEntries(new FormData(quoteForm).entries());
    const required = ['name', 'phone', 'service', 'details'];
    const missing = required.filter(field => !String(fields[field] || '').trim());
    if (missing.length) {
      missing.forEach(field => quoteForm.elements[field].setAttribute('aria-invalid', 'true'));
      status.textContent = 'Please complete all required fields before continuing.';
      quoteForm.elements[missing[0]].focus();
      return;
    }
    if (!/^[+\d\s().-]{8,20}$/.test(String(fields.phone).trim())) {
      quoteForm.elements.phone.setAttribute('aria-invalid', 'true');
      status.textContent = 'Please enter a valid contact number.';
      quoteForm.elements.phone.focus();
      return;
    }
    const clean = (s) => String(s || '').trim().slice(0, 1500);
    const message = [
      'Hello APC Technology, I would like to make an inquiry.',
      '', 'Name: ' + clean(fields.name),
      'Contact number: ' + clean(fields.phone),
      'Service: ' + clean(fields.service),
      'Property: ' + clean(fields.property),
      'Location: ' + (clean(fields.location) || 'Not provided'),
      '', 'Details:', clean(fields.details)
    ].join('\n');
    const link = 'https://wa.me/94774925615?text=' + encodeURIComponent(message);
    status.classList.add('success');
    status.textContent = 'Your message is prepared. WhatsApp will open so you can review and send it.';
    // Opening from a direct user click; if blocked, the generated link is also shown.
    const opened = window.open(link, '_blank', 'noopener,noreferrer');
    if (!opened) {
      const a = document.createElement('a');
      a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.textContent = 'Click here to open your WhatsApp inquiry';
      status.appendChild(document.createTextNode(' ')); status.appendChild(a);
    }
  });
})();
