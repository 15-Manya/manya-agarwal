import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { profile, siteData } from './siteData.js';

const h = React.createElement;

const navItems = [
  { id: 'about', label: 'About Me' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Technical Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact Me' },
];

const sectionTitles = {
  about: { prefix: '01', title: 'About Me' },
  education: { prefix: '02', title: 'My Education' },
  skills: { prefix: '03', title: 'My Technical Skills' },
  experience: { prefix: '04', title: 'My Experience' },
  projects: { prefix: '05', title: 'My Projects' },
  blog: { prefix: '06', title: 'My Blog' },
  contact: { prefix: '07', title: 'Contact Me' },
};

function hasItems(value) {
  return Array.isArray(value) && value.length > 0;
}

function getProjectFromPath(pathname) {
  const match = pathname.match(/^\/projects\/([^/]+)\/?$/);
  if (!match) return null;
  return siteData.projects.find((project) => project.slug === match[1]) || null;
}

function getBlogFromPath(pathname) {
  const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (!match) return null;
  return siteData.blogs.find((post) => post.slug === match[1]) || null;
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function App() {
  const [route, setRoute] = useState(() => window.location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isScrolled, setIsScrolled] = useState(false);
  const activeProject = getProjectFromPath(route);
  const activeBlog = getBlogFromPath(route);
  const isDetailRoute = Boolean(activeProject || activeBlog);

  useEffect(() => {
    function onPopState() {
      setRoute(window.location.pathname);
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 80);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isDetailRoute || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) setActiveSection(visibleEntry.target.id);
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.2, 0.35, 0.6],
      }
    );

    navItems.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isDetailRoute]);

  function navigate(path) {
    window.history.pushState({}, '', path);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  }

  function handleJump(id) {
    if (isDetailRoute) {
      window.history.pushState({}, '', '/');
      setRoute('/');
      window.setTimeout(() => scrollToSection(id), 0);
    } else {
      scrollToSection(id);
    }

    setActiveSection(id);
    setMenuOpen(false);
  }

  return h(
    React.Fragment,
    null,
    h('div', { className: 'noise', 'aria-hidden': true }),
    h(Header, {
      activeSection,
      isDetailRoute,
      isScrolled,
      menuOpen,
      onJump: handleJump,
      onNavigate: navigate,
      setMenuOpen,
    }),
    activeProject
      ? h(ProjectPage, { onNavigate: navigate, project: activeProject })
      : activeBlog
        ? h(BlogPage, { onNavigate: navigate, post: activeBlog })
        : h(HomePage, { onJump: handleJump, onNavigate: navigate }),
    h('footer', { className: 'site-footer' }, h('p', null, `© ${new Date().getFullYear()} ${profile.name}`))
  );
}

function Header({ activeSection, isDetailRoute, isScrolled, menuOpen, onJump, onNavigate, setMenuOpen }) {
  return h(
    'header',
    { className: `site-header${isScrolled ? ' scrolled' : ''}` },
    h(
      'button',
      {
        className: 'logo',
        onClick: () => (isDetailRoute ? onNavigate('/') : onJump('hero')),
        type: 'button',
        'aria-label': 'Home',
      },
      h('span', { className: 'logo__bracket' }, '<'),
      'MA',
      h('span', { className: 'logo__bracket' }, '/>')
    ),
    h(
      'button',
      {
        'aria-expanded': menuOpen,
        'aria-label': menuOpen ? 'Close navigation menu' : 'Open navigation menu',
        className: `menu-toggle${menuOpen ? ' menu-toggle--open' : ''}`,
        onClick: () => setMenuOpen(!menuOpen),
        type: 'button',
      },
      h('span'),
      h('span'),
      h('span')
    ),
    h(
      'nav',
      { className: `nav-drawer${menuOpen ? ' nav-drawer--open' : ''}`, 'aria-label': 'Main navigation' },
      h('div', { className: 'nav-drawer__label' }, 'Navigation'),
      navItems.map((item) =>
        h(
          'button',
          {
            className: `nav-drawer__link${!isDetailRoute && activeSection === item.id ? ' nav-drawer__link--active' : ''}`,
            key: item.id,
            onClick: () => onJump(item.id),
            type: 'button',
          },
          h('span', { className: 'nav-drawer__number' }, sectionTitles[item.id].prefix),
          item.label
        )
      )
    )
  );
}

function HomePage({ onJump, onNavigate }) {
  return h(
    'main',
    null,
    h(Hero, { onJump }),
    h(AboutSection),
    h(EducationSection),
    h(SkillsSection),
    h(ExperienceSection),
    h(ProjectsSection, { onNavigate }),
    h(BlogSection, { onNavigate }),
    h(ContactSection)
  );
}

function Hero({ onJump }) {
  return h(
    'section',
    { className: 'hero', id: 'hero' },
    h(
      'div',
      { className: 'hero__inner' },
      h('p', { className: 'hero__eyebrow' }, 'Heyy I am'),
      h('h1', { className: 'hero__title' }, h('span', { className: 'hero__title-line' }, 'Manya'), h('span', { className: 'hero__title-line' }, 'Agarwal')),
      h(
        'p',
        { className: 'hero__intro regular-stix-32px' },
        'Year 2 Computer Science student at the National University of Singapore.'
      ),
      h(
        'p',
        { className: 'hero__experience' },
        'Currently an AI Intern at The Coca-Cola Company and Founder of Rubber Duck.'
      ),
      h('p', { className: 'hero__tagline' }, 'Entrepreneur, builder and AI enthusiast.')
    ),
    h(TerminalPanel),
    h('div', { className: 'hero__visual' }, h('div', { className: 'hero__blob', 'aria-hidden': true }), h('div', { className: 'hero__grid', 'aria-hidden': true }), h('div', { className: 'hero__scan', 'aria-hidden': true })),
    h('button', { className: 'hero__scroll', 'aria-label': 'Scroll to content', onClick: () => onJump('about'), type: 'button' }, h('span', { className: 'hero__scroll-line' }))
  );
}

function TerminalPanel() {
  return h(
    'div',
    { className: 'hero__code', 'aria-hidden': true },
    h(
      'div',
      { className: 'terminal' },
      h('div', { className: 'terminal__bar' }, h('span', { className: 'terminal__dot' }), h('span', { className: 'terminal__dot' }), h('span', { className: 'terminal__dot' }), h('span', { className: 'terminal__title' }, 'manya.sh')),
      h(
        'div',
        { className: 'terminal__body' },
        h(
          'div',
          { className: 'terminal__line' },
          h('span', { className: 'code--keyword' }, 'const'),
          ' ',
          h('span', { className: 'code--name' }, 'roles'),
          ' ',
          h('span', { className: 'code--operator' }, '='),
          ' ',
          h('span', { className: 'code--bracket' }, '['),
          h('span', { className: 'code--string' }, '"student"'),
          h('span', { className: 'code--operator' }, ', '),
          h('span', { className: 'code--string' }, '"builder"'),
          h('span', { className: 'code--operator' }, ', '),
          h('span', { className: 'code--string' }, '"entrepreneur"'),
          h('span', { className: 'code--bracket' }, ']'),
          h('span', { className: 'code--cursor' }, '|')
        ),
        h('div', { className: 'terminal__line terminal__line--typing' }, h('span', { className: 'code--keyword' }, 'await'), ' ', h('span', { className: 'code--name' }, 'manya'), h('span', { className: 'code--operator' }, '.'), h('span', { className: 'code--method' }, 'ship'), h('span', { className: 'code--bracket' }, '()'), h('span', { className: 'code--cursor' }, '|'))
      )
    )
  );
}

function SectionTitle({ id }) {
  const meta = sectionTitles[id];
  return h(
    'div',
    { className: 'section__heading' },
    h('span', { className: 'section__title-prefix' }, meta.prefix),
    h('h2', { className: 'section__title' }, meta.title)
  );
}

function ProfileFact({ label, value }) {
  const lines = Array.isArray(value) ? value : [value];

  return h(
    React.Fragment,
    null,
    h('span', { className: 'profile-fact__label' }, `${label}:`),
    h(
      'div',
      { className: 'profile-fact__value' },
      lines.map((line) => h('span', { className: 'profile-fact__line', key: line }, line))
    )
  );
}

function AboutSection() {
  const profileFacts = [
    ['Name', 'Manya Agarwal'],
    ['School', 'National University of Singapore'],
    [
      'Role',
      [
        'Artificial Intelligence Intern, The Coca Cola Company',
        'Founder, Rubber Duck',
      ],
    ],
  ];

  return h(
    'section',
    { className: 'section section--about', id: 'about' },
    h(
      'div',
      { className: 'container section-layout' },
      h(SectionTitle, { id: 'about' }),
      h(
        'div',
        { className: 'about-profile' },
        h(
          'div',
          { className: 'profile-facts reveal-card' },
          profileFacts.map(([label, value]) =>
            h('div', { className: 'profile-fact', key: label }, h(ProfileFact, { label, value }))
          ),
          h(
            'div',
            { className: 'profile-socials' },
            h('a', { href: `mailto:${profile.email}` }, 'Email'),
            profile.links.map((link) => h('a', { href: link.href, key: link.label, rel: 'noopener noreferrer', target: '_blank' }, link.label))
          )
        ),
        h(
          'div',
          { className: 'about-copy reveal-card' },
          h('p', { className: 'about__lead regular-stix-32px' }, "Hi, I'm Manya Agarwal."),
          h(
            'p',
            { className: 'about__body' },
            "I'm a Computer Science undergraduate at the National University of Singapore, currently building my own startup and exploring AI and Machine Learning."
          ),
          h(
            'p',
            { className: 'about__body' },
            "I enjoy building things from scratch, but even more than that, I enjoy learning through the process. Over the past two years, I've worked on projects in AI, education, productivity, and developer tools. Some worked better than others, but every one of them taught me something new about technology, products, and the people I was building for."
          ),
          h(
            'p',
            { className: 'about__body' },
            'I care about technical depth, thoughtful leadership, and creating products that make complicated things feel easier to understand.'
          )
        )
      )
    )
  );
}

function EducationSection() {
  return h(TimelineSection, { id: 'education', items: siteData.education, renderItem: renderEducation });
}

function SkillsSection() {
  const skills = siteData.skills || [];

  return h(
    'section',
    { className: 'section section--skills', id: 'skills' },
    h(
      'div',
      { className: 'container section-layout' },
      h(SectionTitle, { id: 'skills' }),
      h(
        'div',
        { className: 'skills-list' },
        hasItems(skills)
          ? skills.map((group) =>
              h(
                'div',
                { className: 'skills-item', key: group.title },
                h('span', { className: 'skills-item__label' }, `${group.title}:`),
                h('p', { className: 'skills-item__value' }, group.items.join(', '))
              )
            )
          : h('p', { className: 'skills-item__value' }, 'Add your languages, frameworks, AI tools, databases, and deployment stack here.')
      )
    )
  );
}

function ExperienceSection() {
  return h(TimelineSection, { id: 'experience', items: siteData.experience, renderItem: renderExperience });
}

function ProjectsSection({ onNavigate }) {
  return h(CardSection, { id: 'projects', items: siteData.projects, renderItem: (item) => renderProject(item, onNavigate) });
}

function BlogSection({ onNavigate }) {
  const posts = siteData.blogs || [];
  return h(
    'section',
    { className: 'section section--blog', id: 'blog' },
    h(
      'div',
      { className: 'container section-layout' },
      h(SectionTitle, { id: 'blog' }),
      h(
        'div',
        { className: 'section__content card-list' },
        hasItems(posts)
          ? posts.map((post) => renderBlog(post, onNavigate))
          : h('article', { className: 'card reveal-card' }, h('h3', { className: 'card__title' }, 'Writing coming soon'), h('p', { className: 'card__desc' }, 'A quiet space for essays, build notes, and things I learn along the way.'))
      )
    )
  );
}

function CardSection({ id, items, renderItem }) {
  return h(
    'section',
    { className: `section section--${id}`, id },
    h('div', { className: 'container section-layout' }, h(SectionTitle, { id }), h('div', { className: 'section__content card-list' }, items.map(renderItem)))
  );
}

function TimelineSection({ id, items, renderItem }) {
  return h(
    'section',
    { className: `section section--${id}`, id },
    h(
      'div',
      { className: 'container section-layout' },
      h(SectionTitle, { id }),
      h('div', { className: 'timeline-list' }, items.map(renderItem))
    )
  );
}

function card(key, title, meta, description, action, timeline = false, externalUrl) {
  const cardClass = timeline ? 'card timeline-card' : 'card';
  const actions =
    action || externalUrl
      ? h(
          'div',
          { className: 'card__actions', key: 'actions' },
          action && h('span', { className: 'card__action', key: 'action' }, action.label),
          externalUrl &&
            h(
              'a',
              {
                className: 'card__action card__action--link',
                href: externalUrl,
                key: 'external',
                onClick: (event) => event.stopPropagation(),
                rel: 'noopener noreferrer',
                target: '_blank',
              },
              'Visit site'
            )
        )
      : null;

  const content = [
    h('h3', { className: 'card__title', key: 'title' }, title),
    meta && h('p', { className: 'card__meta', key: 'meta' }, meta),
    description && h('p', { className: 'card__desc', key: 'desc' }, description),
    actions,
  ].filter(Boolean);

  if (action) {
    return h(
      'button',
      {
        className: `${cardClass} card--button reveal-card`,
        key,
        onClick: action.onClick,
        type: 'button',
      },
      content
    );
  }

  return h('article', { className: `${cardClass} reveal-card`, key }, content);
}

function renderEducation(item) {
  return card(item.school, item.school, `${item.degree} · ${item.period}`, item.description, null, true);
}

function renderProject(item, onNavigate) {
  return card(
    item.slug || item.title,
    item.title,
    item.period,
    item.description,
    {
      label: 'Read more',
      onClick: () => onNavigate(`/projects/${item.slug}`),
    },
    false,
    item.url
  );
}

function renderBlog(item, onNavigate) {
  return card(item.slug || item.title, item.title, item.date, item.excerpt, {
    label: 'Read post',
    onClick: () => onNavigate(`/blog/${item.slug}`),
  });
}

function renderExperience(item) {
  return card(
    item.slug || `${item.role}-${item.company}`,
    `${item.role} · ${item.company}`,
    item.period,
    item.description,
    null,
    true,
    item.url
  );
}

function ProjectPage({ onNavigate, project }) {
  const paragraphs = project.details || [project.description || 'README coming soon.'];

  return h(
    'main',
    { className: 'project-page' },
    h(
      'article',
      { className: 'project-readme' },
      h(
        'button',
        { className: 'readme-back', onClick: () => onNavigate('/'), type: 'button' },
        '← Back to home'
      ),
      h('p', { className: 'readme-kicker' }, 'Project README'),
      h('h1', { className: 'readme-title' }, project.title),
      h('p', { className: 'readme-summary' }, project.description),
      project.url &&
        h(
          'p',
          { className: 'readme-links' },
          h(
            'a',
            {
              className: 'readme-link',
              href: project.url,
              rel: 'noopener noreferrer',
              target: '_blank',
            },
            'Visit site →'
          )
        ),
      h('div', { className: 'readme-rule' }),
      h(
        'div',
        { className: 'readme-body' },
        paragraphs.map((paragraph) => h('p', { key: paragraph }, paragraph))
      )
    )
  );
}

function BlogContent({ blocks }) {
  return blocks.map((block, index) => {
    if (block.type === 'heading') {
      return h('h2', { className: 'blog-post__heading', key: `${index}-${block.text}` }, block.text);
    }

    if (block.type === 'list') {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return h(
        ListTag,
        { className: `blog-post__list${block.ordered ? ' blog-post__list--ordered' : ''}`, key: `${index}-list` },
        block.items.map((item) => h('li', { className: 'blog-post__list-item', key: item }, item))
      );
    }

    return h('p', { className: 'blog-post__paragraph', key: `${index}-${block.text}` }, block.text);
  });
}

function BlogPage({ onNavigate, post }) {
  const blocks = post.content || (post.details || [post.excerpt || 'Post coming soon.']).map((text) => ({ type: 'paragraph', text }));

  return h(
    'main',
    { className: 'project-page' },
    h(
      'article',
      { className: 'blog-post project-readme' },
      h(
        'button',
        { className: 'readme-back', onClick: () => onNavigate('/'), type: 'button' },
        '← Back to home'
      ),
      h('p', { className: 'readme-kicker' }, 'Blog post'),
      h('h1', { className: 'readme-title' }, post.title),
      h('p', { className: 'blog-post__date' }, post.date),
      post.excerpt && h('p', { className: 'blog-post__intro regular-stix-32px' }, post.excerpt),
      h('div', { className: 'readme-rule' }),
      h('div', { className: 'blog-post__body' }, h(BlogContent, { blocks }))
    )
  );
}

function ContactSection() {
  return h(
    'section',
    { className: 'section section--contact', id: 'contact' },
    h(
      'div',
      { className: 'container section-layout' },
      h(SectionTitle, { id: 'contact' }),
      h(
        'div',
        { className: 'contact__content about-copy' },
        h(
          'p',
          { className: 'about__lead regular-stix-32px' },
          "I'd love to hear from you, whether it's about a project, an idea, or just to say hi."
        ),
        h(
          'p',
          { className: 'about__body' },
          'Always open to collaboration, good conversations, and thoughtful opportunities.'
        ),
        h(
          'div',
          { className: 'profile-socials' },
          h('a', { href: `mailto:${profile.email}` }, 'Email'),
          profile.links.map((link) =>
            h(
              'a',
              {
                href: link.href,
                key: link.label,
                rel: 'noopener noreferrer',
                target: '_blank',
              },
              link.label
            )
          )
        )
      )
    )
  );
}

createRoot(document.getElementById('root')).render(h(App));
