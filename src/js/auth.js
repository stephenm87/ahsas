/* =====================================================
   AHSAS Auth Module — Shared across all pages
   Magic Link auth via Supabase
   Domain restricted to @saschina.org
   ===================================================== */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const ALLOWED_DOMAIN = 'saschina.org';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Get current user (null if not signed in) ──────────────────────
export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// ── Sign in with magic link ────────────────────────────────────────
export async function signInWithMagicLink(email, redirectTo) {
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain !== ALLOWED_DOMAIN) {
        throw new Error(`Please use your SAS school email (@${ALLOWED_DOMAIN})`);
    }
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: redirectTo || window.location.href,
            shouldCreateUser: true,
        }
    });
    if (error) throw error;
}

// ── Sign out ───────────────────────────────────────────────────────
export async function signOut() {
    await supabase.auth.signOut();
}

// ── Subscribe to auth state changes ───────────────────────────────
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session?.user || null);
    });
}

// ── Get display name from user object ─────────────────────────────
export function getDisplayName(user) {
    if (!user) return null;
    // Extract first name from email: firstname.lastname@saschina.org
    const emailPart = user.email.split('@')[0];
    const firstName = emailPart.split('.')[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
}

// ── Initialize auth on page load ──────────────────────────────────
// Call this from each page's JS to set up the auth badge + state
export async function initAuth({ onSignIn, onSignOut } = {}) {
    // Inject modal into DOM (uses auth.css classes)
    if (!document.getElementById('auth-modal')) {
        const modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <div class="auth-modal-card" id="auth-modal-card">
                <button class="auth-modal-close" id="auth-modal-close" aria-label="Close">&times;</button>
                <div id="auth-form-view">
                    <div class="auth-modal-logo">亚历</div>
                    <h2 class="auth-modal-title">Sign in to AHSAS</h2>
                    <p class="auth-modal-subtitle">Enter your SAS school email — we'll send a magic link to your inbox.</p>
                    <input type="email" id="auth-modal-email" class="auth-modal-input"
                        placeholder="yourname@saschina.org" autocomplete="email" inputmode="email" />
                    <button class="auth-modal-btn" id="auth-modal-send">Send Magic Link</button>
                    <p class="auth-modal-error" id="auth-modal-error"></p>
                </div>
                <div id="auth-success-view" class="auth-modal-success" style="display:none;">
                    <div class="auth-modal-success-icon">📬</div>
                    <h3>Check your inbox!</h3>
                    <p>A sign-in link was sent to <strong id="auth-sent-email"></strong>.<br>Click it to sign in — no password needed.</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on backdrop (clicking outside the card)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('visible');
        });
        document.getElementById('auth-modal-close').addEventListener('click', () => {
            modal.classList.remove('visible');
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal.classList.remove('visible');
        });

        // Submit handler
        const sendBtn = document.getElementById('auth-modal-send');
        const emailInput = document.getElementById('auth-modal-email');
        const errorEl = document.getElementById('auth-modal-error');

        async function handleSend() {
            const email = emailInput.value.trim();
            if (!email) { errorEl.textContent = 'Please enter your email.'; return; }
            errorEl.textContent = '';
            sendBtn.disabled = true;
            sendBtn.textContent = 'Sending…';
            try {
                await signInWithMagicLink(email);
                document.getElementById('auth-sent-email').textContent = email;
                document.getElementById('auth-form-view').style.display = 'none';
                document.getElementById('auth-success-view').style.display = 'block';
            } catch (err) {
                errorEl.textContent = err.message || 'Something went wrong. Try again.';
                sendBtn.disabled = false;
                sendBtn.textContent = 'Send Magic Link';
            }
        }
        sendBtn.addEventListener('click', handleSend);
        emailInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
    }

    const user = await getUser();

    // Mount the user badge into #auth-badge if it exists
    const badge = document.getElementById('auth-badge');
    if (badge) updateBadge(badge, user);

    // Listen for auth changes
    onAuthStateChange((event, user) => {
        if (badge) updateBadge(badge, user);
        if (event === 'SIGNED_IN' && onSignIn) onSignIn(user);
        if (event === 'SIGNED_OUT' && onSignOut) onSignOut();
    });

    return user;
}

function updateBadge(badge, user) {
    if (user) {
        const name = getDisplayName(user);
        badge.innerHTML = `
            <div class="auth-user-badge">
                <span class="auth-avatar">${name.charAt(0)}</span>
                <span class="auth-name">${name}</span>
                <button class="auth-signout" id="auth-signout-btn" title="Sign out">↗</button>
            </div>
        `;
        document.getElementById('auth-signout-btn')?.addEventListener('click', () => signOut());
    } else {
        badge.innerHTML = `
            <button class="auth-signin-btn" id="auth-signin-trigger">
                Sign in to save work
            </button>
        `;
        document.getElementById('auth-signin-trigger')?.addEventListener('click', () => {
            document.getElementById('auth-modal')?.classList.add('visible');
        });
    }
}
