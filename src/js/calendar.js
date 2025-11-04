import { gifts } from './data.js';
import { formatTime, isBetween } from './utils.js';

export function createBox(day, now, currentYear, confettiCanvas) {
  const box = document.createElement('div');
  box.classList.add('calendar-box');
  box.dataset.day = day;
  box.innerHTML = `<span class="day-number">${day}</span>`;

  const bear = document.createElement('div');
  bear.classList.add('gift-bear');
  bear.innerHTML = `
    <div class="gift-eye gift-eye-l"></div>
    <div class="gift-eye gift-eye-r"></div>
    <div class="gift-nose"></div>
  `;
  box.appendChild(bear);

  const statusIcon = document.createElement('span');
  statusIcon.classList.add('status-icon');
  box.appendChild(statusIcon);

  const unlockTime = new Date(currentYear, 11, day, 0, 1);
  const lockTime = new Date(currentYear, 11, day + 1, 0, 0);

  if (now < unlockTime) {
    box.classList.add('locked');
    statusIcon.textContent = '🔒';
    } else if (isBetween(now, unlockTime, lockTime)) {
    box.classList.add('available');
    statusIcon.textContent = '🌟';
  }   

  const gift = gifts[day - 1];
  box.addEventListener('click', () => {
    if (box.classList.contains('locked') || box.classList.contains('opened')) return;

    box.classList.add('opened');

    let content = '';
    switch (gift.type) {
      case 'music':
        content = `
          <div class="gift-box-content">
            <iframe style="border-radius:12px" 
                    src="https://open.spotify.com/embed/playlist/38NJHtg1gq9NDjAc81QiXH?utm_source=generator" 
                    width="100%" 
                    height="152" 
                    frameborder="0" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy">
            </iframe>
            <p style="margin-top:0.5rem; font-size:1.1rem;">
              ✨<a href="${gift.url}" target="_blank";">Enjoy the Christmas Playlist on Spotify</a>
            </p>
          </div>
        `;
        break;


       case 'video':
        content = `
          <div class="gift-box-content">
            <a href="${gift.url}" target="_blank" style="display:block; text-align:center;">
              <img src="https://img.youtube.com/vi/nc3UBeg13fg/hqdefault.jpg" alt="Watch on YouTube" style="width:100%; border-radius:8px;" />
              <p style="margin-top:0.5rem; font-size:1.2rem;">✨ Watch the Video on YouTube</p>
            </a>
          </div>
        `;
        break;

      case 'game':
        content = `<a href="${gift.url}" target="_blank">🎮 Play Game</a>`;
        break;
      case 'image':
        content = `<img src="${gift.url}" alt="Gift Image" style="width:100%; border-radius:8px;" />`;
        break;
      case 'download':
        content = `<a href="${gift.url}" download>📩 Download Christmas Card</a>`;
        break;
    }

    const modal = document.querySelector('.gift-modal');
    modal.querySelector('.gift-title').textContent = `🎁 Day ${day}`;
    modal.querySelector('.gift-content').innerHTML = content;
    modal.classList.remove('hidden');

    if (now >= unlockTime && now < lockTime) {
      confetti.create(confettiCanvas, { resize: true })({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  });

  return box;
}

export function populateCalendar(now, currentYear, confettiCanvas) {
  const calendar = document.querySelector('.advent-calendar');
  for (let i = 1; i <= 24; i++) {
    calendar.appendChild(createBox(i, now, currentYear, confettiCanvas));
  }
}

export function updateCountdown(now, currentYear) {
  const countdownEl = document.getElementById('countdown');
  const countdownWrapper = document.querySelector('.countdown-timer');
  const calendarStart = new Date(currentYear, 11, 1, 0, 0);

  if (now < calendarStart) {
    countdownWrapper.style.display = 'none';
    return;
  }

  const nextUnlock = new Date(currentYear, now.getMonth(), now.getDate() + 1, 0, 1);
  const diff = nextUnlock - now;

  if (diff <= 0) {
    countdownEl.textContent = '🎁 Today\'s gift is ready!';
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownEl.textContent = formatTime(totalSeconds);
}
