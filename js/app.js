/**
 * =================================================================
 * ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ (ТОЧКА ВХОДА)
 * =================================================================
 * Импортирует и инициализирует все JS-модули после полной загрузки DOM.
 */

import { initAnimations } from './modules/animations.js';
import { initHeader } from './modules/header.js';
import { initModals } from './modules/modals.js';
import { initPortfolio } from './modules/portfolio.js';
import { initThemeToggle } from './modules/theme-toggle.js';
import { initForms } from './modules/forms.js'; // 👈 ДОБАВЬ ЭТУ СТРОКУ

// Событие DOMContentLoaded гарантирует, что весь HTML-документ загружен и обработан,
// прежде чем мы начнем выполнять скрипты.
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем каждый модуль
    initAnimations();
    initHeader();
    initModals();
    initPortfolio();
    initThemeToggle();
    initForms(); // 👈 И ДОБАВЬ ЭТУ СТРОКУ
});
