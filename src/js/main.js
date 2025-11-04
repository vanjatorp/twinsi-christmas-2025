// main.js
import { renderStars, renderSnowflakes, setupConfettiCanvas } from './scene.js';
import { populateCalendar, updateCountdown } from './calendar.js';

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

document.querySelector('.gift-modal').addEventListener('click', (e) => {
  if (e.target.classList.contains('gift-modal') || e.target.classList.contains('close-modal')) {
    const modal = document.querySelector('.gift-modal');
    modal.classList.add('hidden');
    modal.querySelector('.gift-content').innerHTML = '';
    modal.querySelector('.gift-title').textContent = '';
    document.querySelectorAll('.calendar-box.opened').forEach(box => box.classList.remove('opened'));
  }
});
