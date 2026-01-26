(function(){
  const page = document.documentElement.getAttribute('data-page') || 'home';
  document.querySelectorAll('[data-nav]').forEach(a=>{
    if(a.getAttribute('data-nav') === page) a.classList.add('active');
  });

  // Intro poster (shown once per browser session)
  const intro = document.getElementById('intro');
  if (intro) {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const INTRO_MS = prefersReduced ? 1500 : 6000;
    const alreadyShown = sessionStorage.getItem('ec_intro_shown') === '1';

    const hideIntro = () => {
      intro.classList.add('intro--hide');
      document.body.classList.remove('intro-lock');
      sessionStorage.setItem('ec_intro_shown', '1');
      window.setTimeout(() => {
        try { intro.remove(); } catch(e) { /* noop */ }
      }, 900);
    };

    if (alreadyShown) {
      // If the user has already seen it in this tab/session, skip it.
      try { intro.remove(); } catch(e) { /* noop */ }
    } else {
      document.body.classList.add('intro-lock');
      window.setTimeout(hideIntro, INTRO_MS);

      // Allow skipping
      intro.addEventListener('click', hideIntro, { once: true });
      window.addEventListener('keydown', hideIntro, { once: true });
    }
  }

  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if(btn && nav){
    btn.addEventListener('click', ()=>{
      const showing = nav.style.display === 'flex';
      nav.style.display = showing ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '6px';
      nav.style.position = 'absolute';
      nav.style.top = '54px';
      nav.style.right = '12px';
      nav.style.padding = '10px';
      nav.style.borderRadius = '14px';
      nav.style.background = 'rgba(0,0,0,.55)';
      nav.style.border = '1px solid rgba(255,255,255,.12)';
      nav.style.backdropFilter = 'blur(8px)';
      nav.style.zIndex = 20;
    });
  }
})();

// Extra: Newsletter / coupons signup (demo)
(() => {
  const form = document.getElementById('newsletterForm');
  const status = document.getElementById('newsletterStatus');
  if (!form || !status) return;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();

    if (!email || !isValidEmail(email)) {
      status.textContent = 'Please enter a valid email.';
      status.classList.add('error');
      return;
    }

    // Store locally so the demo feels real (replace with your backend later)
    const existing = JSON.parse(localStorage.getItem('elcachuchon_newsletter') || '[]');
    existing.push({ name, email, ts: new Date().toISOString() });
    localStorage.setItem('elcachuchon_newsletter', JSON.stringify(existing));

    status.textContent = 'You’re in. Coupons + drops coming soon.';
    status.classList.remove('error');
    status.classList.add('success');
    form.reset();
  });
})();
