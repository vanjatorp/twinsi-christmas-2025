import { starPositions, snowflakes,  } from './data.js';

export function renderStars(container) {
  starPositions.forEach(pos => {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.top = pos.top;
    star.style.left = pos.left;
    star.style.animationDelay = pos.delay;
    container.appendChild(star);
  });
}

export function renderSnowflakes(container) {
  snowflakes.forEach(flake => {
    const el = document.createElement('div');
    el.classList.add('snowflake', flake.depth);
    el.textContent = flake.char;
    el.style.setProperty('--drift', flake.drift);
    el.style.left = flake.left;
    el.style.animationDelay = flake.delay;
    container.appendChild(el);
  });
}

export function setupConfettiCanvas() {
  const canvas = document.createElement('canvas');
  canvas.classList.add('confetti-canvas');
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return canvas;
}
