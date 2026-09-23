const filterButtons = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
const projectImages = document.querySelectorAll('.project-card__image img');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('.lightbox__image');
const lightboxClose = document.querySelector('.lightbox__close');

const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
};

projectImages.forEach((image) => {
    image.addEventListener('click', () => {
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightbox.hidden = false;
        document.body.classList.add('lightbox-open');
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) {
        closeLightbox();
    }
});

projectImages.forEach((image) => {
    image.addEventListener('error', () => image.remove());
});

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.remove('is-active'));
        button.classList.add('is-active');

        cards.forEach((card) => {
            const category = card.dataset.category;
            const shouldShow = selectedFilter === 'all' || category === selectedFilter;
            card.classList.toggle('hidden', !shouldShow);
        });
    });
});
