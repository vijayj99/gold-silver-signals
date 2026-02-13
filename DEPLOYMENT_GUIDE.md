# Deployment Guide: GOLD SILVER SIGNALS

Follow these steps to take your dashboard live on Vercel.

## 1. Push to GitHub
Ensure all your changes are pushed to your GitHub repository.

## 2. Connect to Vercel
1. Go to [Vercel](https://vercel.com) and create a new project.
2. Select your GitHub repository.
3. **IMPORTANT**: Add these **Environment Variables** in the Vercel dashboard:
   - `TELEGRAM_BOT_TOKEN`: Your bot token from BotFather.
   - `TELEGRAM_CHANNEL_ID`: Your Telegram channel ID.
   - `TWELVE_DATA_API_KEY`: (Optional) Your Twelve Data API key for live market data.

## 3. Automatic Signal Generation
I have added a `vercel.json` file. Once you deploy, Vercel will automatically ping your `/api/tick` endpoint every 1 minute using **Vercel Cron Jobs**. This replaces the local `runner.js`.

> [!NOTE]
> Vercel Cron Jobs are free on the Hobby plan (up to 1 run per day) but require a Pro plan or separate ping service (like Cron-job.org) for 1-minute intervals. If using Hobby, you can manually ping `https://your-domain.com/api/tick` to test.

## 4. Database limitation
The current project uses a **Mock DB** (`lib/db-mock.ts`) which saves data to a local file. On Vercel, this file will reset every time the server restarts or redeploys. 
For a permanent live dashboard, you will eventually need to connect a real database (like Vercel Postgres or Supabase).

## 5. Deployment Complete
Once deployed, your dashboard will be available at `https://your-project.vercel.app` and signals will work exactly like they do locally!
