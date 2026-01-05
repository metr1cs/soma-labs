export default async function handler(req, res) {
    console.log('\n--- [API] New Request Received ---'); // 1. Видим начало запроса

    // Используем process.env, как и раньше
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 2. Логируем переменные, чтобы увидеть, что в них
    console.log(`[API] Bot Token Loaded: ${botToken ? 'YES' : 'NO'}`);
    console.log(`[API] Chat ID Loaded: ${chatId ? 'YES' : 'NO'}`);

    if (!botToken || !chatId) {
        console.error('[API] FATAL ERROR: Telegram secrets are not configured on the server!');
        return res.status(500).json({ message: 'Server configuration error: Secrets missing.' });
    }

    if (req.method !== 'POST') {
        console.warn('[API] Warning: Received non-POST request.');
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { name, email, phone } = req.body;
    console.log('[API] Received form data:', { name, email, phone }); // 3. Логируем данные формы

    const text = `🔔 Новая заявка!\n\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone}`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    console.log('[API] Sending request to Telegram...'); // 4. Перед отправкой

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text }),
        });
        const result = await response.json();

        if (!result.ok) throw new Error(`Telegram API error: ${result.description}`);

        console.log('[API] Successfully sent message to Telegram.'); // 5. Успех
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('[API] CATCH BLOCK ERROR:', error.message); // 6. Ошибка
        res.status(500).json({ success: false, message: error.message });
    }
}
