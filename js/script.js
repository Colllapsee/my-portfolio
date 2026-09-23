const filterButtons = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');

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
