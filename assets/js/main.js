/**
 * main.js - TowGuard 24/7 Roadside & Dispatch Template
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavbar();
  initScrollUI();
  initCardGlow();
  initFormValidation();
  initPasswordToggles();
  initAnimations();
  initCapTableSim();
  initRoadmap();
  initTestimonialSlider();
  initFAQAccordion();
});

/* --- THEME TOGGLE (Light/Dark Mode) --- */
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle');

  // Default to system preference if no localStorage
  let currentTheme = localStorage.getItem('theme');
  if (!currentTheme) {
    currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(currentTheme);

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  });
}

function applyTheme(theme) {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggles.forEach(btn => btn.innerHTML = '<i class="ph ph-sun"></i>');
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggles.forEach(btn => btn.innerHTML = '<i class="ph ph-moon"></i>');
  }
}

/* --- RTL TOGGLE --- */
function initRTL() {
  const rtlToggles = document.querySelectorAll('.rtl-toggle');

  let isRTL = localStorage.getItem('rtl') === 'true';
  applyRTL(isRTL);

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      isRTL = !isRTL;
      applyRTL(isRTL);
      localStorage.setItem('rtl', isRTL);
    });
  });
}

function applyRTL(isRTL) {
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  rtlToggles.forEach(btn => btn.innerHTML = '<i class="ph ph-arrows-left-right"></i>');
}

/* --- NAVBAR & DRAWER --- */
function initNavbar() {
  const navToggle = document.querySelector('.nav-toggle');
  const drawerClose = document.querySelector('.drawer-close');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (navToggle) navToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Close the drawer when a link inside it is followed
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Resize handler to close drawer if > 1024px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) closeDrawer();
  });
}

/* --- SCROLL UI: condensed navbar & back-to-top --- */
function initScrollUI() {
  const navbar = document.querySelector('.navbar');

  const toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '<i class="ph ph-arrow-up"></i>';
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(toTop);

  let ticking = false;

  function update() {
    const y = window.scrollY;

    if (navbar) navbar.classList.toggle('scrolled', y > 24);
    toTop.classList.toggle('show', y > 600);

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* --- CARD CURSOR GLOW --- */
function initCardGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, { passive: true });
}

/* --- PASSWORD REVEAL --- */
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = btn.closest('.password-field');
      const input = field && field.querySelector('input');
      if (!input) return;

      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      btn.innerHTML = reveal ? '<i class="ph ph-eye-slash"></i>' : '<i class="ph ph-eye"></i>';
      btn.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
    });
  });
}

/* --- FORM VALIDATION --- */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate="true"]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          showError(input, 'This field is required');
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
          isValid = false;
          showError(input, 'Please enter a valid email address');
        } else if (input.type === 'password' && input.value.length < 8) {
          isValid = false;
          showError(input, 'Password must be at least 8 characters');
        } else {
          clearError(input);
        }
      });

      // Password match check
      const pass = form.querySelector('input[name="password"]');
      const confirmPass = form.querySelector('input[name="confirm_password"]');
      if (pass && confirmPass && pass.value !== confirmPass.value) {
        isValid = false;
        showError(confirmPass, 'Passwords do not match');
      }

      // Checkbox terms check
      const terms = form.querySelector('input[name="terms"]');
      if (terms && !terms.checked) {
        isValid = false;
        showError(terms, 'You must accept the Terms & Conditions');
      }

      if (isValid) {
        // Show success state (no page reload)
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="ph ph-check-circle"></i> Success!';
        btn.style.background = 'var(--success-color)';
        btn.style.color = '#fff';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
          form.reset();
        }, 3000);
      }
    });

    // Clear error on input
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', () => clearError(input));
    });
  });
}

function showError(input, message) {
  const formGroup = input.closest('.form-group') || input.parentElement;
  formGroup.classList.add('has-error');
  input.classList.add('form-error');
  input.classList.remove('form-success');

  const errorEl = formGroup.querySelector('.error-message');
  if (errorEl) errorEl.textContent = message;
}

function clearError(input) {
  const formGroup = input.closest('.form-group') || input.parentElement;
  formGroup.classList.remove('has-error');
  input.classList.remove('form-error');
  if (input.value.trim() !== '') {
    input.classList.add('form-success');
  } else {
    input.classList.remove('form-success');
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/* --- ANIMATIONS & COUNTERS --- */
function initAnimations() {
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  const statCounters = document.querySelectorAll('.stat-counter');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-up');

        if (entry.target.classList.contains('stat-counter')) {
          animateCounter(entry.target);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animateElements.forEach(el => observer.observe(el));
  statCounters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const decimals = target % 1 !== 0 ? 1 : 0;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = prefix + target.toFixed(decimals) + suffix;
    return;
  }

  const duration = 1800;
  const start = performance.now();

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    const value = target * eased;
    el.textContent = prefix + value.toFixed(decimals) + suffix;
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

/* ==========================================================================
   INTERACTIVE - Roadside & Tow Cost Estimator (index.html)
   ========================================================================== */
function initCapTableSim() {
  const sim = document.getElementById('capSim');
  if (!sim) return;

  const inputs = {
    dist: sim.querySelector('#simPre'),
    hookup: sim.querySelector('#simHookup'),
    addons: sim.querySelector('#simRound'),
    discount: sim.querySelector('#simEsop')
  };

  const defaults = {};
  Object.keys(inputs).forEach(key => { defaults[key] = inputs[key].value; });

  const presets = {
    local: { dist: 15, hookup: 75, addons: 25, discount: 15 },
    highway: { dist: 35, hookup: 95, addons: 50, discount: 20 },
    heavy: { dist: 50, hookup: 165, addons: 100, discount: 25 }
  };

  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

  function paintRange(input) {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const pct = ((parseFloat(input.value) - min) / (max - min)) * 100;
    input.style.setProperty('--fill', pct + '%');
  }

  function render() {
    const dist = parseFloat(inputs.dist.value);
    const hookup = parseFloat(inputs.hookup.value);
    const addons = parseFloat(inputs.addons.value);
    const discount = parseFloat(inputs.discount.value);

    const mileageCost = dist * 4;
    const gross = hookup + mileageCost + addons;
    const factor = 1 - (discount / 100);
    const netTotal = gross * factor;
    const savedAmt = gross - netTotal;
    const etaMins = Math.max(14, Math.round(14 + dist * 0.45));

    const hookupPct = (hookup * factor / gross) * 100;
    const mileagePct = (mileageCost * factor / gross) * 100;
    const addonsPct = (addons * factor / gross) * 100;
    const discountPct = discount;

    // Slider read-outs
    sim.querySelector('#simPreOut').textContent = dist + ' mi';
    sim.querySelector('#simHookupOut').textContent = money(hookup);
    sim.querySelector('#simRoundOut').textContent = addons === 0 ? 'None' : money(addons);
    sim.querySelector('#simEsopOut').textContent = discount.toFixed(0) + '%';
    Object.values(inputs).forEach(paintRange);

    // KPI tiles
    sim.querySelector('#kpiPost').textContent = money(netTotal);
    sim.querySelector('#kpiFounders').textContent = money(savedAmt);
    sim.querySelector('#kpiCapital').textContent = etaMins + ' min';
    sim.querySelector('#kpiDilution').textContent = discount.toFixed(0) + '% plan discount';

    // Stacked breakdown meter + legend
    const parts = [
      { key: 'founders', label: 'Base hook-up', pct: hookupPct },
      { key: 'mileage', label: 'Mileage transit', pct: mileagePct },
      { key: 'round', label: 'Roadside add-ons', pct: addonsPct },
      { key: 'esop', label: 'Member savings', pct: discountPct }
    ];

    parts.forEach((part, i) => {
      const seg = sim.querySelector(`.sim-seg[data-series="${i + 1}"]`);
      const out = sim.querySelector(`#legend-${part.key}`);
      const value = part.pct.toFixed(1) + '%';

      if (seg) {
        seg.style.setProperty('--w', part.pct + '%');
        seg.classList.toggle('is-wide', part.pct >= 11);
        seg.classList.toggle('is-empty', part.pct <= 0.05);
        seg.setAttribute('title', `${part.label}: ${value}`);
        const pctEl = seg.querySelector('.sim-seg-pct');
        if (pctEl) pctEl.textContent = value;
      }
      if (out) out.textContent = value;
    });

    const bar = sim.querySelector('#simBar');
    if (bar) {
      bar.setAttribute('aria-label',
        'Dispatch estimate breakdown: ' + parts.map(p => `${p.label} ${p.pct.toFixed(1)}%`).join(', '));
    }
  }

  function markPreset(name) {
    sim.querySelectorAll('.sim-preset').forEach(btn => {
      const on = btn.dataset.preset === name;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  Object.values(inputs).forEach(input => {
    input.addEventListener('input', () => {
      render();
      markPreset('');
    });
  });

  sim.querySelectorAll('.sim-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = presets[btn.dataset.preset];
      if (!preset) return;
      Object.keys(preset).forEach(key => { inputs[key].value = preset[key]; });
      render();
      markPreset(btn.dataset.preset);
    });
  });

  const reset = sim.querySelector('#simReset');
  if (reset) {
    reset.addEventListener('click', () => {
      Object.keys(inputs).forEach(key => { inputs[key].value = defaults[key]; });
      render();
      markPreset('local');
    });
  }

  render();
}

/* ==========================================================================
   INTERACTIVE - 12-step dispatch protocol explorer (home2.html)
   ========================================================================== */
const ROADMAP_WEEKS = [
  {
    phase: 'Dispatch', title: 'One-tap SOS & GPS lock',
    desc: 'Share your highway milepost or live smartphone GPS pin in under 15 seconds. Our dispatch hub locks onto your exact lane and shoulder direction immediately.',
    focus: ['Exact GPS pin & highway mile marker capture', 'Automatic safety checklist for passengers', 'Instant SMS confirmation with case ID'],
    milestone: 'Coordinates locked', mentor: 'Sarah Jenkins - Lead Dispatch Commander', output: 'Verified SOS ticket'
  },
  {
    phase: 'Dispatch', title: 'Vehicle & hazard triage',
    desc: 'We verify drivetrain type (AWD, EV, lowered, or commercial), clearance constraints, and active traffic risk so the exact rig rolls on the first call.',
    focus: ['AWD & EV flatbed clearance screening', 'Low-garage height & gate access check', 'Live traffic & shoulder hazard assessment'],
    milestone: 'Right rig matched', mentor: 'Marcus Chen - Senior Flatbed Specialist', output: 'Equipment spec sheet'
  },
  {
    phase: 'Dispatch', title: 'Nearest unit assignment',
    desc: 'Our live telemetry grid routes the closest certified TowGuard truck already patrolling your corridor, cutting deadhead wait times in half.',
    focus: ['Real-time GPS proximity fleet routing', 'Upfront locked rate with zero surge surprises', 'Direct driver phone & chat bridge opened'],
    milestone: 'Unit #TG-408 dispatched', mentor: 'Elena Rodriguez - Fleet Operations Lead', output: 'Driver & truck assignment'
  },
  {
    phase: 'Dispatch', title: 'Live ETA tracking link',
    desc: 'Watch your truck move turn-by-turn on a live map from dispatch to your bumper, with automatic SMS alerts at 10 minutes and 2 minutes out.',
    focus: ['Turn-by-turn live truck map link', '10-minute & 2-minute arrival alerts', 'Emergency contact status sharing'],
    milestone: 'En route with live ETA', mentor: 'David Kim - Telemetry & Routing Lead', output: 'Live tracking link'
  },
  {
    phase: 'On-Scene', title: 'Safety perimeter setup',
    desc: 'Upon arrival, your operator deploys high-visibility amber strobes, DOT reflective cones, and protective traffic blocking before stepping near your vehicle.',
    focus: ['High-intensity amber beacon positioning', 'DOT reflective cone safety lane', 'Safe passenger staging off traffic side'],
    milestone: 'Scene secured', mentor: 'Sarah Jenkins - Safety & Compliance Lead', output: 'Protected work zone'
  },
  {
    phase: 'On-Scene', title: '360-degree vehicle inspection',
    desc: 'Before touching a wrench or winch cable, we log timestamped 360-degree photos and check tire pressure, battery voltage, or mechanical fault codes.',
    focus: ['Timestamped 360-degree condition photos', 'OBD-II & AGM/EV 12V battery diagnostics', 'Zero-damage tow point verification'],
    milestone: 'Inspection logged', mentor: 'Marcus Chen - Master Recovery Tech', output: 'Digital condition log'
  },
  {
    phase: 'On-Scene', title: 'Roadside fix or hydraulic load',
    desc: 'If we can get you rolling on-site—jumpstart, spare swap, lockout entry, or fuel—we solve it in minutes. Otherwise, we soft-strap onto a low-angle flatbed.',
    focus: ['Nylon soft-strap zero-metal wheel tie-downs', 'Low-angle tilt deck for sports & EV chassis', 'Commercial jump pack & lug torque calibration'],
    milestone: 'Loaded or back on road', mentor: 'Anita Patel - Heavy & EV Recovery Lead', output: 'Secured vehicle transport'
  },
  {
    phase: 'On-Scene', title: 'Departure & route confirmation',
    desc: 'You confirm the drop-off repair shop, dealership, or home driveway, and receive a live transit ETA whether you ride in the cab or head home separately.',
    focus: ['Verified repair shop or home drop address', 'Climate-controlled cab ride option', 'Gate code & after-hours key drop notes'],
    milestone: 'In transit to drop-off', mentor: 'Thomas Wright - Night Shift Supervisor', output: 'Confirmed transit route'
  },
  {
    phase: 'Drop-Off', title: 'Live transit monitoring',
    desc: 'Your dashboard tracks every mile of the haul with continuous telemetry until the truck arrives safely at your chosen destination.',
    focus: ['Continuous GPS route & speed logging', 'Automated arrival alert to service advisor', 'Uninterrupted dispatch support line'],
    milestone: 'Arrived at destination', mentor: 'Elena Rodriguez - Fleet Operations Lead', output: 'Arrival timestamp'
  },
  {
    phase: 'Drop-Off', title: 'Precision flatbed unload',
    desc: 'Your vehicle is gently rolled off at controlled winch speed into the designated service bay or driveway spot with final wheel chock verification.',
    focus: ['Controlled hydraulic tilt & winch unload', 'Exact service bay or driveway placement', 'Post-unload walkaround confirmation'],
    milestone: 'Vehicle safely delivered', mentor: 'Marcus Chen - Master Recovery Tech', output: 'Delivery photo proof'
  },
  {
    phase: 'Drop-Off', title: 'Digital sign-off & key handoff',
    desc: 'Review post-unload photos on your phone, sign digitally in seconds, or receive secure photo proof of an after-hours lockbox key drop.',
    focus: ['Timestamped drop-off & keybox photos', 'Paperless mobile signature capture', 'Instant service rating & feedback'],
    milestone: 'Handoff signed off', mentor: 'David Kim - Customer Care Lead', output: 'Signed delivery receipt'
  },
  {
    phase: 'Drop-Off', title: 'Itemized receipt & claim packet',
    desc: 'Your customer dashboard archives the full dispatch history, mileage log, and itemized PDF invoice ready for one-click insurance reimbursement.',
    focus: ['Itemized PDF invoice in Dispatch Portal', 'Pre- & post-tow inspection photo archive', 'Direct insurance & warranty reimbursement format'],
    milestone: 'Case closed & archived', mentor: 'TowGuard Claims Desk', output: 'Insurance-ready PDF packet'
  }
];

function initRoadmap() {
  const root = document.getElementById('roadmap');
  if (!root) return;

  const rail = root.querySelector('#rmRail');
  const phaseBtns = root.querySelectorAll('.roadmap-phase');
  const detail = root.querySelector('#rmDetail');
  const playBtn = root.querySelector('#rmPlay');
  const prevBtn = root.querySelector('#rmPrev');
  const nextBtn = root.querySelector('#rmNext');

  const els = {
    phase: root.querySelector('#rmPhase'),
    title: root.querySelector('#rmTitle'),
    desc: root.querySelector('#rmDesc'),
    list: root.querySelector('#rmList'),
    week: root.querySelector('#rmWeek'),
    milestone: root.querySelector('#rmMilestone'),
    mentor: root.querySelector('#rmMentor'),
    output: root.querySelector('#rmOutput')
  };

  let active = 0;
  let timer = null;

  // Build the week rail
  ROADMAP_WEEKS.forEach((week, i) => {
    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'roadmap-node';
    node.textContent = String(i + 1);
    node.setAttribute('role', 'tab');
    node.setAttribute('aria-controls', 'rmDetail');
    node.setAttribute('aria-label', `Step ${i + 1}: ${week.title}`);
    node.addEventListener('click', () => { stop(); select(i, true); });
    node.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        stop();
        const next = e.key === 'ArrowRight'
          ? (i + 1) % ROADMAP_WEEKS.length
          : (i - 1 + ROADMAP_WEEKS.length) % ROADMAP_WEEKS.length;
        select(next, true);
        nodes[next].focus();
      }
    });
    rail.appendChild(node);
  });

  const nodes = Array.from(rail.querySelectorAll('.roadmap-node'));

  function select(index, scrollRail) {
    active = index;
    const week = ROADMAP_WEEKS[index];

    nodes.forEach((node, i) => {
      node.classList.toggle('is-active', i === index);
      node.setAttribute('aria-selected', String(i === index));
      node.tabIndex = i === index ? 0 : -1;
    });

    phaseBtns.forEach(btn => btn.classList.toggle('is-active', btn.dataset.phase === week.phase));

    const phaseNumber = { Dispatch: 1, 'On-Scene': 2, 'Drop-Off': 3 }[week.phase];
    els.phase.textContent = `Phase ${phaseNumber} - ${week.phase}`;
    els.title.textContent = week.title;
    els.desc.textContent = week.desc;
    els.list.innerHTML = week.focus
      .map(item => `<li><i class="ph-fill ph-check-circle"></i><span>${item}</span></li>`)
      .join('');
    els.week.textContent = String(index + 1).padStart(2, '0');
    els.milestone.textContent = week.milestone;
    els.mentor.textContent = week.mentor;
    els.output.textContent = week.output;

    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === ROADMAP_WEEKS.length - 1;

    // Re-trigger the entrance animation
    detail.classList.remove('roadmap-fade');
    void detail.offsetWidth;
    detail.classList.add('roadmap-fade');

    // Keep the active node in view on small screens (never on first paint)
    if (scrollRail && rail.scrollWidth > rail.clientWidth) {
      const node = nodes[index];
      rail.scrollTo({ left: node.offsetLeft - (rail.clientWidth - node.offsetWidth) / 2, behavior: 'smooth' });
    }
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (playBtn) playBtn.innerHTML = '<i class="ph-fill ph-play"></i> Auto-play';
  }

  function play() {
    if (playBtn) playBtn.innerHTML = '<i class="ph-fill ph-pause"></i> Pause';
    timer = setInterval(() => {
      select((active + 1) % ROADMAP_WEEKS.length, true);
    }, 3200);
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => (timer ? stop() : play()));
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => { stop(); if (active > 0) select(active - 1, true); });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => { stop(); if (active < ROADMAP_WEEKS.length - 1) select(active + 1, true); });
  }

  phaseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stop();
      const first = ROADMAP_WEEKS.findIndex(w => w.phase === btn.dataset.phase);
      if (first > -1) select(first, true);
    });
  });

  // Pause auto-play when the section scrolls out of view
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (!entry.isIntersecting) stop(); });
    }, { threshold: 0.15 }).observe(root);
  }

  select(0, false);
}

/* --- TESTIMONIAL SLIDER --- */
function initTestimonialSlider() {
  const slider = document.getElementById('testimonialSlider');
  const prevBtn = document.querySelector('.testimonial-arrow.prev');
  const nextBtn = document.querySelector('.testimonial-arrow.next');
  const dots = document.querySelectorAll('.testimonial-dot');

  if (!slider) return;

  function getSlideWidth() {
    return slider.clientWidth;
  }

  function updateDots() {
    const currentIndex = Math.round(slider.scrollLeft / getSlideWidth());
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentIndex);
    });
  }

  slider.addEventListener('scroll', updateDots, { passive: true });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -getSlideWidth(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: getSlideWidth(), behavior: 'smooth' });
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      slider.scrollTo({ left: idx * getSlideWidth(), behavior: 'smooth' });
    });
  });
}

/* --- FAQ ACCORDION --- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      const parent = item.closest('.faq-accordion');
      if (parent) {
        parent.querySelectorAll('.faq-item.active').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('active');
          }
        });
      }

      item.classList.toggle('active', !isOpen);
    });
  });
}
