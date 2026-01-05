// js/modules/portfolio.js - Финальная версия для Isotope + Fancybox

import { casesData } from '../data/cases-data.js';

export function initPortfolio() {
    const filterContainer = document.getElementById('cases-filter-container');
    const casesGrid = document.getElementById('cases-grid');

    // Проверка, существуют ли необходимые элементы и библиотеки
    if (!casesGrid || typeof Isotope === 'undefined' || typeof imagesLoaded === 'undefined') {
        console.error('Portfolio cannot be initialized: Grid container, Isotope, or imagesLoaded library is missing.');
        return;
    }

    // --- 1. ГЕНЕРАЦИЯ HTML ---
    casesGrid.innerHTML = casesData.map(caseItem => `
        <div class="case-card animate-up ${caseItem.category}">
            <a href="${caseItem.slides[0].src}"
               data-fancybox="gallery-${caseItem.id}"
               data-caption="${caseItem.slides[0].caption || ''}">
                
                <div class="case-card__image-wrapper">
                    <img src="${caseItem.imageSrc}" alt="${caseItem.title}" class="case-card__image" loading="lazy">
                    <div class="case-card__overlay"><span class="case-card__tag">${caseItem.tag}</span></div>
                </div>
                <div class="case-card__content">
                    <h3 class="case-card__name">${caseItem.title}</h3>
                </div>
            </a>
            <!-- Скрытые ссылки для галереи Fancybox -->
            <div style="display:none;">
                ${caseItem.slides.slice(1).map(slide => `
                    <a href="${slide.src}" data-fancybox="gallery-${caseItem.id}" data-caption="${slide.caption || ''}"></a>
                `).join('')}
            </div>
        </div>
    `).join('');

    // --- 2. ГЕНЕРАЦИЯ КНОПОК ФИЛЬТРОВ ---
    const categories = ['all', ...new Set(casesData.map(item => item.category))];
    const categoryLabels = { 'all': 'Все работы', 'sites': 'Сайты', 'identity': 'Айдентика' };
    if (filterContainer) {
        filterContainer.innerHTML = categories.map((cat, i) => `
            <button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${cat === 'all' ? '*' : `.${cat}`}">
                ${categoryLabels[cat] || cat}
            </button>
        `).join('');
    }

    // --- 3. ИНИЦИАЛИЗАЦИЯ ISOTOPE ПОСЛЕ ЗАГРУЗКИ КАРТИНОК ---
    imagesLoaded(casesGrid, function() {
        const iso = new Isotope(casesGrid, {
            itemSelector: '.case-card',
            layoutMode: 'masonry', // 'masonry' - лучший режим для сеток разной высоты
            percentPosition: true,
        });

        // --- 4. ОБРАБОТЧИК ФИЛЬТРОВ ---
        if (filterContainer) {
            filterContainer.addEventListener('click', (event) => {
                const filterBtn = event.target.closest('.filter-btn');
                if (!filterBtn) return;

                filterContainer.querySelector('.active').classList.remove('active');
                filterBtn.classList.add('active');

                iso.arrange({ filter: filterBtn.dataset.filter });
            });
        }
    });

    // --- 5. ИНИЦИАЛИЗАЦИЯ FANCYBOX ---
    Fancybox.bind("[data-fancybox]", {
        Thumbs: false,
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: [],
                right: ["close"],
            },
        },
    });
}
