/**
 * =================================================================
 * SERVERLESS-ФУНКЦИЯ ДЛЯ ОТПРАВКИ ЗАЯВОК В TELEGRAM
 * =================================================================
 * Принимает POST-запрос с данными формы и отправляет их боту.
 * Путь: /api/send-telegram
 *
 * ЭТА ВЕРСИЯ ПРЕДНАЗНАЧЕНА ДЛЯ РАЗВЕРТЫВАНИЯ НА VERCEL
 * И ПОЛАГАЕТСЯ НА ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ VERCEL.
 *
 * НЕ ВСТАВЛЯЙТЕ СЮДА СЕКРЕТНЫЕ КЛЮЧИ НАПРЯМУЮ!
 */

export default async function handler(req, res) {
    // 1. Читаем секретные ключи из переменных окружения Vercel
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 2. Проверка, что ключи успешно загружены
    if (!botToken || !chatId) {
        console.error('SERVER ERROR: Telegram secrets (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID) are not configured in Vercel Environment Variables.');
        return res.status(500).json({ message: 'Server configuration error: Telegram secrets are missing.' });
    }

    // 3. Принимаем только POST-запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed. Only POST requests are accepted.' });
    }

    // 4. Получаем данные из тела запроса
    const { name, email, phone, message, _honey } = req.body;

    // 5. Простейшая защита от спама (Honeypot)
    if (_honey) {
        console.warn('SPAM DETECTED: Honeypot field was filled.');
        return res.status(400).json({ message: 'Spam detected. Request rejected.' });
    }

    // 6. Валидация обязательных полей
    if (!name || !email || !phone) {
        console.warn('VALIDATION FAILED: Required fields (name, email, phone) are missing.');
        return res.status(400).json({ message: 'Validation error: Name, email, and phone are required.' });
    }

    // 7. Функция для экранирования символов для MarkdownV2
    const escapeMarkdown = (text) => {
        if (!text) return '';
        // Символы, требующие экранирования в MarkdownV2
        return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
    };

    // 8. Формируем красивое сообщение для Telegram
    const telegramText = `
🔔 *Новая заявка с сайта Soma Labs\\!* 🔔

*Имя:* \`${escapeMarkdown(name)}\`
*Email:* \`${escapeMarkdown(email)}\`
*Телефон:* \`${escapeMarkdown(phone)}\`

*Сообщение:*
\`\`\`
${escapeMarkdown(message) || 'Не заполнено'}
\`\`\`
    `;

    // 9. URL для отправки в Telegram Bot API
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        // 10. Отправляем запрос в Telegram
        const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: telegramText,
                parse_mode: 'MarkdownV2' // Используем MarkdownV2 для форматирования
            }),
        });

        const telegramResult = await telegramResponse.json();

        if (!telegramResult.ok) {
            // Если Telegram вернул ошибку (например, неверный токен или chat ID)
            console.error(`TELEGRAM API ERROR: ${telegramResult.description}`);
            throw new Error(`Telegram API error: ${telegramResult.description || 'Unknown error from Telegram.'}`);
        }

        // 11. Отвечаем фронтенду, что все прошло успешно
        return res.status(200).json({ success: true, message: 'Message sent to Telegram successfully.' });

    } catch (error) {
        // 12. Логируем и отправляем ошибку фронтенду
        console.error('SERVER CATCH BLOCK ERROR:', error.message);
        return res.status(500).json({ success: false, message: `Failed to send message: ${error.message}` });
    }
}
