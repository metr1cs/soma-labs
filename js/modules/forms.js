/**
 * =================================================================
 * МОДУЛЬ УПРАВЛЕНИЯ ФОРМАМИ
 * =================================================================
 * - Перехватывает отправку формы.
 * - Отправляет данные асинхронно на Serverless-функцию.
 * - Показывает пользователю статус отправки.
 */

export function initForms() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Отменяем стандартную перезагрузку страницы

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const submitButton = document.getElementById('form-submit-button');
        const originalButtonHTML = submitButton.innerHTML;

        // --- Индикация процесса для пользователя ---
        submitButton.disabled = true;
        submitButton.innerHTML = 'Отправка...';

        try {
            // Отправляем данные на наш API-endpoint
            const response = await fetch('/api/send-telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // --- Успех! ---
                form.reset();
                submitButton.innerHTML = '✅ Отправлено!';

                // Через 2 секунды закрываем модалку и возвращаем кнопку в исходное состояние
                setTimeout(() => {
                    const activeModal = document.querySelector('.modal-overlay.active');
                    if (activeModal) {
                        activeModal.classList.remove('active');
                        // Важно! Если у тебя есть JS-логика для модалок, она должна убрать style="overflow: hidden" с body
                        document.body.style.overflow = '';
                    }
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonHTML;
                }, 2000);

            } else {
                // --- Ошибка сервера (например, 400, 500) ---
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка на стороне сервера');
            }
        } catch (error) {
            // --- Ошибка сети или другая ошибка ---
            console.error('Ошибка при отправке формы:', error);
            submitButton.innerHTML = 'Ошибка! Попробуйте снова';
            // Через 3 секунды возвращаем кнопку в исходное состояние
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }, 3000);
        }
    });
}
