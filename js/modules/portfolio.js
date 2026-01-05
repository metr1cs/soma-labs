/**
 * =================================================================
 * МОДУЛЬ ПОРТФОЛИО (КЕЙСЫ)
 * =================================================================
 * - Динамически генерирует кнопки фильтров и карточки кейсов из данных
 * - Инициализирует Isotope.js для плавной фильтрации и анимации
 * - Управляет доступностью (a11y), оповещая скринридеры о результатах
 */

import { casesData } from '../data/cases-data.js';

export function initPortfolio() {
    const filterContainer = document.getElementById('cases-filter-container');
    const casesGrid = document.getElementById('cases-grid');
    const announcer = document.getElementById('filter-announcer');

    if (!filterContainer || !casesGrid || !casesData) {
        console.warn('Portfolio elements not found or data is missing.');
        return;
    }

    // 1. ГЕНЕРАЦИЯ КАРТОЧЕК
    casesGrid.innerHTML = casesData.map(caseItem => `
        <article class="case-card ${caseItem.category}">
            <a href="${caseItem.link}" class="case-card__link-wrapper">
                <div class="case-card__image-wrapper">
                    <img src="${caseItem.imageSrc}" alt="${caseItem.title}" class="case-card__image" loading="lazy" decoding="async">
                    <div class="case-card__overlay"><span class="case-card__tag">${caseItem.tag}</span></div>
                </div>
                <div class="case-card__content">
                    <h3 class="case-card__name">${caseItem.title}</h3>
                    <p class="case-card__text">${caseItem.description}</p>
                    <span class="case-card__link">Смотреть проект ⟶</span>
                </div>
            </a>
        </article>
    `).join('');

    // 2. ГЕНЕРАЦИЯ КНОПОК ФИЛЬТРОВ
    const categories = ['all', ...new Set(casesData.map(item => item.category))];
    const categoryLabels = { 'all': 'Все работы', 'sites': 'Сайты', 'identity': 'Айдентика' };

    filterContainer.innerHTML = categories.map((category, index) => `
        <button class="filter-btn ${index === 0 ? 'active' : ''}" data-filter="${category === 'all' ? '*' : `.${category}`}">
            ${categoryLabels[category] || category}
        </button>
    `).join('');

    // 3. ИНИЦИАЛИЗАЦИЯ ISOTOPE
    const iso = new Isotope(casesGrid, {
        itemSelector: '.case-card',
        layoutMode: 'fitRows',
        transitionDuration: '0.6s'
    });

    // 4. ОБРАБОТЧИК ФИЛЬТРОВ (с делегированием событий)
    filterContainer.addEventListener('click', (event) => {
        const filterBtn = event.target.closest('.filter-btn');
        if (!filterBtn) return;

        filterContainer.querySelector('.active').classList.remove('active');
        filterBtn.classList.add('active');

        const filterValue = filterBtn.dataset.filter;
        iso.arrange({ filter: filterValue });

        // Оповещение для скринридеров
        setTimeout(() => {
            const visibleItems = iso.getFilteredItemElements().length;
            announcer.textContent = `Показано ${visibleItems} проектов.`;
        }, 600); // Задержка, чтобы соответствовать анимации
    });
}
