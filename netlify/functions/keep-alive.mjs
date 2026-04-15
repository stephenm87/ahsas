// AHSAS — Supabase Keep-Alive
// Netlify Scheduled Function: pings Supabase every 5 days to prevent
// the free-tier project from being paused after 7 days of inactivity.
//
// Netlify scheduled functions use cron syntax.
// This runs at 6:00 AM UTC every 5 days (Mon and Sat).

import { schedule } from '@netlify/functions';

const handler = async () => {
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.log('[keep-alive] Supabase not configured, skipping.');
        return { statusCode: 200, body: 'No Supabase config' };
    }

    try {
        // Simple query — just read from the rooms table (lightweight)
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rooms?select=id&limit=1`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
            }
        });

        const status = res.status;
        console.log(`[keep-alive] Supabase ping: ${status} at ${new Date().toISOString()}`);

        return {
            statusCode: 200,
            body: JSON.stringify({ ok: true, supabaseStatus: status, timestamp: new Date().toISOString() })
        };
    } catch (err) {
        console.error('[keep-alive] Ping failed:', err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ ok: false, error: err.message })
        };
    }
};

// Run at 06:00 UTC every Monday and Saturday (every ~5 days)
export { handler };
export const config = {
    schedule: '0 6 * * 1,6'
};
