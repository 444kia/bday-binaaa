document.addEventListener('DOMContentLoaded', () => {

  // --- Element Selectors ---
  const introScreen = document.getElementById('intro-screen');
  const welcomeOverlay = document.getElementById('welcome-overlay');
  const openBtn = document.getElementById('open-btn');
  const mainContent = document.getElementById('main-content');
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = musicToggle.querySelector('.music-icon');

  const envelope = document.getElementById('envelope');
  const closeLetterBtn = document.getElementById("close-letter-btn");

  const daysVal = document.getElementById('days');
  const hoursVal = document.getElementById('hours');
  const minutesVal = document.getElementById('minutes');
  const secondsVal = document.getElementById('seconds');
  const countdownContainer = document.getElementById('countdown');
  const specialDayMsg = document.getElementById('special-day-msg');

  introScreen.addEventListener('click', () => {

    introScreen.classList.add('hide');

  });

  // --- 1. Welcome Overlay & Music Auto-play ---
  // --- 1. Welcome Overlay & Music Auto-play ---
  openBtn.addEventListener('click', () => {
    // Fade out overlay
    welcomeOverlay.classList.add('hide');

    // Hapus class hidden-nya dan langsung paksa opacity jadi 1
    mainContent.classList.remove('fade-in-hidden');
    mainContent.classList.add('fade-in-visible');
    mainContent.style.opacity = '1';

    // Play background music
    playMusic();

    // Start canvas animation
    initCupcakeRain();
  });

  // --- 2. Background Music Controller ---
  function playMusic() {
    bgMusic.play()
      .then(() => {
        musicIcon.classList.add('playing');
      })
      .catch(err => {
        console.log("Autoplay blocked or audio load error:", err);
      });
  }

  function pauseMusic() {
    bgMusic.pause();
    musicIcon.classList.remove('playing');
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  // --- 3. Interactive Envelope / Letter ---
  // Klik amplop untuk membuka
  envelope.addEventListener('click', (e) => {
    // Jika mengklik isi surat, jangan ditutup otomatis
    if (e.target.closest('.letter-body')) {
      return;
    }
    if (!envelope.classList.contains("open")) {
      envelope.classList.add("open");
    }
  });

  // Klik tombol silang untuk menutup surat (AMANKAN DI DALAM DOM CONTENT)
  if (closeLetterBtn) {
    closeLetterBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Mencegah konflik klik dengan elemen amplop di bawahnya
      envelope.classList.remove("open");
    });
  }

  // --- 4. Countdown Timer to June 10, 2026 ---
  const targetDate = new Date('2026-06-26T00:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      // Hari H spesial!
      if (countdownContainer) countdownContainer.classList.add('hidden');
      if (specialDayMsg) specialDayMsg.classList.remove('hidden');
      clearInterval(timerInterval);
      // 'return;' TELAH DIHAPUS agar fungsi canvas & scroll di bawah tidak ikut mati!
    } else {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (daysVal) daysVal.textContent = days.toString().padStart(2, '0');
      if (hoursVal) hoursVal.textContent = hours.toString().padStart(2, '0');
      if (minutesVal) minutesVal.textContent = minutes.toString().padStart(2, '0');
      if (secondsVal) secondsVal.textContent = seconds.toString().padStart(2, '0');
    }
  }

  updateCountdown(); // Run immediately
  const timerInterval = setInterval(updateCountdown, 1000);
  // --- 5. Cupcake Rain Canvas Animation ---
  const canvas = document.getElementById('cupcake-canvas');
  const ctx = canvas.getContext('2d');
  let cupcakes = [];
  const cupcakeEmojis = ['🧁', '✨', '🤍', '🍰', '🌸'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Cupcake {
    constructor() {
      this.reset();
      this.y = Math.random() * -canvas.height; // Spread initially above screen
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -50;
      this.size = Math.random() * 20 + 15;
      this.speedY = Math.random() * 1.5 + 1; // Fall speed
      this.speedX = Math.random() * 1 - 0.5; // Sway side to side
      this.emoji = cupcakeEmojis[Math.floor(Math.random() * cupcakeEmojis.length)];
      this.opacity = Math.random() * 0.5 + 0.3; // Gentle opacity
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = Math.random() * 0.02 - 0.01;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > canvas.height + 50 || this.x < -50 || this.x > canvas.width + 50) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = this.opacity;
      ctx.fillText(this.emoji, 0, 0);
      ctx.restore();
    }
  }

  function initCupcakeRain() {
    cupcakes = [];
    const count = Math.min(50, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
      cupcakes.push(new Cupcake());
    }
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cupcakes.forEach(cupcake => {
      cupcake.update();
      cupcake.draw();
    });
    requestAnimationFrame(animate);
  }

  // --- 6. Scroll Triggered Elements Reveal ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

});