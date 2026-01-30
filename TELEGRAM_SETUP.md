# Telegram Bot Setup Guide

To enable automatic signal delivery to Telegram, follow these steps:

1. **Create a Bot**:
   - Message `@BotFather` on Telegram.
   - Run `/newbot` and follow the instructions to get your **API Token**.

2. **Create a Channel**:
   - Create a new Telegram Channel.
   - Add your bot as an **Administrator** to the channel.

3. **Get Channel ID**:
   - Post a message to the channel.
   - Forward that message to `@userinfobot` or use a tool like `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` to find the `chat.id` (it usually starts with `-100`).

4. **Update Environment Variables**:
   - Create a `.env.local` file in the root directory.
   - Add the following:
     ```
     TELEGRAM_BOT_TOKEN=your_bot_token_here
     TELEGRAM_CHANNEL_ID=-100xxxxxxxxxx
     ```

5. **Run the Tick Engine**:
   - The engine is triggered via the `/api/tick` endpoint.
   - In production, set up a cron job (e.g., using GitHub Actions, Vercel Cron, or a simple `curl` script) to call `https://your-app.com/api/tick` every minute.

---
# Running the App Locally

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access Dashboard: `http://localhost:3000/dashboard`
4. Access Admin: `http://localhost:3000/admin`
5. Process signals (Manual Tick): `http://localhost:3000/api/tick`
