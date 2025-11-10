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
   // console.log(`Box ${day}: isToday = ${isToday}`);

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

      case 'badge':
        content = `
          <div class="gift-box-content">
            <div class="shiny-badge">
              <img src="${gift.url}" alt="Participation Badge" class="bobbling-badge" />
            </div>
            <p>
              🐾 Twinsi Bear welcomes you to the calendar!  
              Here’s your badge for joining the adventure — show it with pride.
            </p>
            <p>
              ✨<a href="${gift.url}">Download Your Badge</a>
            </p>
          </div>
        `;
        break;
      
      case 'compliment-challenge':
        content = `
          <div class="gift-box-content">
            <p>
              🐾 Twinsi Bear’s Compliment Challenge:
            </p>
            <p>
              ✨ Give someone a heartfelt compliment today —  
              something that makes them feel truly seen.
            </p>
            <p>
              You never know how much a kind word can mean.  
              Twinsi believes in your sparkle.
            </p>
          </div>
        `;
        break;
  
      case 'card':
        content = `
          <div class="gift-box-content">
            <div class="bobbling-badge">
              <img src="${gift.url}" alt="Christmas Card" />
            </div>  
            <p>
              🐾 Twinsi Bear is wishing you a Merry Christmas —  
              may it be full of laughter, love, and twinkling lights. 
              Share this card with someone who makes your heart smile. 
            </p>
            <p>
              ✨<a href="${gift.url}">Download Your Christmas Card</a>
            </p>
          </div>
        `;
        break;

      case 'christmas-game':
        const isMobile = window.innerWidth < 768;

        const gameIntro = `
          <p>
            🐾 Twinsi Bear has a special surprise for you —  
            a magical Christmas game where cookies fall from the sky and sparkle fills the air.  
            Catch as many as you can, and see if you can find the golden bonus cookie before time runs out!
          </p>
        `;

        const gameEmbed = isMobile
          ? `${gameIntro}
            <a href="${gift.url}" target="_blank" class="calendar-link">
              🎮 Play Twinsi’s Cookie Catch
            </a>`
          : `<iframe
              src="${gift.url}"
              width="320"
              height="480">
            </iframe>`;

        const fullGameLink = isMobile
          ? ''
          : `<p>
              🎮 <a href="${gift.url}" class="calendar-link" target="_blank">Open Full Game</a>
            </p>`;

        content = `
          <div class="gift-box-content">
            ${gameEmbed}
            ${fullGameLink}
          </div>
        `;
        break;

      case 'poem':
        content = `
          <div class="gift-box-content">
            <div class="shiny-badge">
              <img src="${gift.url}" alt="Participation Badge" class="bobbling-badge" />
            </div>
            <p>
              🐾 Twinsi Bear welcomes you to the calendar!  
              Here’s your badge for joining the adventure — show it with pride.
            </p>
            <p>
              ✨<a href="${gift.url}">Download Your Badge</a>
            </p>
          </div>
        `;
        break;    

      case 'unperfectdate-game':
        const viewonMobile = window.innerWidth < 768;

        const dategameIntro = `
          <p style="margin-bottom:1rem;">
            🐾 Twinsi Bear has something a little quirky for you today —  
            a not-so-perfect date game full of awkward moments, and unexpected joy.  
            Choose your path and see where it leads!
          </p>
        `;

        const dategameEmbed = viewonMobile
          ? `${dategameIntro}
            <a href="${gift.url}" target="_blank" class="calendar-link">
              🎮 Play the (UN)Perfect Date Game
            </a>`
          : `<iframe
              src="${gift.url}"
              width="320"
              height="480">
            </iframe>`;

        const datefullGameLink = viewonMobile
          ? ''
          : `<p>
              🎮 <a href="${gift.url}" class="calendar-link" target="_blank">Open Full Game</a>
            </p>`;

        content = `
          <div class="gift-box-content">
            ${dategameEmbed}
            ${datefullGameLink}
          </div>
        `;
        break;        

      case 'video':
        content = `
          <div class="gift-box-content">
            <a href="${gift.url}" target="_blank" class="delayed-link">
              <img src="https://img.youtube.com/vi/nc3UBeg13fg/hqdefault.jpg" alt="Watch on YouTube" style="width:100%; border-radius:8px;" />
              <p>✨ Watch the Video on YouTube</p>
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
