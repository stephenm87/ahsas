/**
 * sync.js — Transparent Supabase ↔ localStorage sync layer for AHSAS
 *
 * How it works:
 *  - When user is NOT signed in → reads/writes go to localStorage only
 *  - When user IS signed in    → reads/writes go to BOTH localStorage AND Supabase
 *  - On sign-in               → existing localStorage data is automatically pushed up
 *  - On page load (signed in) → Supabase data is pulled down and merged into localStorage
 *
 * Inline scripts access it via: window.AHSAS_SYNC.setItem(key, value)
 *                                window.AHSAS_SYNC.getItem(key)
 */

import { supabase } from './supabase.js';

// Keys we want to sync to Supabase
const SYNC_KEYS = [
    'ahsas-bookmarks',
    'ahsas-progress',
    'ahsas_seminar_dna',
    'ahsas_seminar_eval',
    'ahsas_seminar_prep',
    // Tool work data
    'ahsas-cer-builder',
    'ahsas_source_analyzer',
    'ahsas_research_studio',
    'ahsas-compare',
];

let _currentUser = null;

// ── Core helpers ──────────────────────────────────────────────────

async function getCurrentUser() {
    if (_currentUser) return _currentUser;
    const { data: { user } } = await supabase.auth.getUser();
    _currentUser = user;
    return user;
}

/**
 * Upsert a key-value pair to Supabase `user_data` table.
 */
async function supabasePut(user, key, value) {
    try {
        await supabase.from('user_data').upsert(
            { user_id: user.id, key, value },
            { onConflict: 'user_id,key' }
        );
    } catch (e) {
        console.warn('[AHSAS_SYNC] supabasePut failed (non-critical):', e.message);
    }
}

/**
 * Load all sync keys from Supabase and write them into localStorage.
 */
async function syncDown(user) {
    try {
        const { data, error } = await supabase
            .from('user_data')
            .select('key, value')
            .eq('user_id', user.id)
            .in('key', SYNC_KEYS);
        if (error) throw error;
        if (data && data.length > 0) {
            data.forEach(({ key, value }) => {
                // Supabase stores as JSONB, so value might already be parsed
                const serialised = typeof value === 'string' ? value : JSON.stringify(value);
                localStorage.setItem(key, serialised);
            });
            console.info(`[AHSAS_SYNC] Pulled ${data.length} keys from cloud`);
        }
    } catch (e) {
        console.warn('[AHSAS_SYNC] syncDown failed (non-critical):', e.message);
    }
}

/**
 * Push all locally-stored sync keys up to Supabase (called on sign-in).
 */
async function syncUp(user) {
    const promises = SYNC_KEYS.map(async (key) => {
        const raw = localStorage.getItem(key);
        if (raw === null) return;
        const value = JSON.parse(raw);
        await supabasePut(user, key, value);
    });
    await Promise.all(promises);
    console.info('[AHSAS_SYNC] Pushed local data to cloud');
}

// ── Public API ────────────────────────────────────────────────────

/**
 * setItem — saves to localStorage AND Supabase (if signed in)
 * @param {string} key
 * @param {string} jsonValue  — already-serialised JSON string (same as localStorage)
 */
async function setItem(key, jsonValue) {
    localStorage.setItem(key, jsonValue);
    const user = await getCurrentUser();
    if (!user) return;
    if (!SYNC_KEYS.includes(key)) return;
    const value = JSON.parse(jsonValue);
    await supabasePut(user, key, value);
}

/**
 * getItem — reads from localStorage (cloud data was already merged on init)
 */
function getItem(key) {
    return localStorage.getItem(key);
}

/**
 * removeItem — removes from localStorage AND Supabase (if signed in)
 */
async function removeItem(key) {
    localStorage.removeItem(key);
    const user = await getCurrentUser();
    if (!user) return;
    try {
        await supabase.from('user_data').delete()
            .eq('user_id', user.id).eq('key', key);
    } catch (e) {
        console.warn('[AHSAS_SYNC] removeItem failed (non-critical):', e.message);
    }
}

// ── Initialise ────────────────────────────────────────────────────

async function initSync() {
    const user = await getCurrentUser();
    if (user) {
        await syncDown(user); // Pull cloud → localStorage
    }

    // When user signs in mid-session, push existing local data up
    supabase.auth.onAuthStateChange(async (event, session) => {
        _currentUser = session?.user || null;
        if (event === 'SIGNED_IN' && session?.user) {
            await syncUp(session.user);
            await syncDown(session.user);
            // Fire a custom event so pages can reload their data
            window.dispatchEvent(new CustomEvent('ahsas:sync-ready', { detail: { user: session.user } }));
        }
        if (event === 'SIGNED_OUT') {
            _currentUser = null;
        }
    });
}

// Expose globally for inline scripts
window.AHSAS_SYNC = { setItem, getItem, removeItem };

// Auto-init (runs once when module is imported)
initSync();

export { setItem, getItem, removeItem, syncDown, syncUp };
