/**
 * =================================================================
 * МОДУЛЬ ПЕРЕКЛЮЧЕНИЯ ТЕМЫ
 * =================================================================
 * - Управляет переключением класса 'light-theme' на <body>
 * - Сохраняет выбор пользователя в localStorage
 */

export function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Функция для установки темы
    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    };

    // Проверяем сохраненную тему при загрузке
    const savedTheme = localStorage.getItem('theme');
    // Проверяем также системные предпочтения
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // Обработчик клика
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}
