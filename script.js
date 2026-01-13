// IgniteTech Website JavaScript
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initSplashScreen();
    initLogoAnimation();
    initLogoShutterAnimation();
    initLetterSwapAnimation();
    initLinesDivider();
    initScrollAnimations();
});

/**
 * Initialize splash screen animation
 */
function initSplashScreen() {
    const splash = document.getElementById('splash');
    const splashContainer = document.getElementById('splashAnimation');

    if (!splash || !splashContainer) return;
    if (typeof lottie === 'undefined') {
        splash.classList.add('hidden');
        initHeroIntro();
        return;
    }

    const splashAnimation = lottie.loadAnimation({
        container: splashContainer,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'assets/Splash/Splash.json'
    });

    splashAnimation.addEventListener('complete', () => {
        splash.classList.add('hidden');
        setTimeout(() => {
            splash.remove();
        }, 600);
        // Start hero intro after splash wipes up
        initHeroIntro();
    });
}

/**
 * Wait for Unicorn Studio to be ready
 */
function waitForUnicornStudio() {
    return new Promise((resolve) => {
        const usEmbed = document.querySelector('[data-us-project]');
        if (!usEmbed) {
            resolve();
            return;
        }

        // Check if already loaded (has iframe or canvas)
        if (usEmbed.querySelector('iframe') || usEmbed.querySelector('canvas')) {
            resolve();
            return;
        }

        // Poll for Unicorn Studio to load
        const checkLoaded = setInterval(() => {
            if (usEmbed.querySelector('iframe') || usEmbed.querySelector('canvas')) {
                clearInterval(checkLoaded);
                resolve();
            }
        }, 100);

        // Timeout after 3 seconds
        setTimeout(() => {
            clearInterval(checkLoaded);
            resolve();
        }, 3000);
    });
}

/**
 * Split text into character spans for animation
 */
function splitTextIntoChars(element, staggerDelay = 0.025, staggerFrom = 'first') {
    if (!element) return [];

    const text = element.textContent;
    element.textContent = '';

    const chars = text.split('');
    const spans = [];

    chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char-reveal';

        if (char === ' ') {
            span.classList.add('char-reveal--space');
            span.innerHTML = '&nbsp;';
        } else {
            span.textContent = char;
        }

        // Calculate delay based on stagger direction
        let delay;
        if (staggerFrom === 'first') {
            delay = i * staggerDelay;
        } else if (staggerFrom === 'last') {
            delay = (chars.length - 1 - i) * staggerDelay;
        } else if (staggerFrom === 'center') {
            const center = (chars.length - 1) / 2;
            delay = Math.abs(i - center) * staggerDelay;
        }

        span.style.transitionDelay = `${delay}s`;
        element.appendChild(span);
        spans.push(span);
    });

    return spans;
}

/**
 * Initialize hero intro animations
 */
async function initHeroIntro() {
    const navbar = document.querySelector('.navbar');
    const titleMain = document.querySelector('.hero__title-main');
    const titleAccent = document.querySelector('.hero__title-accent');
    const subheader = document.querySelector('.hero__subheader');
    const heroBtn = document.querySelector('.hero__content .btn');

    // Split text into characters (only for titles)
    const mainChars = splitTextIntoChars(titleMain, 0.03, 'first');
    const accentChars = splitTextIntoChars(titleAccent, 0.03, 'first');

    // Wait for Unicorn Studio background to load
    await waitForUnicornStudio();

    // Sequence the animations
    // 1. Main title characters reveal
    setTimeout(() => {
        mainChars.forEach(char => char.classList.add('animate-in'));
    }, 200);

    // 2. Accent title characters reveal
    setTimeout(() => {
        accentChars.forEach(char => char.classList.add('animate-in'));
    }, 1200);

    // 3. Subheader, navbar, and button come in together
    setTimeout(() => {
        subheader?.classList.add('animate-in');
        navbar?.classList.add('animate-in');
        heroBtn?.classList.add('animate-in');
    }, 1800);
}

/**
 * Initialize the flame logo lottie animation
 */
function initLogoAnimation() {
    const logoContainer = document.querySelector('.logo');
    const lottieContainer = document.getElementById('fireLottie');

    if (!logoContainer || !lottieContainer) return;
    if (typeof lottie === 'undefined') return;

    const fireAnimation = lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: 'assets/fire-animation.json'
    });

    logoContainer.addEventListener('mouseenter', () => fireAnimation.play());
    logoContainer.addEventListener('mouseleave', () => fireAnimation.stop());
}

/**
 * Initialize the shutter-wipe logo animation
 */
function initLogoShutterAnimation() {
    const shutters = document.querySelectorAll('.logo-shutter');
    const SLICE_COUNT = 20;
    const STAGGER_DELAY = 0.008;
    const ANIMATION_INTERVAL = 4000;

    shutters.forEach((shutter, index) => {
        const logo1 = shutter.dataset.logo1;
        const logo2 = shutter.dataset.logo2;
        const primary = shutter.querySelector('.logo-shutter__primary');
        const secondary = shutter.querySelector('.logo-shutter__secondary');

        if (!primary || !secondary || !logo1 || !logo2) return;

        const containerWidth = shutter.offsetWidth || 160;

        createSlices(primary, logo1, SLICE_COUNT, STAGGER_DELAY, containerWidth);
        createSlices(secondary, logo2, SLICE_COUNT, STAGGER_DELAY, containerWidth);

        let isShowingSecondary = false;

        setTimeout(() => {
            setInterval(() => {
                if (isShowingSecondary) {
                    shutter.classList.remove('animating');
                } else {
                    shutter.classList.add('animating');
                }
                isShowingSecondary = !isShowingSecondary;
            }, ANIMATION_INTERVAL);
        }, index * 50);
    });
}

/**
 * Create sliced columns for shutter effect
 */
function createSlices(container, imageSrc, count, staggerDelay, totalWidth) {
    container.innerHTML = '';
    const sliceWidth = totalWidth / count;

    for (let i = 0; i < count; i++) {
        const slice = document.createElement('div');
        slice.className = 'logo-shutter__slice';

        const inner = document.createElement('div');
        inner.className = 'logo-shutter__slice-inner';
        inner.style.setProperty('--total-width', `${totalWidth}px`);
        inner.style.setProperty('--slice-offset', `${-i * sliceWidth}px`);
        inner.style.transitionDelay = `${i * staggerDelay}s`;

        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = 'Partner Logo';

        inner.appendChild(img);
        slice.appendChild(inner);
        container.appendChild(slice);
    }
}

/**
 * Initialize letter swap animation on nav links
 */
function initLetterSwapAnimation() {
    const navLinks = document.querySelectorAll('.nav-links > li > a');

    navLinks.forEach(link => {
        const text = link.textContent.trim();

        // Skip if already processed or has SVG (dropdown arrow)
        if (link.querySelector('.letter-swap') || link.querySelector('svg')) {
            // Handle dropdown link separately
            if (link.classList.contains('nav-links__dropdown')) {
                const textOnly = 'More';
                setupLetterSwap(link, textOnly, true);
            }
            return;
        }

        setupLetterSwap(link, text, false);
    });
}

/**
 * Setup letter swap effect on a link
 */
function setupLetterSwap(link, text, hasIcon) {
    const svg = hasIcon ? link.querySelector('svg') : null;
    link.innerHTML = '';

    const wrapper = document.createElement('span');
    wrapper.className = 'letter-swap';

    // Create letter containers
    text.split('').forEach((char, i) => {
        const letterContainer = document.createElement('span');
        letterContainer.className = 'letter-swap__container';

        const original = document.createElement('span');
        original.className = 'letter-swap__letter letter-swap__letter--original';
        original.textContent = char === ' ' ? '\u00A0' : char;
        original.style.transitionDelay = `${i * 0.02}s`;

        const swap = document.createElement('span');
        swap.className = 'letter-swap__letter letter-swap__letter--swap';
        swap.textContent = char === ' ' ? '\u00A0' : char;
        swap.style.transitionDelay = `${i * 0.02}s`;

        letterContainer.appendChild(original);
        letterContainer.appendChild(swap);
        wrapper.appendChild(letterContainer);
    });

    link.appendChild(wrapper);

    if (svg) {
        link.appendChild(svg);
    }
}

/**
 * Initialize lines divider with evenly spaced vertical lines
 */
function initLinesDivider() {
    const containers = document.querySelectorAll('.lines-divider__inner');
    if (!containers.length) return;

    const LINE_COUNT = 100;

    containers.forEach(container => {
        for (let i = 0; i < LINE_COUNT; i++) {
            const line = document.createElement('div');
            line.className = 'lines-divider__line';
            container.appendChild(line);
        }
    });
}

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('[data-scroll], [data-scroll-stagger]');
    if (!scrollElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.scrollDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');

                    // Add staggered delays to children
                    if (entry.target.hasAttribute('data-scroll-stagger')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, i) => {
                            child.style.transitionDelay = `${i * 0.1}s`;
                        });
                    }
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollElements.forEach(el => observer.observe(el));
}
