/* ============================================================
   Вертекс-ИТ — landing interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  function closeMenu() {
    burger.classList.remove('active');
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    document.body.classList.remove('menu-open');
  }

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('active');
    nav.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('menu-open', isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Header on scroll + progress + to-top ---------- */
  const header = document.getElementById('header');
  const progress = document.getElementById('scrollProgress');
  const toTop = document.getElementById('toTop');

  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle('scrolled', y > 30);
    toTop.classList.toggle('visible', y > 700);
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = Number(el.dataset.count);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => { counter.textContent = counter.dataset.count; });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item__q').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const answer = item.querySelector('.faq-item__a');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-item__a').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Toast ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 4200);
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach((field) => {
      const empty = !field.value.trim();
      field.classList.toggle('error', empty);
      if (empty) valid = false;
    });

    const contactField = form.elements.contact;
    if (!contactField.value.trim()) {
      valid = false;
    } else {
      const value = contactField.value.replace(/[\s()-]/g, '');
      const isPhone = /^\+?\d{10,15}$/.test(value);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contactField.value.trim());
      if (!isPhone && !isEmail) {
        contactField.classList.add('error');
        valid = false;
      }
    }

    if (!valid) {
      showToast('Проверьте, пожалуйста, обязательные поля');
      return;
    }

    if (!form.elements.agreement.checked) {
      showToast('Для отправки нужно согласие на обработку данных');
      return;
    }

    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Отправляем...';

    // Demo mode: no backend connected. Replace this with a real request.
    setTimeout(() => {
      form.reset();
      submitButton.disabled = false;
      submitButton.innerHTML = 'Отправить запрос <span>→</span>';
      showToast('✓ Запрос отправлен! Мы вернём расчёт в течение рабочего дня.');
    }, 900);
  });

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });

  /* ---------- Close menu when resizing to desktop ---------- */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && nav.classList.contains('open')) closeMenu();
  });
})();
