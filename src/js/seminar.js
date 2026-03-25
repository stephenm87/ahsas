import { supabase } from './supabase.js';

// ========================================
// AHSAS — Socratic Seminar Logic
// ========================================

// --- State ---
let currentRoom = null;
let pollingInterval = null;
let realtimeSubscription = null;
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let currentTopic = '';

// --- DOM Helpers ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showView(viewId) {
    $$('.view').forEach(v => v.classList.add('hidden'));
    const view = $(`#${viewId}`);
    view.classList.remove('hidden');
    view.classList.add('animate-in');
}

function showToast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('visible');
    setTimeout(() => t.classList.remove('visible'), 2500);
}

function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

// --- Room Code Generator ---
function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

// --- URL Param Handling ---
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        join: params.get('join'),
        teacher: params.get('teacher') === 'true'
    };
}

// ========================================
// TEACHER FUNCTIONS
// ========================================

async function createRoom() {
    const code = generateCode();
    currentTopic = $('#topicInput')?.value.trim() || '';

    const { data, error } = await supabase
        .from('rooms')
        .insert({
            code: code,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') return createRoom();
        console.error('Error creating room:', error);
        showToast('❌ Error creating room. Please try again.');
        return;
    }

    currentRoom = data;
    // Store topic locally (no DB column needed)
    if (currentTopic) {
        localStorage.setItem(`ahsas_topic_${data.code}`, currentTopic);
    }
    showTeacherDashboard(data);
}

function showTeacherDashboard(room) {
    showView('viewTeacher');
    $('#teacherRoomCode').textContent = room.code;

    // Show topic if set
    const topic = currentTopic || localStorage.getItem(`ahsas_topic_${room.code}`) || '';
    if (topic) {
        const topicEl = $('#teacherTopicDisplay');
        topicEl.classList.remove('hidden');
        $('#teacherTopicText').textContent = topic;
    }

    // Generate QR code
    const joinUrl = `${window.location.origin}/seminar.html?join=${room.code}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}&bgcolor=ffffff&color=1a1a24&margin=8`;
    $('#qrContainer').innerHTML = `<img src="${qrUrl}" alt="QR Code to join room ${room.code}" style="border-radius:12px;">`;

    // Setup timer
    setupTimer();

    // Start listening for submissions
    startListening(room.id);
}

function startListening(roomId) {
    // Try real-time first
    realtimeSubscription = supabase
        .channel(`room-${roomId}`)
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'submissions', filter: `room_id=eq.${roomId}` },
            (payload) => {
                updateSubmissionCount(roomId);
            }
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log('Real-time connected');
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                // Fallback to polling
                console.log('Real-time failed, falling back to polling');
                startPolling(roomId);
            }
        });

    // Also do an initial fetch
    updateSubmissionCount(roomId);

    // Start polling as backup (every 5s)
    startPolling(roomId);
}

function startPolling(roomId) {
    if (pollingInterval) return;
    pollingInterval = setInterval(() => updateSubmissionCount(roomId), 5000);
}

async function updateSubmissionCount(roomId) {
    const { data, error } = await supabase
        .from('submissions')
        .select('id, student_name, dos, donts')
        .eq('room_id', roomId);

    if (error) {
        console.error('Error fetching submissions:', error);
        return;
    }

    const count = data ? data.length : 0;
    $('#submissionCount').textContent = count;
    $('#btnSynthesize').disabled = count < 1;

    // Render preview chips
    renderSubmissionPreview(data || []);
}

function renderSubmissionPreview(submissions) {
    const container = $('#submissionsPreview');
    if (!submissions.length) {
        container.innerHTML = '<p class="text-muted text-center" style="font-size:0.85rem;">Waiting for students to submit...</p>';
        return;
    }

    container.innerHTML = `
        <div class="card" style="padding:var(--space-md);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-sm);">
                <h3 style="font-size:0.95rem;">Submissions</h3>
                <span class="badge badge-jade">${submissions.length} received</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-xs);">
                ${submissions.map(s => `
                    <span class="badge badge-gold" style="font-size:0.75rem;">${escapeHtml(s.student_name)}</span>
                `).join('')}
            </div>
        </div>
    `;
}

// --- Synthesize ---
async function synthesize() {
    if (!currentRoom) return;

    const btn = $('#btnSynthesize');
    btn.disabled = true;
    btn.innerHTML = '⏳ Synthesizing...';

    try {
        // Fetch all submissions
        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('student_name, dos, donts')
            .eq('room_id', currentRoom.id);

        if (error) throw error;
        if (!submissions || !submissions.length) {
            showToast('No submissions to synthesize');
            return;
        }

        // Call the Netlify function
        const response = await fetch('/api/synthesize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room_id: currentRoom.id,
                submissions: submissions
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'Synthesis failed');
        }

        const result = await response.json();
        renderSynthesisResults(result, submissions.length);

    } catch (err) {
        console.error('Synthesis error:', err);
        showToast('❌ Synthesis failed — using local engine');
        // Fallback: use local mechanical synthesis
        fallbackSynthesize();
    } finally {
        btn.disabled = false;
        btn.innerHTML = '✨ Synthesize with AI';
    }
}

function renderSynthesisResults(result, studentCount) {
    const container = $('#synthResults');
    container.classList.remove('hidden');

    $('#resultStudentCount').textContent = studentCount;
    $('#resultDate').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const renderCard = (items, type, icon, title) => `
        <div class="card synth-card card-accent-${type === 'do' ? 'do' : 'dont'}" style="animation:fadeUp 0.5s var(--ease);">
            <div class="synth-card-header">
                <div class="synth-icon synth-icon-${type === 'do' ? 'do' : 'dont'}">${icon}</div>
                <div>
                    <h3>${title}</h3>
                    <p class="text-dim" style="font-size:0.75rem;">${items.length} guidelines from ${studentCount} students</p>
                </div>
            </div>
            <ul class="synth-list">
                ${items.map((item, i) => `
                    <li>
                        <div class="synth-number">${i + 1}</div>
                        <div>
                            <div class="synth-text">${escapeHtml(typeof item === 'string' ? item : item.text || item.guideline)}</div>
                            ${item.count ? `<div class="synth-meta">${item.count} student${item.count !== 1 ? 's' : ''} mentioned this</div>` : ''}
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    const dos = result.dos || result.guidelines?.dos || [];
    const donts = result.donts || result.guidelines?.donts || [];

    $('#synthCards').innerHTML =
        renderCard(dos, 'do', '✅', "The Do's") +
        renderCard(donts, 'dont', '🚫', "The Don'ts");

    // Scroll to results
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Fallback Local Synthesis ---
function fallbackSynthesize() {
    // Same mechanical synthesis from the original HTML tool
    supabase.from('submissions')
        .select('student_name, dos, donts')
        .eq('room_id', currentRoom.id)
        .then(({ data }) => {
            if (!data) return;
            const allDos = data.flatMap(s => s.dos || []);
            const allDonts = data.flatMap(s => s.donts || []);

            const groupAndRank = (items) => {
                const groups = [];
                items.forEach(item => {
                    const norm = item.toLowerCase().trim();
                    if (!norm) return;
                    const existing = groups.find(g =>
                        g.items.some(i => i.toLowerCase().includes(norm.slice(0, 10)) || norm.includes(i.toLowerCase().slice(0, 10)))
                    );
                    if (existing) {
                        existing.items.push(item);
                        existing.count++;
                    } else {
                        groups.push({ items: [item], count: 1 });
                    }
                });
                return groups
                    .sort((a, b) => b.count - a.count)
                    .map(g => ({
                        text: g.items.sort((a, b) => b.length - a.length)[0],
                        count: g.count
                    }));
            };

            renderSynthesisResults({
                dos: groupAndRank(allDos),
                donts: groupAndRank(allDonts)
            }, data.length);
        });
}

// ========================================
// DISCUSSION TIMER
// ========================================

function setupTimer() {
    const display = $('#timerDisplay');
    const presets = $$('#timerPresets [data-minutes]');
    const btnStart = $('#btnTimerStart');
    const btnPause = $('#btnTimerPause');
    const btnReset = $('#btnTimerReset');

    // Preset buttons
    presets.forEach(btn => {
        btn.addEventListener('click', () => {
            const mins = parseInt(btn.dataset.minutes);
            timerSeconds = mins * 60;
            timerRunning = false;
            if (timerInterval) clearInterval(timerInterval);
            updateTimerDisplay();
            btnStart.disabled = false;
            btnPause.disabled = true;
            btnReset.disabled = false;
            // Highlight selected preset
            presets.forEach(b => b.style.borderColor = '');
            btn.style.borderColor = 'var(--gold)';
        });
    });

    // Start
    btnStart.addEventListener('click', () => {
        if (timerSeconds <= 0) return;
        timerRunning = true;
        btnStart.disabled = true;
        btnPause.disabled = false;
        btnReset.disabled = false;
        timerInterval = setInterval(() => {
            timerSeconds--;
            updateTimerDisplay();
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                btnStart.disabled = true;
                btnPause.disabled = true;
                display.style.color = 'var(--vermillion)';
                display.textContent = "Time's up!";
                // Flash effect
                display.animate([
                    { transform: 'scale(1.1)' },
                    { transform: 'scale(1)' }
                ], { duration: 500, iterations: 3 });
            }
        }, 1000);
    });

    // Pause
    btnPause.addEventListener('click', () => {
        timerRunning = false;
        if (timerInterval) clearInterval(timerInterval);
        btnStart.disabled = false;
        btnPause.disabled = true;
    });

    // Reset
    btnReset.addEventListener('click', () => {
        timerRunning = false;
        if (timerInterval) clearInterval(timerInterval);
        timerSeconds = 0;
        updateTimerDisplay();
        display.style.color = 'var(--gold)';
        btnStart.disabled = true;
        btnPause.disabled = true;
        btnReset.disabled = true;
        $$('#timerPresets [data-minutes]').forEach(b => b.style.borderColor = '');
    });
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    const display = $('#timerDisplay');
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    // Color shift in last 60 seconds
    if (timerSeconds <= 60 && timerSeconds > 0) {
        display.style.color = 'var(--vermillion)';
    } else if (timerSeconds > 60) {
        display.style.color = 'var(--gold)';
    }
}

// ========================================
// LEAVE ROOM
// ========================================

function leaveRoom() {
    if (pollingInterval) { clearInterval(pollingInterval); pollingInterval = null; }
    if (realtimeSubscription) { supabase.removeChannel(realtimeSubscription); realtimeSubscription = null; }
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    timerSeconds = 0;
    timerRunning = false;
    currentRoom = null;
    currentTopic = '';
    showView('viewChoose');
}

// ========================================
// STUDENT FUNCTIONS
// ========================================

async function joinRoom(code) {
    code = code.toUpperCase().trim();
    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code)
        .gte('expires_at', new Date().toISOString())
        .single();

    if (error || !data) {
        $('#joinError').textContent = '❌ Room not found or expired. Check the code and try again.';
        $('#joinError').classList.add('visible');
        return;
    }

    currentRoom = data;
    $('#formRoomCode').textContent = code;

    // Show topic if teacher set one
    const topic = localStorage.getItem(`ahsas_topic_${code}`) || '';
    if (topic) {
        const topicEl = $('#studentTopicDisplay');
        topicEl.classList.remove('hidden');
        $('#studentTopicText').textContent = topic;
    }

    showView('viewStudentForm');
    $('#studentName').focus();
}

async function submitStudentForm() {
    const name = $('#studentName').value.trim();
    const dosRaw = $('#dosInput').value;
    const dontsRaw = $('#dontsInput').value;

    const dos = dosRaw.split('\n').map(s => s.trim()).filter(s => s);
    const donts = dontsRaw.split('\n').map(s => s.trim()).filter(s => s);

    // Validate
    if (!name) {
        showFormError('Please enter your name.');
        return;
    }
    if (dos.length === 0) {
        showFormError('Please enter at least 1 Do.');
        return;
    }
    if (donts.length === 0) {
        showFormError("Please enter at least 1 Don't.");
        return;
    }

    // Save locally first (offline resilience)
    localStorage.setItem('ahsas_draft', JSON.stringify({ name, dos, donts, room: currentRoom.code }));

    const btn = $('#btnSubmit');
    btn.disabled = true;
    btn.innerHTML = '⏳ Submitting...';

    const { error } = await supabase
        .from('submissions')
        .insert({
            room_id: currentRoom.id,
            student_name: name,
            dos: dos,
            donts: donts
        });

    if (error) {
        console.error('Submit error:', error);
        btn.disabled = false;
        btn.innerHTML = 'Submit My Ideas →';
        showFormError('❌ Submit failed. Check your connection and try again.');
        return;
    }

    localStorage.removeItem('ahsas_draft');
    showView('viewSubmitted');
    showToast('✅ Ideas submitted!');
}

function showFormError(msg) {
    const el = $('#formError');
    el.textContent = msg;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 4000);
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const params = getUrlParams();

    // Auto-route based on URL params
    if (params.join) {
        showView('viewJoin');
        $('#joinCode').value = params.join;
        joinRoom(params.join);
    } else if (params.teacher) {
        createRoom();
    } else {
        showView('viewChoose');
    }

    // Navigation buttons
    $('#btnTeacher')?.addEventListener('click', () => createRoom());
    $('#btnStudent')?.addEventListener('click', () => {
        showView('viewJoin');
        $('#joinCode').focus();
    });
    $('#btnBackToChoose')?.addEventListener('click', () => showView('viewChoose'));
    $('#btnLeaveRoom')?.addEventListener('click', () => leaveRoom());

    // Join room
    $('#btnJoinRoom')?.addEventListener('click', () => {
        const code = $('#joinCode').value.trim();
        if (code.length >= 4) joinRoom(code);
    });
    $('#joinCode')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const code = e.target.value.trim();
            if (code.length >= 4) joinRoom(code);
        }
    });

    // Student form
    $('#studentForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        submitStudentForm();
    });

    // Synthesize
    $('#btnSynthesize')?.addEventListener('click', () => synthesize());

    // Copy link
    $('#btnCopyLink')?.addEventListener('click', () => {
        if (!currentRoom) return;
        const url = `${window.location.origin}/seminar.html?join=${currentRoom.code}`;
        navigator.clipboard.writeText(url)
            .then(() => showToast('📋 Join link copied!'))
            .catch(() => showToast('Copy failed — select the URL manually'));
    });

    // Print
    $('#btnPrint')?.addEventListener('click', () => window.print());

    // Copy synthesis as text
    $('#btnCopyText')?.addEventListener('click', () => {
        const cards = $$('.synth-card');
        let text = '═══ OUR SOCRATIC SEMINAR GUIDELINES ═══\n\n';
        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent || '';
            text += `── ${title.toUpperCase()} ──\n`;
            card.querySelectorAll('.synth-text').forEach((item, i) => {
                text += `${i + 1}. ${item.textContent}\n`;
            });
            text += '\n';
        });
        navigator.clipboard.writeText(text)
            .then(() => showToast('📋 Copied to clipboard!'));
    });

    // Restore draft
    const draft = localStorage.getItem('ahsas_draft');
    if (draft) {
        try {
            const d = JSON.parse(draft);
            if (d.name) $('#studentName').value = d.name;
            if (d.dos) $('#dosInput').value = d.dos.join('\n');
            if (d.donts) $('#dontsInput').value = d.donts.join('\n');
        } catch (e) {}
    }

    // Auto-save drafts
    ['studentName', 'dosInput', 'dontsInput'].forEach(id => {
        $(`#${id}`)?.addEventListener('input', () => {
            const name = $('#studentName')?.value || '';
            const dos = ($('#dosInput')?.value || '').split('\n').map(s => s.trim()).filter(s => s);
            const donts = ($('#dontsInput')?.value || '').split('\n').map(s => s.trim()).filter(s => s);
            localStorage.setItem('ahsas_draft', JSON.stringify({
                name, dos, donts,
                room: currentRoom?.code
            }));
        });
    });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (pollingInterval) clearInterval(pollingInterval);
    if (realtimeSubscription) supabase.removeChannel(realtimeSubscription);
    if (timerInterval) clearInterval(timerInterval);
});
