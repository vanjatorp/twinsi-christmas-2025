import { gifts } from './data.js';
import { formatTime, isBetween } from './utils.js';
import { setupConfettiCanvas } from './scene.js';
import { confettiCanvas } from './main.js';

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

  const unlockTime = new Date(currentYear, 11, day, 0, 0);
  const lockTime = new Date(currentYear, 11, day + 1, 0, 0);
  const isToday =
    now.getDate() === day &&
    now.getMonth() === 11 &&
    now.getFullYear() === currentYear;
    console.log(`Box ${day}: isToday = ${isToday}`);


  if (now < unlockTime) {
    box.classList.add('locked');
    statusIcon.textContent = '🔒';
  } else {
    box.classList.add('available');
    if (isToday) { 
      box.classList.add('today');
      statusIcon.textContent = '🌟'; 
    }
  }
  
  const gift = gifts[day - 1];
  box.addEventListener('pointerdown', () => {
    if (box.classList.contains('locked')) return;

    const isFirstOpen = !box.classList.contains('opened');
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
            <a href="${gift.url}" target="_blank" class="delayed-link" style="pointer-events:none; display:block; text-align:center;">
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
    const modalContent = modal.querySelector('.gift-modal-content');

    requestAnimationFrame(() => {
      modal.classList.remove('hidden');
      modalContent.classList.remove('animate');
      modal.querySelector('.gift-title').textContent = `🎁 Day ${day}`;
      modal.querySelector('.gift-content').innerHTML = content;
      modalContent.classList.add('animate');
    });

    // Delay link activation to prevent accidental clicks during animation
    setTimeout(() => {
      modal.querySelector('.delayed-link')?.style.setProperty('pointer-events', 'auto');
    }, 300);


    if (now >= unlockTime && now < lockTime) {
      if (!confettiCanvas) {
        confettiCanvas = setupConfettiCanvas();
      }

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
  calendar.innerHTML = ''; // Clear old boxes
  for (let i = 1; i <= 24; i++) {
    calendar.appendChild(createBox(i, now, currentYear, confettiCanvas));
  }
}

function isChristmasEve(date) {
  return date.getDate() === 24 && date.getMonth() === 11;
}

export function updateCountdown(now, currentYear) {
  const countdownEl = document.getElementById('countdown');
  const countdownPrefix = document.getElementById('countdown-prefix');
  const countdownWrapper = document.querySelector('.countdown-timer');
  const calendarStart = new Date(currentYear, 11, 1, 0, 0);

  if (now < calendarStart) {
    countdownWrapper.style.display = 'none';
    return;
  }
  if (now.getDate() > 24 && now.getMonth() === 11) {
    countdownPrefix.textContent = '';
    countdownEl.textContent = '🎄 Hope you had a magical Christmas, see you next year! - Vanja & Annette 💛';
    return;
  }
  if (isChristmasEve(now)) {
    countdownPrefix.textContent = '';
    countdownEl.textContent = '🎄 Merry Christmas!';
    return;
  }


  const nextUnlock = new Date(now);
  nextUnlock.setDate(now.getDate() + 1);
  nextUnlock.setHours(0, 0, 0, 0);

  const diff = nextUnlock - now;

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownPrefix.textContent = 'New 🎁 in: ';
  countdownEl.textContent = formatTime(totalSeconds);
}
