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
    'IMG_2443.JPG', 'IMG_2444.JPG', 'IMG_2448.JPG', 'IMG_2485.PNG', 'IMG_2510.JPG',
    'IMG_2708.JPG', 'IMG_2710.JPG', 'IMG_2719.JPG', 'IMG_2731.JPG', 'IMG_2749.JPG',
    'IMG_2946.JPG', 'IMG_2947.JPG', 'IMG_2954.JPG', 'IMG_2955.JPG', 'IMG_3059.JPG',
    'IMG_3060.JPG', 'IMG_3061.JPG', 'IMG_3062.JPG', 'IMG_3063.JPG', 'IMG_3064.JPG',
    'IMG_3065.JPG', 'IMG_3175.JPG', 'IMG_3176.JPG', 'IMG_3177.JPG', 'IMG_9865.JPG',
    'IMG_9866.JPG'
];

let topZ = 20; // bring-to-front counter (higher than typical defaults)

// Heart shape coordinates (parametric equation)
function getHeartPoints(numPoints) {
    const points = [];
    const scale = 15; // Size of the heart
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

// Initialize photos in heart shape
function initializePhotos() {
    const container = document.getElementById('heartContainer');
    const heartPoints = getHeartPoints(photos.length);
    
    photos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = `cindy/${photo}`;
        img.className = 'photo';
        img.alt = 'Memory';
        
        const point = heartPoints[index];
        img.style.left = `${point.x}px`;
        img.style.top = `${point.y}px`;
        
        // Random animation delay for floating effect
        img.style.animationDelay = `${Math.random() * 2}s`;

        img.addEventListener('pointerdown', () => {
            topZ += 1;
            img.style.zIndex = String(topZ);
        });
        
        container.appendChild(img);
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

