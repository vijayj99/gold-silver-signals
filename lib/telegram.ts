// lib/telegram.ts
import { Telegraf } from 'telegraf';
import { Signal } from './strategy';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '';

const bot = BOT_TOKEN ? new Telegraf(BOT_TOKEN) : null;

export class TelegramService {
    static async sendSignal(signal: Signal) {
        if (!bot || !CHANNEL_ID) {
            console.log('Telegram Bot not configured. Signal:', signal);
            return;
        }

        const emoji = signal.type === 'BUY' ? '🟢' : '🔴';
        const message = `
${emoji} *VIP SIGNAL (GOLD YEARLY)* ${emoji}

*Asset:* ${signal.symbol}
*Action:* ${signal.type}
*Price:* $${signal.price.toFixed(2)}
*Time:* ${signal.time}

🎯 *TP 1 (Partial):* $${(signal as any).tp1?.toFixed(2) || 'N/A'}
🎯 *TP 2 (Final):* $${(signal as any).tp?.toFixed(2) || 'N/A'}
🛑 *SL:* $${(signal as any).sl?.toFixed(2) || 'N/A'}
📊 *RR:* 1:2+

*Reason:* ${signal.reason}

⚠️ _Automatic Rule Generation. Trade at your own risk._
    `;

        try {
            await bot.telegram.sendMessage(CHANNEL_ID, message, { parse_mode: 'Markdown' });
            console.log(`Signal sent to Telegram for ${signal.symbol}`);
        } catch (error) {
            console.error('Failed to send telegram signal:', error);
        }
    }
}
