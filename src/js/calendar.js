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

      case 'baristalysvideo':
        content = `
          <div class="gift-box-content">
            <a href="${gift.url}" target="_blank" class="delayed-link">
              <img src="https://img.youtube.com/vi/nc3UBeg13fg/hqdefault.jpg" alt="Watch on YouTube" style="width:100%; border-radius:8px;" />
              <p>✨ Watch the Video on YouTube</p>
            </a>
          </div>
        `;
        break;    
     
      case 'poem1':
        content = `
          <div class="gift-box-content">
              <img src="${gift.url}" alt="Christmas Poem" />
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

      case 'tarot1':
        content = `
          <div class="gift-box-content">
            <p>
              🐾 Twinsi Bear has invited Annette to draw the cards today.  
              Let’s see what they reveal…
            </p>
            <p>
              ✨ <a href="${gift.url}" target="_blank" class="calendar-link">Watch the Reading</a>
            </p>
          </div>
        `;
        break;  
  
      case 'card-challenge':
        content = `
          <div class="gift-box-content">
            <p>
              🐾 Twinsi Bear’s Card Challenge:
            </p>
            <p>
              Today’s gift is one you give away —  
              a Christmas card, handpicked with love.
            </p>
            <p>
              Find someone who wouldn’t expect it — maybe a neighbor, a quiet friend, or someone who’s been on your mind.  
              Give them a card, and with it, a moment of warmth.
            </p>
            <p>
              Twinsi believes in surprise joy — and you’re the perfect messenger. 🐾
            </p>
          </div>
        `;
        break;    

      case 'poem2':
        content = `
          <div class="gift-box-content">
              <img src="${gift.url}" alt="Christmas Poem" />
          </div>
        `;
        break; 

      case 'encouragement1':
        content = `
          <div class="gift-box-content">
            <p>🐾 Twinsi Bear’s Encouragement:</p>
            <p>
              You’ve carried things no one saw.  
              You’ve shown up when it was hard.  
              That’s strength — and it deserves to be honored.
            </p>
            <p>
              Twinsi Bear sees your quiet courage.  
              Let today be a moment of rest — you’ve earned it. 🐾
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
          <p>
            P.S. Twinsi Bear heard it’s someone’s special day today…  
            Happy Birthday, Marte! 🎂🐾
          </p>
        `;

        const dategameEmbed = viewonMobile
          ? `${dategameIntro}
            <a href="${gift.url}" target="_blank" class="calendar-link">
              🎮 Play the (UN)Perfect Date Game
            </a>`
          : `${dategameIntro}
            <iframe
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

      case 'drawing-challenge':
        content = `
          <div class="gift-box-content">
            <p>🎨 Twinsi Bear’s Drawing Challenge:</p>
            <p>
              Today’s gift is a moment of reflection —  
              draw a winter scene or memory that lives in your heart.
            </p>
            <p>
              It could be snowflakes on a window, a walk in the woods,  
              a cozy cup of cocoa, or a moment you’ve never forgotten.
            </p>
            <p>
              Let your pencil follow the feeling.  
              Twinsi Bear will be right here, sketching beside you. 🐾
            </p>
          </div>
        `;
        break;      

      case 'poem3':
        content = `
          <div class="gift-box-content">
              <img src="${gift.url}" alt="Christmas Poem" />
          </div>
        `;
        break;       

      case 'tarot2':
        content = `
          <div class="gift-box-content">
            <p>
              🐾 Twinsi Bear has invited Annette to draw the cards today.  
              Let’s see what they reveal…
            </p>
            <p>
              ✨ <a href="${gift.url}" target="_blank" class="calendar-link">Watch the Reading</a>
            </p>
          </div>
        `;
        break;      

      case 'encouragement2':
        content = `
          <div class="gift-box-content">
            <p>🐾 Twinsi Bear’s Encouragement:</p>
            <p>
              The holidays can be loud.  
              If you need quiet, take it.  
              If you feel heavy, that’s okay.  
              You’re allowed to be real.
            </p>
            <p>
              Twinsi Bear says: You don’t have to sparkle every day.  
              You’re still loved. You’re still magic. 🐾
            </p>
          </div>
        `;
        break;
      
      case 'takeawalk-challenge':
        content = `
          <div class="gift-box-content">
            <p>🐾 Twinsi Bear’s Take-a-Walk Challenge:</p>
            <p>
              Today’s gift is a walk — just a short one.  
              Step outside, or down the hall, or around the block.
            </p>
            <p>
              While you walk, look for one beautiful thing.  
              A frosty window, a dog wagging its tail, a patch of sunlight, a kind smile.
            </p>
            <p>
              You don’t have to go far.  
              Just far enough to notice something good.
            </p>
            <p>
              Twinsi Bear will be walking too — scarf on, nose in the air, looking for beauty. 🐾
            </p>
          </div>
        `;
        break;

      case 'magikerenogmånenvideo':
        content = `
          <div class="gift-box-content">
            <a href="${gift.url}" target="_blank" class="delayed-link">
              <img src="https://img.youtube.com/vi/5p37EXWx2hY/hqdefault.jpg" alt="Watch on YouTube" style="width:100%; border-radius:8px;" />
              <p>✨ Watch the Video on YouTube</p>
            </a>
          </div>
        `;
        break; 

      case 'poem4':
        content = `
          <div class="gift-box-content">
              <img src="${gift.url}" alt="Christmas Poem" />
          </div>
        `;
        break;     

      case 'encouragement3':
        content = `
          <div class="gift-box-content">
            <p>🐾 Twinsi Bear’s Encouragement:</p>
            <p>
              You may not know it,  
              but someone feels calmer when you’re near.  
              You bring warmth. You bring safety.
            </p>
            <p>
              Twinsi Bear wants you to know:  
              You are someone’s safe place. That’s a gift.
              And remember: to be your safe space too.💛 🐾
            </p>
          </div>
        `;
        break;

      case 'reachout-challenge':
        content = `
          <div class="gift-box-content">
            <p>🐾 Twinsi Bear’s Reach-Out Challenge:</p>
            <p>
              Today’s gift is connection.  
              Reach out to someone you miss — with a message, a photo, or just a “thinking of you.”
            </p>
            <p>
              You don’t have to say everything.  
              Just enough to remind them: you’re still here, and they still matter.
            </p>
            <p>
              Twinsi Bear knows it can feel vulnerable.  
              But sometimes, a small hello opens a big door. 🐾
            </p>
          </div>
        `;
        break;

      case 'tarot3':
        content = `
          <div class="gift-box-content">
            <p>
              🐾 Twinsi Bear has invited Annette to draw the cards today.  
              Let’s see what they reveal…
            </p>
            <p>
              ✨ <a href="${gift.url}" target="_blank" class="calendar-link">Watch the Reading</a>
            </p>
          </div>
        `;
        break;   

      case 'ottherlyvideo':
        content = `
          <div class="gift-box-content">
            <a href="${gift.url}" target="_blank" class="delayed-link">
              <img src="https://img.youtube.com/vi/zLyvomM4IlY/hqdefault.jpg" alt="Watch on YouTube" style="width:100%; border-radius:8px;" />
              <p>✨ Watch the Video on YouTube</p>
            </a>
          </div>
        `;
        break; 

      case 'bookgift':
        content = `
         <div class="gift-box-content">
          <p>🐾 Twinsi Bear’s Final Gift:</p>
          <p>
            Today, something special is waiting for you —  
            <strong>Bear & Rabbit: A Fable About Healing and Boundaries</strong>  
            is free on <strong>Kindle</strong> for the next 5 days.
          </p>
          <p>
            This is a heart-led fable about emotional healing, relational repair, and the power of boundaries.  
            It placed <strong>4th in the Hay House writing competition 2025</strong>.
          </p>
          <img src="https://m.media-amazon.com/images/I/71-afjTgIJL._SL1500_.jpg" alt="Bear & Rabbit book cover" style="width:40%; max-width:400px;" />
          <p>
            ✨ <a href="${gift.url}" target="_blank" class="calendar-link">Open the Gift</a>
          </p>
          <p>
            Twinsi Bear hopes it finds you at just the right time.  
            Merry Christmas, dear friend. 🐾
          </p>
        </div>
        `;
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

  // Before December 1 → hide countdown
  if (now < calendarStart) {
    countdownWrapper.style.display = 'none';
    return;
  }

  // From December 1 onward → always show countdown
  countdownWrapper.style.display = 'block';

  // After December 24 → show closing message
  if (now.getDate() > 24 && now.getMonth() === 11) {
    countdownPrefix.textContent = '';
    countdownEl.textContent =
      '🎄 Hope you had a magical Christmas, see you next year! - Vanja & Annette 💛';
    return;
  }

  // On Christmas Eve → special message
  if (isChristmasEve(now)) {
    countdownPrefix.textContent = '';
    countdownEl.textContent = '🎄 Merry Christmas!';
    return;
  }

  // Otherwise → countdown to next midnight
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
