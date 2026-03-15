const navLinks = document.querySelectorAll('.top-nav nav a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');
const yearNode = document.getElementById('year');
const githubUser = 'tanmayubh';

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
      });
    });
  },
  {
    rootMargin: '-40% 0px -45% 0px',
    threshold: 0.05
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.14
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function scoreRepo(repo, terms) {
  const name = (repo.name || '').toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  let score = 0;

  terms.forEach((term) => {
    if (name.includes(term)) {
      score += 4;
    }
    if (desc.includes(term)) {
      score += 2;
    }
  });

  const full = `${name} ${desc}`;
  if (full.includes('regression')) {
    score += 1;
  }

  return score;
}

function makeCardInteractive(card, url) {
  card.classList.add('is-interactive');
  card.setAttribute('role', 'link');
  card.tabIndex = 0;

  card.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      return;
    }
    window.open(url, '_blank', 'noopener');
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      window.open(url, '_blank', 'noopener');
    }
  });
}

async function connectProjectCardsToGitHub() {
  const projectCards = document.querySelectorAll('.project-card[data-project-query]');
  if (!projectCards.length) {
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated`);
    if (!response.ok) {
      throw new Error('Unable to fetch repositories');
    }

    const repos = await response.json();
    const candidates = repos.filter((repo) => !repo.fork && repo.name !== 'tanmayubh.github.io' && repo.name !== 'tanmayubh');
    const usedRepoNames = new Set();

    projectCards.forEach((card) => {
      const query = (card.dataset.projectQuery || '').toLowerCase();
      const terms = query.split(/\s+/).filter(Boolean);
      const link = card.querySelector('.project-repo-link');
      const stats = card.querySelector('.project-stats');

      if (!link || !stats) {
        return;
      }

      const ranked = candidates
        .filter((repo) => !usedRepoNames.has(repo.name))
        .map((repo) => ({ repo, score: scoreRepo(repo, terms) }))
        .sort((a, b) => b.score - a.score);

      const bestMatch = ranked[0];
      if (!bestMatch || bestMatch.score < 2) {
        link.textContent = 'View GitHub Profile';
        link.href = `https://github.com/${githubUser}?tab=repositories`;
        stats.textContent = 'No strong match found automatically.';
        return;
      }

      const { repo } = bestMatch;
      usedRepoNames.add(repo.name);

      link.textContent = 'View Repository';
      link.href = repo.html_url;
      stats.textContent = `${repo.language || 'Code'} • ${repo.stargazers_count} stars • Updated ${formatDate(repo.updated_at)}`;
      makeCardInteractive(card, repo.html_url);
    });
  } catch (error) {
    projectCards.forEach((card) => {
      const stats = card.querySelector('.project-stats');
      const link = card.querySelector('.project-repo-link');
      if (stats) {
        stats.textContent = 'GitHub API unavailable right now.';
      }
      if (link) {
        link.textContent = 'View GitHub Profile';
        link.href = `https://github.com/${githubUser}?tab=repositories`;
      }
    });
  }
}

connectProjectCardsToGitHub();

function startTypewriter(element, phrases, options = {}) {
  if (!element || !phrases || !phrases.length) return;

  const { typeSpeed = 70, pause = 1350, backspaceSpeed = 40 } = options;
  let phraseIndex = 0;
  let charIndex = 0;
  let direction = 1;

  const tick = () => {
    const phrase = phrases[phraseIndex];
    element.textContent = phrase.slice(0, charIndex);

    if (direction === 1) {
      if (charIndex < phrase.length) {
        charIndex += 1;
        setTimeout(tick, typeSpeed);
        return;
      }
      direction = -1;
      setTimeout(tick, pause);
      return;
    }

    if (charIndex > 0) {
      charIndex -= 1;
      setTimeout(tick, backspaceSpeed);
      return;
    }

    direction = 1;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(tick, 350);
  };

  tick();
}

const typedElement = document.getElementById('typed-text');
startTypewriter(typedElement, [
  'HTML/CSS/JS interfaces.',
  'scalable backend APIs.',
  'data & analytics pipelines.',
  'automated cloud delivery.',
]);
