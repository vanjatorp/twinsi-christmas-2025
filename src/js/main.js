import { renderStars, renderSnowflakes, setupConfettiCanvas } from './scene.js';
import { populateCalendar, updateCountdown } from './calendar.js';

const ram = navigator.deviceMemory || 2;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion)').matches;
const isSmallScreen = window.innerWidth < 500;
const isLowEnd = ram <= 2 || prefersReducedMotion || isSmallScreen;

if (isLowEnd) {
  document.body.classList.add('low-effects');
}

const starContainer = document.querySelector('.stars');
const snowContainer = document.querySelector('.snowflakes');
const confettiCanvas = setupConfettiCanvas();

renderStars(starContainer);
renderSnowflakes(snowContainer);

const today = new Date();
const currentYear = today.getFullYear();
const now = new Date(currentYear, 11, 5, 12, 0); // testing

populateCalendar(now, currentYear, confettiCanvas);
updateCountdown(now, currentYear);
setInterval(() => updateCountdown(now, currentYear), 1000);

document.querySelector('.gift-modal').addEventListener('pointerdown', (e) => {
  if (e.target.classList.contains('gift-modal') || e.target.classList.contains('close-modal')) {
    const modal = document.querySelector('.gift-modal');
    modal.classList.add('hidden');
    modal.querySelector('.gift-content').innerHTML = '';
    modal.querySelector('.gift-title').textContent = '';
  }
});
