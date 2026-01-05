import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
    // Шаг А: Загружаем переменные из .env файла
    const env = loadEnv(mode, process.cwd(), '');

    return defineConfig({
        server: {
            port: 5173,
            // Шаг Б: Настраиваем прокси, чтобы убрать ошибку 404
            proxy: {
                '/api': {
                    target: 'http://localhost:5173',
                    changeOrigin: true,
                },
            },
        },
        // Шаг В: "Пробрасываем" загруженные переменные в process.env
        define: {
            'process.env.TELEGRAM_BOT_TOKEN': JSON.stringify(env.TELEGRAM_BOT_TOKEN),
            'process.env.TELEGRAM_CHAT_ID': JSON.stringify(env.TELEGRAM_CHAT_ID),
        },
    });
}
