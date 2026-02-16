const buttons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

function setActivePage(pageId) {
  buttons.forEach((button) => {
    button.classList.toggle('active', button.dataset.page === pageId);
  });

  pages.forEach((page) => {
    page.classList.toggle('active', page.id === pageId);
  });
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const pageId = button.dataset.page;
    if (pageId) {
      setActivePage(pageId);
    }
  });
});

const footstep = document.getElementById('footstep');
const steps = ['images/steps.png', 'images/steps2.png'];
let stepIndex = 0;
let position = 0;
let endPosition = 0;
const stepHeight = 15;

function resetFootstepBounds() {
  position = window.innerHeight * 0.1;
  endPosition = window.innerHeight * 0.3;
}

function animateStep() {
  if (!footstep) return;

  footstep.src = steps[stepIndex % steps.length];
  stepIndex += 1;
  footstep.style.top = `${position}px`;
  footstep.style.opacity = '1';
  position += stepHeight;

  if (position <= endPosition) {
    setTimeout(() => {
      footstep.style.opacity = '0';
      setTimeout(animateStep, 100);
    }, 300);
    return;
  }

  footstep.style.transition = 'none';
  resetFootstepBounds();
  footstep.style.top = `${position}px`;
  stepIndex = 0;

  setTimeout(() => {
    footstep.style.transition = 'top 0.2s linear, opacity 0.2s linear';
    animateStep();
  }, 50);
}

const nodes = document.querySelectorAll('.node');
const svg = document.getElementById('lines');

const diamondPositions = [
  { x: 46.5, y: 45 },
  { x: 36, y: 54 },
  { x: 58, y: 54 },
  { x: 46.5, y: 62 },
  { x: 37.5, y: 71 },
  { x: 56, y: 71 }
];

function placeNodes() {
  nodes.forEach((node, index) => {
    const pos = diamondPositions[index];
    if (!pos) return;
    node.style.left = `${pos.x}%`;
    node.style.top = `${pos.y}%`;
  });
}

function connectNodes() {
  if (!svg || nodes.length === 0) return;

  svg.innerHTML = '';

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      if (Math.random() <= 0.6) continue;

      const a = nodes[i].getBoundingClientRect();
      const b = nodes[j].getBoundingClientRect();

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', a.left + a.width / 2);
      line.setAttribute('y1', a.top + a.height / 2);
      line.setAttribute('x2', b.left + b.width / 2);
      line.setAttribute('y2', b.top + b.height / 2);
      svg.appendChild(line);
    }
  }

  setTimeout(() => {
    svg.innerHTML = '';
  }, 1800);
}

function loadGithubRepos() {
  const username = 'tanmayubh';
  const repoContainer = document.getElementById('repo-container');
  if (!repoContainer) return;

  fetch(`https://api.github.com/users/${username}/repos`)
    .then((res) => res.json())
    .then((repos) => {
      if (!Array.isArray(repos)) {
        repoContainer.innerHTML = '<p>Error loading repositories.</p>';
        return;
      }

      const filteredRepos = repos.filter((repo) => !repo.fork);

      filteredRepos.forEach((repo) => {
        const card = document.createElement('div');
        card.className = 'repo-card';

        card.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description || 'No description available.'}</p>
          <div class="repo-meta">${repo.language ? `Language: ${repo.language}` : ''}</div>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        `;

        repoContainer.appendChild(card);
      });
    })
    .catch(() => {
      repoContainer.innerHTML = '<p>Failed to fetch repositories.</p>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  resetFootstepBounds();
  placeNodes();

  if (footstep) {
    animateStep();
  }

  if (svg && nodes.length > 0) {
    connectNodes();
    setInterval(connectNodes, 2200);
  }

  loadGithubRepos();
});

window.addEventListener('resize', () => {
  resetFootstepBounds();
  placeNodes();
});
