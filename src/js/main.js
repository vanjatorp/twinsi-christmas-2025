import { renderStars, renderSnowflakes, setupConfettiCanvas } from './scene.js';
import { populateCalendar, updateCountdown } from './calendar.js';

const ram = navigator.deviceMemory;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion)').matches;
const isSmallScreen = window.innerWidth < 375;

const isLowEnd =
  (typeof ram === 'number' && ram <= 2) ||
  prefersReducedMotion ||
  isSmallScreen;

if (isLowEnd) {
  document.body.classList.add('low-effects');
}

const starContainer = document.querySelector('.stars');
const snowContainer = document.querySelector('.snowflakes');
export let confettiCanvas = null;

renderStars(starContainer);
renderSnowflakes(snowContainer);

const currentYear = new Date().getFullYear();
const now = new Date(currentYear, 11, 23, 23, 59); // Dec 23, 23:59 Change for testing

// Initial render
document.querySelector('.advent-calendar').innerHTML = '';
populateCalendar(now, currentYear, confettiCanvas);
updateCountdown(now, currentYear);

// Time ticking forward
let lastDay = now.getDate();
let lastMinute = now.getMinutes();

const intervalId = setInterval(() => {
  now.setSeconds(now.getSeconds() + 1);
  updateCountdown(now, currentYear);

  const currentDay = now.getDate();
  const currentMinute = now.getMinutes();

  if (currentDay !== lastDay || currentMinute !== lastMinute) {
    lastDay = currentDay;
    lastMinute = currentMinute;
    document.querySelector('.advent-calendar').innerHTML = '';
    populateCalendar(now, currentYear, confettiCanvas);
  }

  // console.log('time:', now.toLocaleString());

  // Stop ticking after Dec 24
  if (now.getDate() >= 24 && now.getMonth() === 11) {
    clearInterval(intervalId);
    //console.log('🎄 Calendar complete. No more updates.');
  }
}, 1000);

// Modal close handler
document.querySelector('.gift-modal').addEventListener('pointerdown', (e) => {
  if (e.target.classList.contains('gift-modal') || e.target.classList.contains('close-modal')) {
    const modal = document.querySelector('.gift-modal');
    modal.classList.add('hidden');
    modal.querySelector('.gift-content').innerHTML = '';
    modal.querySelector('.gift-title').textContent = '';
  }
});