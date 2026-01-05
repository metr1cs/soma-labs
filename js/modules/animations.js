/**
 * =================================================================
 * МОДУЛЬ АНИМАЦИЙ
 * =================================================================
 * - Анимация появления элементов при скролле (Intersection Observer)
 * - Анимация счетчиков
 */

export function initAnimations() {
    // 1. Анимация появления элементов при скролле
    const animatedElements = document.querySelectorAll('.animate-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Отключаем наблюдение после анимации
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));

    // 2. Анимация счетчика
    const statValues = document.querySelectorAll('.hero__stat-value');
    statValues.forEach(valueEl => {
        const target = +valueEl.dataset.target;
        if (isNaN(target)) return;

        const statObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateValue(valueEl, 0, target, 2000);
                statObserver.unobserve(valueEl);
            }
        }, { threshold: 0.8 });

        statObserver.observe(valueEl);
    });
}

function animateValue(el, start, end, duration) {
    let startTimestamp = null;
    const suffix = el.textContent.includes('%') ? '%' : '+';

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        el.textContent = `${currentValue}${suffix}`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
