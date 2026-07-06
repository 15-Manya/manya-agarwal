(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const jumpTargets = document.querySelectorAll('[data-target]');
  const sectionLinks = document.querySelectorAll('.nav a[href^="#"]');

  function scrollToSelector(selector) {
    if (!selector) return;
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Year in footer
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll: add class to header for background
  function onScroll() {
    if (window.scrollY > 80) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
    });
  }

  // Explorer panel navigation
  const explorerRows = document.querySelectorAll('.panel--explorer .panel__row[data-target]');

  function setActiveTarget(selector) {
    explorerRows.forEach(function (row) {
      row.classList.toggle('panel__row--active', row.getAttribute('data-target') === selector);
    });

    sectionLinks.forEach(function (link) {
      link.classList.toggle('nav__link--active', link.getAttribute('href') === selector);
    });
  }

  jumpTargets.forEach(function (item) {
    item.addEventListener('click', function () {
      const selector = item.getAttribute('data-target');
      scrollToSelector(selector);
      setActiveTarget(selector);
    });
  });

  // Show/hide sections and render content from siteData
  function hasItems(arr) {
    return Array.isArray(arr) && arr.length > 0;
  }

  function renderEducation(container) {
    if (!container || !hasItems(siteData.education)) return;
    container.innerHTML = siteData.education
      .map(
        (e) => `
      <article class="card">
        <h3 class="card__title">${escapeHtml(e.school)}</h3>
        <p class="card__meta">${escapeHtml(e.degree)} · ${escapeHtml(e.period)}</p>
        ${e.description ? `<p class="card__desc">${escapeHtml(e.description)}</p>` : ''}
      </article>
    `
      )
      .join('');
  }

  function renderProjects(container) {
    if (!container || !hasItems(siteData.projects)) return;
    container.innerHTML = siteData.projects
      .map(
        (p) => `
      <article class="card">
        <h3 class="card__title">${p.url ? `<a href="${escapeAttr(p.url)}" target="_blank" rel="noopener">${escapeHtml(p.title)}</a>` : escapeHtml(p.title)}</h3>
        <p class="card__meta">${escapeHtml(p.period)}</p>
        ${p.description ? `<p class="card__desc">${escapeHtml(p.description)}</p>` : ''}
      </article>
    `
      )
      .join('');
  }

  function renderBlogs(container) {
    if (!container || !hasItems(siteData.blogs)) return;
    container.innerHTML = siteData.blogs
      .map(
        (b) => `
      <article class="card">
        <h3 class="card__title">${b.url ? `<a href="${escapeAttr(b.url)}" target="_blank" rel="noopener">${escapeHtml(b.title)}</a>` : escapeHtml(b.title)}</h3>
        <p class="card__meta">${escapeHtml(b.date)}</p>
        ${b.excerpt ? `<p class="card__desc">${escapeHtml(b.excerpt)}</p>` : ''}
      </article>
    `
      )
      .join('');
  }

  function renderExperience(container) {
    if (!container || !hasItems(siteData.experience)) return;
    container.innerHTML = siteData.experience
      .map(
        (e) => `
      <article class="card">
        <h3 class="card__title">${escapeHtml(e.role)} · ${escapeHtml(e.company)}</h3>
        <p class="card__meta">${escapeHtml(e.period)}</p>
        ${e.description ? `<p class="card__desc">${escapeHtml(e.description)}</p>` : ''}
      </article>
    `
      )
      .join('');
  }

  function renderResearch(container) {
    if (!container || !hasItems(siteData.research)) return;
    container.innerHTML = siteData.research
      .map(
        (r) => `
      <article class="card">
        <h3 class="card__title">${r.url ? `<a href="${escapeAttr(r.url)}" target="_blank" rel="noopener">${escapeHtml(r.title)}</a>` : escapeHtml(r.title)}</h3>
        <p class="card__meta">${escapeHtml(r.venue)} · ${escapeHtml(r.year)}</p>
      </article>
    `
      )
      .join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, '&quot;');
  }

  // Section visibility and content
  const sections = {
    education: document.querySelector('[data-section="education"]'),
    projects: document.querySelector('[data-section="projects"]'),
    blogs: document.querySelector('[data-section="blogs"]'),
    experience: document.querySelector('[data-section="experience"]'),
    research: document.querySelector('[data-section="research"]'),
  };

  const containers = {
    education: document.querySelector('[data-education-list]'),
    projects: document.querySelector('[data-projects-list]'),
    blogs: document.querySelector('[data-blogs-list]'),
    experience: document.querySelector('[data-experience-list]'),
    research: document.querySelector('[data-research-list]'),
  };

  if (hasItems(siteData.education)) {
    sections.education?.removeAttribute('hidden');
    sections.education?.querySelector('.section__content')?.classList.add('card-list');
    renderEducation(containers.education);
  }
  if (hasItems(siteData.projects)) {
    sections.projects?.removeAttribute('hidden');
    sections.projects?.querySelector('.section__content')?.classList.add('card-list');
    renderProjects(containers.projects);
  }
  if (hasItems(siteData.blogs)) {
    sections.blogs?.removeAttribute('hidden');
    sections.blogs?.querySelector('.section__content')?.classList.add('card-list');
    renderBlogs(containers.blogs);
  }
  if (hasItems(siteData.experience)) {
    sections.experience?.removeAttribute('hidden');
    sections.experience?.querySelector('.section__content')?.classList.add('card-list');
    renderExperience(containers.experience);
  }
  if (hasItems(siteData.research)) {
    sections.research?.removeAttribute('hidden');
    sections.research?.querySelector('.section__content')?.classList.add('card-list');
    renderResearch(containers.research);
  }

  // Hide shortcuts when their target section is hidden
  jumpTargets.forEach(function (item) {
    const selector = item.getAttribute('data-target');
    const id = selector?.slice(1);
    const section = id && document.getElementById(id);
    if (section?.hasAttribute('hidden')) item.style.display = 'none';
  });

  // Hide nav links for sections that are hidden (no content yet)
  sectionLinks.forEach(function (link) {
    const id = link.getAttribute('href')?.slice(1);
    const section = id && document.getElementById(id);
    if (section?.hasAttribute('hidden')) link.style.display = 'none';
  });

  // Highlight the current section in the explorer and top nav
  const visibleSections = Array.from(document.querySelectorAll('main section[id]')).filter(function (section) {
    return !section.hasAttribute('hidden');
  });

  if (visibleSections.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      const visibleEntry = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];

      if (!visibleEntry) return;
      setActiveTarget('#' + visibleEntry.target.id);
    }, {
      rootMargin: '-20% 0px -55% 0px',
      threshold: [0.2, 0.35, 0.6],
    });

    visibleSections.forEach(function (section) {
      observer.observe(section);
    });
  }

  setActiveTarget(window.location.hash || '#about');

  // Close mobile menu when a nav link is clicked
  nav?.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });
})();
