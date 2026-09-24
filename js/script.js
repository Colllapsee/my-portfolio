const filterButtons = document.querySelectorAll('.filters [data-filter]');
const cards = document.querySelectorAll('.projects-grid [data-category]');
const projectImages = document.querySelectorAll('.project-card__image img');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('.lightbox__image');
const lightboxClose = document.querySelector('.lightbox__close');
const lightboxPrevious = document.querySelector('.lightbox__nav--previous');
const lightboxNext = document.querySelector('.lightbox__nav--next');
const hero = document.querySelector('.hero');
const portfolio = document.querySelector('.portfolio');
const header = document.querySelector('.header');
const cursorTrailContainer = document.querySelector('.cursor-trail-container');

cards.forEach((card, index) => {
    if (!card.classList.contains('reveal')) {
        card.classList.add('reveal');
    }

    if (index % 2 === 1) {
        card.classList.add('reveal--delay');
    }
});

const revealItems = document.querySelectorAll('.reveal');
let currentImageIndex = -1;
let lightboxSwitchTimer;

if (cursorTrailContainer && !window.matchMedia('(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)').matches) {
    const trail = [];
    const maxTrailLength = 55;
    let pendingPoint = null;
    let lastPoint = null;
    let frameRequested = false;

    const removeDot = (dot) => {
        const index = trail.indexOf(dot);

        if (index !== -1) {
            trail.splice(index, 1);
        }

        dot.remove();
    };

    const addDot = ({ x, y }) => {
        const dot = document.createElement('span');
        const size = 4 + Math.random() * 5;

        dot.className = 'cursor-trail__dot';
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        dot.style.setProperty('--trail-size', `${size.toFixed(2)}px`);
        dot.style.setProperty('--trail-drift-x', `${((Math.random() - 0.5) * 18).toFixed(2)}px`);
        dot.style.setProperty('--trail-drift-y', `${(-4 - Math.random() * 18).toFixed(2)}px`);
        dot.addEventListener('animationend', () => removeDot(dot), { once: true });

        cursorTrailContainer.append(dot);
        trail.push(dot);

        if (trail.length > maxTrailLength) {
            removeDot(trail[0]);
        }
    };

    const renderTrail = () => {
        frameRequested = false;

        if (!pendingPoint) {
            return;
        }

        const point = pendingPoint;
        pendingPoint = null;

        if (!lastPoint || Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) >= 3) {
            addDot(point);
            lastPoint = point;
        }
    };

    document.addEventListener('mousemove', (event) => {
        pendingPoint = { x: event.clientX, y: event.clientY };

        if (!frameRequested) {
            frameRequested = true;
            window.requestAnimationFrame(renderTrail);
        }
    }, { passive: true });
}

const closeLightbox = () => {
    window.clearTimeout(lightboxSwitchTimer);
    lightboxImage.classList.remove('is-switching');
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
};

const setLightboxImage = (index, animate = false) => {
    if (!projectImages.length) {
        return;
    }

    currentImageIndex = (index + projectImages.length) % projectImages.length;
    const image = projectImages[currentImageIndex];

    const update = () => {
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightboxImage.classList.remove('is-switching');
    };

    window.clearTimeout(lightboxSwitchTimer);

    if (animate) {
        lightboxImage.classList.add('is-switching');
        lightboxSwitchTimer = window.setTimeout(update, 120);
    } else {
        update();
    }
};

projectImages.forEach((image) => {
    image.addEventListener('click', () => {
        setLightboxImage([...projectImages].indexOf(image));
        lightbox.hidden = false;
        document.body.classList.add('lightbox-open');
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrevious.addEventListener('click', () => setLightboxImage(currentImageIndex - 1, true));
lightboxNext.addEventListener('click', () => setLightboxImage(currentImageIndex + 1, true));
lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) {
        closeLightbox();
    }

    if (event.key === 'ArrowLeft' && !lightbox.hidden) {
        event.preventDefault();
        setLightboxImage(currentImageIndex - 1, true);
    }

    if (event.key === 'ArrowRight' && !lightbox.hidden) {
        event.preventDefault();
        setLightboxImage(currentImageIndex + 1, true);
    }
});

projectImages.forEach((image) => {
    image.addEventListener('error', () => image.remove());
});

if (hero) {
    const heroMove = (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

        hero.style.setProperty('--pointer-x', `${(x * 40).toFixed(2)}px`);
        hero.style.setProperty('--pointer-y', `${(y * 30).toFixed(2)}px`);
    };

    hero.addEventListener('pointermove', heroMove);
    hero.addEventListener('pointerleave', () => {
        hero.style.setProperty('--pointer-x', '0px');
        hero.style.setProperty('--pointer-y', '0px');
    });

    const handleScroll = () => {
        const offset = window.scrollY * 0.18;
        hero.style.setProperty('--scroll-shift', `${offset.toFixed(2)}px`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

if (portfolio) {
    const portfolioMove = (event) => {
        const rect = portfolio.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

        portfolio.style.setProperty('--portfolio-pointer-x', `${(x * 44).toFixed(2)}px`);
        portfolio.style.setProperty('--portfolio-pointer-y', `${(y * 34).toFixed(2)}px`);
    };

    portfolio.addEventListener('pointermove', portfolioMove);
    portfolio.addEventListener('pointerleave', () => {
        portfolio.style.setProperty('--portfolio-pointer-x', '0px');
        portfolio.style.setProperty('--portfolio-pointer-y', '0px');
    });

    const handlePortfolioScroll = () => {
        const distance = window.scrollY - portfolio.offsetTop;
        const offset = Math.max(-80, Math.min(80, distance * 0.12));
        portfolio.style.setProperty('--portfolio-scroll', `${offset.toFixed(2)}px`);
    };

    window.addEventListener('scroll', handlePortfolioScroll, { passive: true });
    handlePortfolioScroll();
}

if (header) {
    const handleHeaderState = () => {
        header.classList.toggle('header--scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', handleHeaderState, { passive: true });
    handleHeaderState();
}

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.18,
        rootMargin: '0px 0px -5% 0px'
    });

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

const filters = document.querySelector('.filters');

if (filters) {
    filters.addEventListener('click', (event) => {
        const button = event.target.closest('[data-filter]');

        if (!button || !filters.contains(button)) {
            return;
        }

        const selectedFilter = button.dataset.filter;

        filters.querySelectorAll('[data-filter]').forEach((filterButton) => {
            filterButton.classList.toggle('is-active', filterButton === button);
        });

        document.querySelectorAll('.projects-grid [data-category]').forEach((card) => {
            const shouldShow = selectedFilter === 'all' || card.dataset.category === selectedFilter;
            card.classList.toggle('hidden', !shouldShow);
        });
    });
}
