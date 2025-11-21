// Smooth scroll for anchor links
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            const headerOffset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

            window.scrollTo({
                top,
                behavior: 'smooth'
            });

            closeMobileMenu();
        });
    });
}

// Header state on scroll
function setupHeaderEffect() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (!header) return;
        const scrolled = window.scrollY > 30;
        header.style.background = scrolled ? 'rgba(11, 13, 17, 0.92)' : 'rgba(11, 13, 17, 0.78)';
        header.style.boxShadow = scrolled ? '0 10px 40px rgba(0,0,0,0.45)' : 'none';
    });
}

// Reveal cards on scroll
function revealOnScroll() {
    const animated = document.querySelectorAll('.skill-card, .project-card, .channel-card');
    animated.forEach(el => {
        const { top } = el.getBoundingClientRect();
        const threshold = window.innerHeight * 0.82;
        if (top < threshold) {
            el.classList.add('is-visible');
        }
    });
}

// Active nav state
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const links = document.querySelectorAll('.desktop-nav a, .mobile-menu a');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

// Mobile menu
function setupMobileMenu() {
    const menuButton = document.querySelector('.menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!menuButton || !mobileMenu) return;

    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

function closeMobileMenu() {
    const menuButton = document.querySelector('.menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (menuButton) menuButton.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('active');
}

function init() {
    setupSmoothScroll();
    setupHeaderEffect();
    setupMobileMenu();
    revealOnScroll();
    updateActiveNav();

    window.addEventListener('scroll', () => {
        revealOnScroll();
        updateActiveNav();
    });
}

document.addEventListener('DOMContentLoaded', init);
