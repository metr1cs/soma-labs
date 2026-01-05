// ./js/modules/header.js

export function initHeader() {
    // --- 1. ОБЪЯВЛЯЕМ ВСЕ НУЖНЫЕ ЭЛЕМЕНТЫ ---
    const header = document.getElementById('header');
    const burgerBtn = document.getElementById('burger-btn'); // 👈 Эта строчка была пропущена
    const nav = document.querySelector('.header__nav');      // 👈 И эта тоже

    // Проверка, что все элементы существуют, чтобы избежать ошибок
    if (!header || !burgerBtn || !nav) {
        console.warn('Header elements not found. Burger menu or scroll effect might not work.');
        return;
    }

    // --- 2. ЛОГИКА ДЛЯ "SCROLLED" СОСТОЯНИЯ ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });

    // --- 3. ЛОГИКА ДЛЯ БУРГЕР-МЕНЮ (перемещена внутрь функции) ---
    burgerBtn.addEventListener('click', () => {
        const isOpened = header.classList.toggle('nav-open');
        burgerBtn.setAttribute('aria-expanded', isOpened);
        // Блокируем скролл body, когда меню открыто
        document.body.style.overflow = isOpened ? 'hidden' : '';
    });

    // --- 4. ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ НА ССЫЛКУ (перемещена внутрь функции) ---
    nav.addEventListener('click', (e) => {
        // Проверяем, что кликнули именно по ссылке, а не по пустому месту в меню
        if (e.target.classList.contains('header__link')) {
            header.classList.remove('nav-open');
            burgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
} // <-- ВОТ ЗДЕСЬ ЗАКРЫВАЕТСЯ ФУНКЦИЯ, вся логика должна быть ВЫШЕ
