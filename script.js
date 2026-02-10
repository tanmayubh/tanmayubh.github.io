const buttons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active states
    buttons.forEach(b => b.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    // Activate clicked button
    button.classList.add('active');

    // Show corresponding page
    const pageId = button.getAttribute('data-page');
    document.getElementById(pageId).classList.add('active');
  });
});


const footstep = document.getElementById('footstep');
const steps = ['images/steps.png', 'images/steps2.png']; // alternate images
let stepIndex = 0;
let position = window.innerHeight * 0.10; // start at 25% of screen
const endPosition = window.innerHeight * 0.30; // end at 50% of screen
const stepHeight = 15; // pixels each step moves

function animateStep() {
  footstep.src = steps[stepIndex % steps.length];
  stepIndex++;
  footstep.style.top = position + 'px';
  footstep.style.opacity = 1;

  position += stepHeight;

  if (position <= endPosition) {
    setTimeout(() => {
      footstep.style.opacity = 0;
      setTimeout(animateStep, 100); // fade out then next step
    }, 300);
  } else {
    footstep.style.transition = 'none';
    position = window.innerHeight * 0.10;
    footstep.style.top = position + 'px';
    stepIndex = 0
      // Start next step after short delay
    setTimeout(() => {
    footstep.style.transition = 'top 0.2s linear, opacity 0.2s linear';
    animateStep(); // continue walking
  }, 50);
}}
animateStep();


const nodes = document.querySelectorAll('.node');
const svg = document.getElementById('lines');

/* ---- FIXED DIAMOND POSITIONS (6 NODES) ---- */
const diamondPositions = [
  { x: 46.5, y: 45 }, // top
  { x: 36, y: 54 }, // left
  { x: 58, y: 54 }, // right
  { x: 46.5, y: 62 }, // bottom
  { x: 37.5, y: 71 }, // inner left
  { x: 56, y: 71 }  // inner right
];

nodes.forEach((node, index) => {
  const pos = diamondPositions[index];
  node.style.left = pos.x + '%';
  node.style.top = pos.y + '%';
});

/* ---- CONNECT NODES (DYNAMIC LINES ONLY) ---- */
function connectNodes() {
  svg.innerHTML = '';

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() > 0.6) {
        const a = nodes[i].getBoundingClientRect();
        const b = nodes[j].getBoundingClientRect();

        const line = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        );

        line.setAttribute('x1', a.left + a.width / 2);
        line.setAttribute('y1', a.top + a.height / 2);
        line.setAttribute('x2', b.left + b.width / 2);
        line.setAttribute('y2', b.top + b.height / 2);

        svg.appendChild(line);
      }
    }
  }

  setTimeout(() => {
    svg.innerHTML = '';
  }, 1800);
}

// Loop connections
setInterval(connectNodes, 2200);