/* ===================================================
   Valentine Cinematic Experience — Script
   =================================================== */

// ——————————————— Configuration ———————————————
const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0: hopeful
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1: confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2: pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3: sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4: sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5: devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6: very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7: crying
];

const noMessages = [
    "No",
    "Are you sure? 🤔",
    "Please reconsider... 🥺",
    "You're breaking my heart...",
    "I'll be so sad... 😢",
    "Please??? 💔",
    "Don't do this to me...",
    "Last chance... 😭",
    "You can't escape this 💕"
];

// Character animation classes for each "No" stage
const characterAnimations = [
    "",                    // 0: normal
    "",                    // 1: still normal
    "character-sad",       // 2: starts sad sway
    "character-sad",       // 3: sad
    "character-tearup",    // 4: tearing up
    "character-tearup",    // 5: more tears
    "character-devastated",// 6: devastated
    "character-devastated",// 7: devastated
    "character-devastated" // 8: max devastated
];

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out on the drama 😈",
    "click no, I dare you 😏"
];

// ——————————————— State ———————————————
let noClickCount = 0;
let yesTeasedCount = 0;
let runawayEnabled = false;
let musicPlaying = false;
let currentScene = 'scene-intro';

// ——————————————— DOM Elements ———————————————
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicIconOn = document.getElementById('music-icon-on');
const musicIconOff = document.getElementById('music-icon-off');

// ——————————————— Particles System ———————————————
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // scatter initially
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = -(Math.random() * 0.4 + 0.1);
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.fadeDir = Math.random() > 0.5 ? 1 : -1;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.opacity += this.fadeDir * 0.002;
            if (this.opacity >= 0.5) this.fadeDir = -1;
            if (this.opacity <= 0.05) this.fadeDir = 1;
            if (this.y < -10) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(244, 160, 176, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const count = Math.min(Math.floor(window.innerWidth / 10), 80);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animId = requestAnimationFrame(animate);
    }
    animate();
})();

// ——————————————— Music System ———————————————
music.volume = 0.3;

// Try to autoplay (muted first to bypass browser policy)
music.muted = true;
music.play().then(() => {
    music.muted = false;
    musicPlaying = true;
    updateMusicIcon();
}).catch(() => {
    // Unmute on first interaction
    document.addEventListener('click', function firstClick() {
        music.muted = false;
        music.play().then(() => {
            musicPlaying = true;
            updateMusicIcon();
        }).catch(() => { });
        document.removeEventListener('click', firstClick);
    });
});

function updateMusicIcon() {
    if (musicPlaying) {
        musicIconOn.style.display = '';
        musicIconOff.style.display = 'none';
    } else {
        musicIconOn.style.display = 'none';
        musicIconOff.style.display = '';
    }
}

function toggleMusic() {
    if (musicPlaying) {
        music.pause();
        musicPlaying = false;
    } else {
        music.muted = false;
        music.play();
        musicPlaying = true;
    }
    updateMusicIcon();
}

musicToggle.addEventListener('click', toggleMusic);

// ——————————————— Scene Transitions ———————————————
function transitionTo(sceneId) {
    const current = document.getElementById(currentScene);
    const next = document.getElementById(sceneId);
    if (!current || !next) return;

    // Reset fade-in classes for next scene
    next.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
    });

    current.classList.remove('active');

    setTimeout(() => {
        next.classList.add('active');
        currentScene = sceneId;

        // Trigger fade-ins by removing inline styles
        setTimeout(() => {
            next.querySelectorAll('.fade-in').forEach(el => {
                el.style.opacity = '';
                el.style.transform = '';
            });
        }, 100);
    }, 1400); // match CSS transition duration
}

// Scene navigation buttons
document.getElementById('btn-begin')?.addEventListener('click', () => transitionTo('scene-story'));
document.getElementById('btn-next-1')?.addEventListener('click', () => transitionTo('scene-deeper'));
document.getElementById('btn-next-2')?.addEventListener('click', () => transitionTo('scene-question'));

// ——————————————— Yes / No Logic ———————————————
const characterImg = document.getElementById('character-img');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

function handleYesClick() {
    if (!runawayEnabled) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)];
        yesTeasedCount++;
        showTeaseMessage(msg);
        return;
    }
    triggerYesSequence();
}

function showTeaseMessage(msg) {
    const toast = document.getElementById('tease-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function handleNoClick() {
    noClickCount++;

    // Update No button text
    const msgIndex = Math.min(noClickCount, noMessages.length - 1);
    noBtn.textContent = noMessages[msgIndex];

    // Grow Yes button
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = `${currentSize * 1.3}px`;
    const padY = Math.min(16 + noClickCount * 4, 50);
    const padX = Math.min(48 + noClickCount * 8, 100);
    yesBtn.style.padding = `${padY}px ${padX}px`;

    // Shrink No button
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize);
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`;
    }

    // Swap character GIF
    const gifIndex = Math.min(noClickCount, gifStages.length - 1);
    swapCharacter(gifStages[gifIndex]);

    // Apply character animation class
    const animIndex = Math.min(noClickCount, characterAnimations.length - 1);
    characterImg.className = '';
    if (characterAnimations[animIndex]) {
        characterImg.classList.add(characterAnimations[animIndex]);
    }

    // Enable runaway at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway();
        runawayEnabled = true;
    }
}

function swapCharacter(src) {
    characterImg.style.opacity = '0';
    characterImg.style.transform = 'scale(0.9)';
    setTimeout(() => {
        characterImg.src = src;
        characterImg.style.opacity = '1';
        characterImg.style.transform = '';
    }, 600);
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway);
    noBtn.addEventListener('touchstart', runAway, { passive: true });
}

function runAway() {
    const margin = 20;
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;
    const maxX = window.innerWidth - btnW - margin;
    const maxY = window.innerHeight - btnH - margin;
    const randomX = Math.random() * maxX + margin / 2;
    const randomY = Math.random() * maxY + margin / 2;

    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.zIndex = '50';
}

yesBtn?.addEventListener('click', handleYesClick);
noBtn?.addEventListener('click', handleNoClick);

// ——————————————— Yes Sequence — Heart Animation + Love Letter ———————————————
function triggerYesSequence() {
    // Start heart burst animation
    launchHearts();

    // Transition to love letter scene
    setTimeout(() => {
        transitionTo('scene-yes');
    }, 800);
}

function launchHearts() {
    const canvas = document.getElementById('hearts-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hearts = [];
    const colors = ['#e8647c', '#f4a0b0', '#d45070', '#f9d4dc', '#d4a55a', '#f0d9a8'];

    function createHeart(x, y) {
        return {
            x: x || Math.random() * canvas.width,
            y: y || canvas.height + 20,
            size: Math.random() * 18 + 8,
            speedY: -(Math.random() * 3 + 1.5),
            speedX: (Math.random() - 0.5) * 2,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.06,
            opacity: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            fadeRate: Math.random() * 0.005 + 0.003
        };
    }

    // Initial burst from center
    for (let i = 0; i < 60; i++) {
        const h = createHeart(canvas.width / 2 + (Math.random() - 0.5) * 120,
            canvas.height / 2 + (Math.random() - 0.5) * 80);
        h.speedY = -(Math.random() * 5 + 2);
        h.speedX = (Math.random() - 0.5) * 6;
        hearts.push(h);
    }

    // Continuous stream
    let spawnTimer = setInterval(() => {
        for (let i = 0; i < 3; i++) {
            hearts.push(createHeart());
        }
    }, 200);

    setTimeout(() => clearInterval(spawnTimer), 8000);

    function drawHeart(ctx, x, y, size, rotation, color, opacity) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        const s = size / 50;
        ctx.moveTo(0, -10 * s);
        ctx.bezierCurveTo(-25 * s, -25 * s, -50 * s, 0, 0, 30 * s);
        ctx.moveTo(0, -10 * s);
        ctx.bezierCurveTo(25 * s, -25 * s, 50 * s, 0, 0, 30 * s);
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = hearts.length - 1; i >= 0; i--) {
            const h = hearts[i];
            h.y += h.speedY;
            h.x += h.speedX;
            h.rotation += h.rotSpeed;
            h.opacity -= h.fadeRate;
            if (h.opacity <= 0 || h.y < -50) {
                hearts.splice(i, 1);
                continue;
            }
            drawHeart(ctx, h.x, h.y, h.size, h.rotation, h.color, h.opacity);
        }
        if (hearts.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    animate();
}
