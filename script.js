// Initialize Three.js scene for stars
let scene, camera, renderer;
let stars = [];
let starSettings = {
    count: 2000,
    speed: 0.1,
    size: 0.7
};

// Loading screen elements
let loadingScreen, waterElement, progressBar, progressText;

// Initialize the application
function init() {
    // Get loading screen elements
    loadingScreen = document.querySelector('.loading-screen');
    waterElement = document.querySelector('.water');
    progressBar = document.querySelector('.progress');
    progressText = document.querySelector('.progress-text');
    
    // Start loading animation
    startLoadingAnimation();
}

// Start loading animation
function startLoadingAnimation() {
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 1;
        if (progress <= 100) {
            updateLoadingProgress(progress);
            
            if (progress === 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    finishLoading();
                }, 500);
            }
        }
    }, 15);
}

// Update loading progress
function updateLoadingProgress(progress) {
    // Update water level
    waterElement.style.height = `${progress}%`;
    
    // Update progress bar
    progressBar.style.width = `${progress}%`;
    
    // Update progress text
    progressText.textContent = `${progress}%`;
}

// Finish loading and show main content
function finishLoading() {
    // Fade out loading screen
    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
            loadingScreen.style.display = 'none';
            initMainContent();
        }
    });
}

// Initialize main content
function initMainContent() {
    // Set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('stars-container').appendChild(renderer.domElement);
    
    // Create stars
    createStars();
    
    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
    
    // Initialize GSAP animations and scroll effects
    initAnimations();
}

// Create stars
function createStars() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i < starSettings.count; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        
        vertices.push(x, y, z);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: starSettings.size,
        transparent: true
    });
    
    stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    stars.rotation.x += 0.0005 * starSettings.speed;
    stars.rotation.y += 0.0005 * starSettings.speed;
    stars.rotation.z += 0.0005 * starSettings.speed;
    
    renderer.render(scene, camera);
}

// Initialize animations
function initAnimations() {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Initialize GSAP animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero section animations
        gsap.from('.hero-title', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.5
        });
        
        gsap.from('.hero-description', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.8
        });
        
        gsap.from('.cta-button', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 1.1
        });
        
        gsap.from('.hero-image', {
            opacity: 0,
            x: 50,
            duration: 1.5,
            delay: 0.7
        });
        
        // Animate benefit cards on scroll
        const benefitCards = document.querySelectorAll('.benefit-card');
        if (benefitCards.length > 0) {
            gsap.utils.toArray('.benefit-card').forEach(card => {
                gsap.from(card, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            });
        }
        
        // Animate tips on scroll
        const tips = document.querySelectorAll('.tip');
        if (tips.length > 0) {
            gsap.utils.toArray('.tip').forEach(tip => {
                gsap.from(tip, {
                    opacity: 0,
                    x: -50,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: tip,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                });
            });
        }
    }
    
    // Parallax effect for stars
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.0005;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.0005;
        
        if (stars) {
            stars.rotation.x += moveY * starSettings.speed;
            stars.rotation.y += moveX * starSettings.speed;
        }
    });
    
    // CTA button animation
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const benefitsSection = document.getElementById('benefits');
            if (benefitsSection) {
                benefitsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Force show all sections after loading
    setTimeout(() => {
        const allSections = document.querySelectorAll('section');
        allSections.forEach(section => {
            section.style.opacity = '1';
            section.style.visibility = 'visible';
        });
    }, 1000);
}

// Start the application when the page loads
window.addEventListener('load', init);

// Fallback in case GSAP doesn't load properly
window.addEventListener('DOMContentLoaded', function() {
    // If GSAP didn't load after 3 seconds, show content anyway
    setTimeout(function() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, showing content without animations');
            const loadingScreen = document.querySelector('.loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            
            const allSections = document.querySelectorAll('section');
            allSections.forEach(section => {
                section.style.opacity = '1';
                section.style.visibility = 'visible';
            });
        }
    }, 3000);
});