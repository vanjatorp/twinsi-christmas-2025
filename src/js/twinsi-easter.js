// 🎁 🐻 Twinsi Bear Console Easter Egg
console.log(
  "%c   ʕ•ᴥ•ʔ\nTwinsi Bear is watching over your code!\nA tradition wrapped in sparkle and joy",
  "font-size: 18px; color: #fff; background: #2c3e50; padding: 6px; border-radius: 6px;"
);

// ✨ Random Dev Message
const devMessages = [
  "✨ You're off to a magical start!",
  "❄️ Even polar bears do yoga — stretch wisely!",
  "🎄 Code like it's snowing: soft, quiet, beautiful.",
  "🌟 Curious devs deserve extra sparkle!",
  "🎁 You’re officially on the Nice List!"
];
const randomMessage = devMessages[Math.floor(Math.random() * devMessages.length)];
console.log(`%c${randomMessage}`, "font-size: 14px; color: #f1c40f;");

// 🧩 Secret Riddle Hint
console.log(
  "%c🐻 Twinsi Bear has a secret gift for clever coders...\n\nSolve this riddle to unlock it:\n🧩 'To open the map, you must declare your mischief. What do the Marauders say?'\n\nType: twinsi.unlock('your answer here')",
  "font-size: 13px; color: #7f8c8d;"
);

// 🎉 Secret Unlock Logic
window.twinsi = {
  unlock: function (phrase) {
    const secretPhrase = "I swear I am up to no good";
    if (phrase.trim().toLowerCase() === secretPhrase.toLowerCase()) {
      // ⏳ Countdown animation
      const countdown = [
        "🎁 Unlocking gift in 3...",
        "🎁 2...",
        "🎁 1...",
        "🎉 Here it comes!"
      ];
      countdown.forEach((msg, i) => {
        setTimeout(() => {
          console.log(`%c${msg}`, "font-size: 16px; color: #f39c12;");
        }, i * 600);
      });

      // 🎁 Show the gift modal with secret content
      setTimeout(() => {
        const modal = document.querySelector('.gift-modal');
        if (modal) {
          modal.classList.remove('hidden');
          modal.querySelector('.gift-title').textContent = "🎁 Twinsi Bear’s Secret Gift";
          modal.querySelector('.gift-content').innerHTML = `
            <div style="text-align: center; padding: 1rem; font-family: 'Iceberg', sans-serif;">
              <p style="font-size: 1.2rem; margin-bottom: 1rem; color: #fff;">
                You've unlocked a hidden surprise just for the most curious coders!
              </p>
              <a href="/assets/twinsi-gift.pdf" class="download-link" download
                style="display: inline-block; margin: 1rem auto; padding: 0.6rem 1.2rem; background: #fff; color: #c62828; border-radius: 6px; text-decoration: none; font-weight: bold; box-shadow: 0 0 6px rgba(255,255,255,0.6);">
                📥 Download your festive surprise
              </a>
              <p style="margin-top: 2rem; font-size: 1rem; color: #fff;">
                Love, Twinsi 🐻
              </p>
            </div>
          `;

          // 🎉 Confetti now triggers with the modal and appears on top
          const confettiCanvas = document.querySelector('canvas.confetti-canvas');
          if (confettiCanvas) {
            confettiCanvas.style.zIndex = '10000';
          }
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });

          // Wait a moment, then style the canvas
          setTimeout(() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
              canvas.classList.add('confetti-canvas');
              canvas.style.zIndex = '10000';
            }
          }, 50);

        }
      }, countdown.length * 600 + 400);
    } else {
      console.log("%c🐻 Hmm... that's not quite the phrase Twinsi Bear is looking for.", "color: #e67e22;");
    }
  }
};