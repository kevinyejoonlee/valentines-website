// All photo filenames
const photos = [
    'IMG_0393.JPG', 'IMG_0394.JPG', 'IMG_0397.JPG', 'IMG_0398.JPG', 'IMG_0409.JPG',
    'IMG_0422.JPG', 'IMG_0427.JPG', 'IMG_0429.JPG', 'IMG_0435.JPG', 'IMG_0436.JPG',
    'IMG_0438.JPG', 'IMG_0459.JPG', 'IMG_0632.JPG', 'IMG_0641.JPG', 'IMG_0642.JPG',
    'IMG_0643.JPG', 'IMG_0712.JPG', 'IMG_0747.JPG', 'IMG_0748.JPG', 'IMG_0749.JPG',
    'IMG_0757.JPG', 'IMG_0759.JPG', 'IMG_0760.JPG', 'IMG_0762.JPG', 'IMG_0764.JPG',
    'IMG_0766.JPG', 'IMG_0789.JPG', 'IMG_0790.JPG', 'IMG_0791.JPG', 'IMG_0979.JPG',
    'IMG_1017.JPG', 'IMG_1018.JPG', 'IMG_1023.JPG', 'IMG_1024.JPG', 'IMG_1043.JPG',
    'IMG_1044.JPG', 'IMG_1069.JPG', 'IMG_1085.JPG', 'IMG_1090.JPG', 'IMG_1097.JPG',
    'IMG_1098.JPG', 'IMG_1108.JPG', 'IMG_1130.JPG', 'IMG_1131.JPG', 'IMG_1136.JPG',
    'IMG_1138.JPG', 'IMG_1224.JPG', 'IMG_1309.JPG', 'IMG_1311.JPG',
    'IMG_1478.JPG', 'IMG_1479.JPG', 'IMG_1507.JPG', 'IMG_1509.JPG', 'IMG_1510.JPG',
    'IMG_1511.JPG', 'IMG_1521.JPG', 'IMG_1792.JPG', 'IMG_1807.JPG', 'IMG_1813.JPG',
    'IMG_1814.JPG', 'IMG_1817.JPG', 'IMG_1818.JPG', 'IMG_1994.PNG', 'IMG_2142.JPG',
    'IMG_2143.JPG', 'IMG_2146.JPG', 'IMG_2165.JPG', 'IMG_2166.JPG', 'IMG_2172.JPG',
    'IMG_2191.JPG', 'IMG_2197.JPG', 'IMG_2199.JPG', 'IMG_2214.JPG', 'IMG_2215.JPG',
    'IMG_2219.JPG', 'IMG_2230.JPG', 'IMG_2250.JPG', 'IMG_2274.PNG', 'IMG_2323.JPG',
    'IMG_2443.JPG', 'IMG_2444.JPG', 'IMG_2448.JPG', 'IMG_2510.JPG',
    'IMG_2708.JPG', 'IMG_2710.JPG', 'IMG_2719.JPG', 'IMG_2731.JPG', 'IMG_2749.JPG',
    'IMG_2946.JPG', 'IMG_2947.JPG', 'IMG_2954.JPG', 'IMG_2955.JPG', 'IMG_3059.JPG',
    'IMG_3060.JPG', 'IMG_3061.JPG', 'IMG_3062.JPG', 'IMG_3063.JPG', 'IMG_3064.JPG',
    'IMG_3065.JPG', 'IMG_3175.JPG', 'IMG_3176.JPG', 'IMG_3177.JPG', 'IMG_9865.JPG',
    'IMG_9866.JPG'
];

const TRANSPARENT_GIF =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

// Plain-HTML version: your full photo set currently lives in ./public/cindy/
// so the browser path is "public/cindy/<filename>" when loading index.html from repo root.
const PHOTO_BASE = 'public/cindy';
let topZ = 20; // bring-to-front counter (higher than hover z-index)

// Heart shape coordinates (parametric equation)
function getHeartPoints(numPoints) {
    const points = [];
    // Responsive scale: larger on big screens, still fits on small screens.
    const scale = Math.max(
        12,
        Math.min(window.innerWidth / 32, window.innerHeight / 34) * 0.9
    );
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 - 50;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2;
        
        // Parametric heart equation
        const x = scale * 16 * Math.pow(Math.sin(t), 3);
        const y = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        
        points.push({
            x: centerX + x,
            y: centerY + y
        });
    }
    
    return points;
}

function ensureLightbox() {
    let lightbox = document.getElementById('lightbox');
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
        <div class="lightbox__backdrop" data-close></div>
        <figure class="lightbox__content" role="dialog" aria-modal="true" aria-label="Zoomed photo">
            <button class="lightbox__close" type="button" aria-label="Close" data-close>×</button>
            <img class="lightbox__img" alt="Zoomed memory" />
        </figure>
    `;

    document.body.appendChild(lightbox);

    const close = () => closeLightbox();

    lightbox.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.closest('[data-close]')) close();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    return lightbox;
}

function openLightbox(src) {
    const lightbox = ensureLightbox();
    const img = lightbox.querySelector('.lightbox__img');
    if (!(img instanceof HTMLImageElement)) return;

    img.src = src;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const img = lightbox.querySelector('.lightbox__img');
    if (img instanceof HTMLImageElement) {
        img.removeAttribute('src');
    }

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
}

function progressiveLoadImages(container, priorityCount = 18) {
    const imgs = Array.from(container.querySelectorAll('img.photo'));
    let i = 0;

    const loadNext = (count) => {
        for (let j = 0; j < count && i < imgs.length; j += 1, i += 1) {
            const img = imgs[i];
            const src = img.dataset.src;
            if (!src) continue;
            img.src = src;
            img.addEventListener(
                'load',
                () => {
                    img.classList.remove('photo--loading');
                },
                { once: true }
            );
        }
    };

    // Load a small batch immediately, then defer the rest.
    loadNext(Math.max(0, Math.min(priorityCount, imgs.length)));

    const schedule = () => {
        if (i >= imgs.length) return;
        // Load a few at a time so we don't spike bandwidth/CPU.
        loadNext(6);
        if (i < imgs.length) {
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(schedule, { timeout: 1500 });
            } else {
                window.setTimeout(schedule, 150);
            }
        }
    };

    if (i < imgs.length) {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(schedule, { timeout: 800 });
        } else {
            window.setTimeout(schedule, 150);
        }
    }
}

// Initialize photos in heart shape
function initializePhotos() {
    const container = document.getElementById('heartContainer');
    const heartPoints = getHeartPoints(photos.length);
    
    photos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = TRANSPARENT_GIF;
        img.dataset.src = `${PHOTO_BASE}/${photo}`;
        img.className = 'photo';
        img.alt = 'Memory';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.fetchPriority = 'low';
        
        const point = heartPoints[index];
        img.style.left = `${point.x}px`;
        img.style.top = `${point.y}px`;
        
        // Random animation delay for floating effect
        img.style.animationDelay = `${Math.random() * 2}s`;

        img.classList.add('photo--loading');
        img.addEventListener('pointerdown', () => {
            topZ += 1;
            img.style.zIndex = String(topZ);
        });
        img.addEventListener('click', () => {
            const src = img.dataset.src;
            if (src) openLightbox(src);
        });
        
        container.appendChild(img);
    });

    progressiveLoadImages(container);
}

function initializeValentinePrompt() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const buttons = document.getElementById('valentineButtons');
    const question = document.getElementById('valentineQuestion');
    const result = document.getElementById('valentineResult');

    if (!(yesBtn instanceof HTMLButtonElement)) return;
    if (!(noBtn instanceof HTMLButtonElement)) return;

    let noCount = 0;

    const applyYesScale = () => {
        const scale = Math.min(1 + noCount * 0.28, 3.75);
        yesBtn.style.transform = `scale(${scale})`;
    };

    noBtn.addEventListener('click', () => {
        noCount += 1;
        applyYesScale();
    });

    yesBtn.addEventListener('click', () => {
        if (question instanceof HTMLElement) {
            question.textContent = 'Yay!';
        }
        if (result instanceof HTMLElement) {
            result.textContent = 'See you then!';
        }
        if (buttons instanceof HTMLElement) {
            buttons.hidden = true;
        }
    });
}

// Adjust positions on window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('heartContainer');
    container.innerHTML = '';
    initializePhotos();
});

// Initialize when page loads
initializePhotos();
initializeValentinePrompt();
