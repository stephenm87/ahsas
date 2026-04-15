// AHSAS — Supabase Keep-Alive
// Netlify Scheduled Function: pings Supabase every 5 days to prevent
// the free-tier project from being paused after 7 days of inactivity.
//
// Schedule: every Monday and Saturday at 06:00 UTC

export default async (req) => {
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.log('[keep-alive] Supabase not configured, skipping.');
        return new Response('No Supabase config', { status: 200 });
    }

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rooms?select=id&limit=1`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
            }
        });

        const status = res.status;
        console.log(`[keep-alive] Supabase ping: ${status} at ${new Date().toISOString()}`);

        return new Response(JSON.stringify({ ok: true, supabaseStatus: status, timestamp: new Date().toISOString() }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error('[keep-alive] Ping failed:', err.message);
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const config = {
    schedule: "0 6 * * 1,6"
};
