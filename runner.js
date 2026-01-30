const axios = require('axios');

/**
 * Gold Silver Signals - Automation Runner
 * This script pings the tick engine every minute to check for new signals.
 */
async function startAutomation() {
    console.log('🚀 Signal Automation Started (Checking market every 60s)');

    setInterval(async () => {
        try {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[${timestamp}] Checking markets...`);

            const response = await axios.get('http://localhost:3000/api/tick');

            if (response.data.count > 0) {
                console.log(`✅ SUCCESS: ${response.data.count} new signal(s) generated!`);
            } else {
                console.log('⏳ No setups found in this tick.');
            }
        } catch (error) {
            console.error('❌ Error pinging engine. Make sure Next.js is running (npm run dev)');
        }
    }, 60000); // 60 seconds
}

startAutomation();
