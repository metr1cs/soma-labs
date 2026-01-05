/**
 * =================================================================
 * МОДУЛЬ МОДАЛЬНЫХ ОКОН
 * =================================================================
 * - Универсальная система для открытия/закрытия любых модальных окон
 * - Специализированная логика для попапа с ценами на услуги
 */

// --- ДАННЫЕ О ЦЕНАХ (в рублях) ---
const pricingData = {
    'web-dev': { title: 'Веб-разработка', services: [ { name: 'SPA / PWA на React/Next.js', price: 'от 450 000 ₽' }, { name: 'Сложная Backend логика', price: 'от 600 000 ₽' }, { name: 'E-commerce (под ключ)', price: '800 000 - 2 000 000 ₽' }, { name: 'Интеграция с API/CRM', price: 'от 150 000 ₽' } ] },
    'design-ux': { title: 'Дизайн и UX', services: [ { name: 'Прототипирование (10-15 экранов)', price: '110 000 ₽' }, { name: 'Дизайн-система (базовая)', price: 'от 280 000 ₽' }, { name: 'Web & Mobile UI (за экран)', price: '10 000 - 25 000 ₽' }, { name: 'Аудит юзабилити', price: '75 000 ₽' } ] },
    'mobile-apps': { title: 'Mobile Apps', services: [ { name: 'Flutter / React Native (MVP)', price: 'от 900 000 ₽' }, { name: 'iOS & Android Native (MVP)', price: 'от 1 200 000 ₽' }, { name: 'Публикация в AppStore/Google Play', price: '50 000 ₽' }, { name: 'Поддержка (в месяц)', price: 'от 65 000 ₽' } ] },
    'branding': { title: 'Брендинг', services: [ { name: 'Логотип и айдентика (базовый пакет)', price: '140 000 ₽' }, { name: 'Фирменный стиль (расширенный)', price: 'от 320 000 ₽' }, { name: 'Гайдбук', price: 'от 190 000 ₽' }, { name: 'Дизайн упаковки', price: 'от 75 000 ₽' } ] },
    'seo': { title: 'SEO Оптимизация', services: [ { name: 'Технический аудит', price: '70 000 ₽' }, { name: 'Сбор семантического ядра', price: '85 000 ₽' }, { name: 'Линкбилдинг (в месяц)', price: 'от 95 000 ₽' }, { name: 'Комплексное SEO (в месяц)', price: 'от 170 000 ₽' } ] },
    'performance': { title: 'Performance Marketing', services: [ { name: 'Настройка Яндекс.Директ / Google Ads', price: '55 000 ₽' }, { name: 'Сквозная аналитика (настройка)', price: 'от 110 000 ₽' }, { name: 'Ведение рекламных кампаний (в месяц)', price: 'от 75 000 ₽' }, { name: 'Оптимизация CPA', price: 'Индивидуально' } ] },
    'no-code': { title: 'No-code разработка', services: [ { name: 'Лендинг на Tilda/Webflow', price: '75 000 - 190 000 ₽' }, { name: 'Сайт-визитка (до 5 страниц)', price: '140 000 ₽' }, { name: 'Интеграция форм и CRM', price: '40 000 ₽' }, { name: 'Сложная анимация', price: 'от 50 000 ₽' } ] },
    'crm-ai': { title: 'CRM & AI', services: [ { name: 'Внедрение AmoCRM/Bitrix24 (базовое)', price: '100 000 ₽' }, { name: 'Разработка чат-бота с AI (Telegram)', price: 'от 240 000 ₽' }, { name: 'Автоматизация воронки продаж', price: 'от 85 000 ₽' }, { name: 'Обучение команды', price: '50 000 ₽' } ] }
};

let activeModal = null; // Переменная для хранения активного модального окна

// --- УНИВЕРСАЛЬНЫЕ ФУНКЦИИ ---
function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Блокируем скролл фона
    activeModal = modal;
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Восстанавливаем скролл
    activeModal = null;
}

export function initModals() {
    // --- 1. ЛОГИКА ДЛЯ ПОПАПОВ С ЦЕНАМИ ---
    const serviceCards = document.querySelectorAll('.service-card[data-service-id]');
    const pricesModal = document.getElementById('prices-modal');
    const pricesContent = document.getElementById('prices-modal-content');
    const pricesTitle = document.getElementById('prices-modal-title');

    serviceCards.forEach(card => {
        card.addEventListener('click', (event) => {
            // Предотвращаем клик, если нажата ссылка внутри карточки
            if (event.target.closest('a')) return;

            const serviceId = card.dataset.serviceId;
            const data = pricingData[serviceId];
            if (!data || !pricesModal) return;

            pricesTitle.textContent = data.title;
            pricesContent.innerHTML = '';
            const priceList = document.createElement('ul');
            data.services.forEach(service => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="service-name">${service.name}</span><span class="service-price">${service.price}</span>`;
                priceList.appendChild(li);
            });
            pricesContent.appendChild(priceList);

            openModal(pricesModal);
        });
    });

    // --- 2. ОБЩАЯ ЛОГИКА ДЛЯ ВСЕХ МОДАЛОК ---
    document.addEventListener('click', event => {
        // Открытие по data-modal-target
        if (event.target.matches('[data-modal-target]')) {
            const modal = document.querySelector(event.target.dataset.modalTarget);
            if (event.target.hasAttribute('data-modal-close-self')) {
                closeModal(event.target.closest('.modal-overlay'));
            }
            openModal(modal);
            return;
        }

        // Закрытие по data-modal-close
        if (event.target.matches('[data-modal-close]')) {
            closeModal(event.target.closest('.modal-overlay'));
            return;
        }
    });

    // Закрытие по клику на оверлей
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal(overlay);
        });
    });

    // Закрытие по клавише Escape
    window.addEventListener('keydown', e => {
        if (e.key === "Escape" && activeModal) {
            closeModal(activeModal);
        }
    });
}
