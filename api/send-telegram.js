// ВАЖНО: ЭТО НЕБЕЗОПАСНАЯ ВЕРСИЯ ДЛЯ ТЕСТИРОВАНИЯ
// НЕ ИСПОЛЬЗУЙТЕ ЕЕ В ПУБЛИЧНОМ ПРОЕКТЕ

export default async function handler(req, res) {
    console.log('\n--- [API] New Request Received (DEBUG MODE) ---');

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // ---------------------------------
    console.log(`[API] Bot Token Loaded: ${botToken ? 'YES' : 'NO'}`);
    console.log(`[API] Bot Token Loaded: ${botToken ? 'YES' : 'NO'}`);
    console.log(`[API] Chat ID Loaded: ${chatId ? 'YES' : 'NO'}`);

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { name, email, phone, message } = req.body;
    console.log('[API] Received form data:', { name, email, phone });

    const escapeMarkdown = (text) => text ? text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&') : '';
    const text = `🔔 *Новая заявка с сайта Soma Labs\\!* 🔔\n\n*Имя:* \`${escapeMarkdown(name)}\`\n*Email:* \`${escapeMarkdown(email)}\`\n*Телефон:* \`${escapeMarkdown(phone)}\`\n\n*Сообщение:*\n\`\`\`\n${escapeMarkdown(message) || 'Не заполнено'}\n\`\`\``;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    console.log('[API] Sending request to Telegram...');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'MarkdownV2' }),
        });
        const result = await response.json();

        if (!result.ok) throw new Error(`Telegram API error: ${result.description}`);

        console.log('[API] Successfully sent message to Telegram.');
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('[API] CATCH BLOCK ERROR:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}
