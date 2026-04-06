// Seminar Toolkit Module
// Implements localStorage Discussion DNA tracking, Self-Assessment Form, and Reflection Engine

const POSITIVE_MOVES = [
    { id: 'move-clarify', icon: '❓', label: 'Clarify / Question', desc: 'Clarifies a contribution using an insightful question.' },
    { id: 'move-challenge', icon: '⚖️', label: 'Challenge', desc: 'Respectfully challenges an idea with an alternative perspective.' },
    { id: 'move-invite', icon: '🤝', label: 'Invite Others', desc: 'Invites someone else into the conversation who hasn\'t spoken.' },
    { id: 'move-build', icon: '🏗️', label: 'Build on Ideas', desc: 'Builds on someone else\'s idea.' },
    { id: 'move-evidence', icon: '📜', label: 'Provide Evidence', desc: 'Uses specific, relevant, and accurate historical evidence.' },
    { id: 'move-cohesion', icon: '🧩', label: 'Build Cohesion', desc: 'Helps to build a cohesive understanding of the prompt.' }
];

const WARNING_MOVES = [
    { id: 'warn-interrupt', icon: '⚠️', label: 'Interrupts', desc: 'Interrupts another speaker.' },
    { id: 'warn-dominate', icon: '⏳', label: 'Dominates', desc: 'Dominates the conversation; waits to speak instead of listening.' },
    { id: 'warn-tangent', icon: '🔄', label: 'Tangent', desc: 'Goes on a tangent that does not answer the focus prompt.' },
    { id: 'warn-vague', icon: '🌫️', label: 'Vague/Unsubstantiated', desc: 'Provides vague, unclear or unsubstantiated claims without evidence.' }
];

const EVAL_QUESTIONS = [
    { id: 'q-eye', text: 'I looked at the one other person who was speaking.', category: 'Collaboration', tip: 'Try picking one speaker per exchange and making brief eye contact to show you\'re listening.' },
    { id: 'q-listen', text: 'I was courteous by actively listening and waiting my turn.', category: 'Collaboration', tip: 'Practice the "3-second pause" — wait 3 seconds after someone finishes before responding.' },
    { id: 'q-open', text: 'I listened to the ideas of others with an open mind.', category: 'Collaboration', tip: 'Before responding, try summarizing the other person\'s point to make sure you understood it.' },
    { id: 'q-uncertain', text: 'I shared my ideas even when I was uncertain.', category: 'Courage', tip: 'Try prefacing uncertain ideas with "I\'m not sure about this, but..." — this is intellectual bravery.' },
    { id: 'q-build', text: 'I built on what was said while giving my opinion.', category: 'Argumentation', tip: 'Use sentence starters like "Building on what ___ said..." or "I agree/disagree because..."' },
    { id: 'q-evidence', text: 'I used specific and accurate evidence to support my ideas.', category: 'Argumentation', tip: 'Before the next seminar, prepare 2–3 specific quotes or facts from the readings.' },
    { id: 'q-connect', text: 'I made connections between multiple texts/ideas.', category: 'Argumentation', tip: 'Try comparing perspectives: "Source A says ___ while Source B argues ___."' },
    { id: 'q-new', text: 'I contributed new ideas to the dialogue.', category: 'Courage', tip: 'Before the seminar, write down 2 unique observations nobody else might notice.' },
    { id: 'q-tangent', text: 'I avoided going on tangents unrelated to the focus.', category: 'Focus', tip: 'Keep the focus question visible — before speaking, ask yourself: "Does this connect back?"' }
];

const CATEGORY_META = {
    'Collaboration': { icon: '🤝', desc: 'How well you engage with others respectfully' },
    'Argumentation': { icon: '⚖️', desc: 'How well you use evidence and build on ideas' },
    'Courage': { icon: '💪', desc: 'Your willingness to take intellectual risks' },
    'Focus': { icon: '🎯', desc: 'How well you stay on topic and contribute purposefully' }
};

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('trackerGrid');
    const warningGrid = document.getElementById('warningGrid');
    const totalDisplay = document.getElementById('dnaTotalCount');
    const resetBtn = document.getElementById('btnResetDna');
    const evalForm = document.getElementById('selfEvalForm');

    // State
    let counts = JSON.parse(localStorage.getItem('ahsas_seminar_dna')) || {};
    let evalState = JSON.parse(localStorage.getItem('ahsas_seminar_eval')) || {};

    // 1. Initialize DNA Tracker Grid
    function renderGrid() {
        if (!grid || !warningGrid) return;
        grid.innerHTML = '';
        warningGrid.innerHTML = '';
        let totalPositive = 0;

        function createBtn(move, isPositive) {
            const count = counts[move.id] || 0;
            if (isPositive) totalPositive += count;

            const btn = document.createElement('button');
            btn.className = 'tracker-btn';
            btn.innerHTML = `
                <div>
                    <div class="tracker-name">${move.icon} ${move.label}</div>
                    <div class="text-xs text-dim mt-xs">${move.desc}</div>
                </div>
                <div class="tracker-count" id="count-${move.id}" style="color: ${isPositive ? 'var(--gold)' : 'var(--vermillion)'}">${count}</div>
            `;
            
            btn.addEventListener('click', () => {
                counts[move.id] = (counts[move.id] || 0) + 1;
                saveData();
                updateDisplay(move.id, isPositive);
            });
            return btn;
        }

        POSITIVE_MOVES.forEach(move => grid.appendChild(createBtn(move, true)));
        WARNING_MOVES.forEach(move => warningGrid.appendChild(createBtn(move, false)));

        if (totalDisplay) totalDisplay.textContent = totalPositive;
    }

    // 2. Initialize Self-Evaluation Form
    function renderEvalForm() {
        if (!evalForm) return;
        evalForm.innerHTML = '';

        EVAL_QUESTIONS.forEach(q => {
            const row = document.createElement('div');
            row.className = 'eval-row';
            
            // Render 1-4 scale
            let radiosHTML = '';
            for (let i = 1; i <= 4; i++) {
                const isChecked = evalState[q.id] === i ? 'checked' : '';
                radiosHTML += `
                    <label class="eval-label">
                        <input type="radio" name="${q.id}" value="${i}" ${isChecked}>
                        ${i}
                    </label>
                `;
            }

            row.innerHTML = `
                <div class="eval-q">${q.text}</div>
                <div class="eval-radios">${radiosHTML}</div>
            `;
            
            // Listen to changes
            row.querySelectorAll('input').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    evalState[q.id] = parseInt(e.target.value, 10);
                    localStorage.setItem('ahsas_seminar_eval', JSON.stringify(evalState));
                    updateReflectionButton();
                });
            });

            evalForm.appendChild(row);
        });

        // Add the reflection button + results container
        const reflectionArea = document.createElement('div');
        reflectionArea.id = 'reflectionArea';
        reflectionArea.innerHTML = `
            <button id="btnReflection" class="btn-primary" style="width:100%;margin-top:var(--space-lg);padding:var(--space-md);font-size:1rem;display:none;">
                🪞 See My Reflection
            </button>
            <div id="reflectionResults" style="margin-top:var(--space-lg);"></div>
        `;
        evalForm.appendChild(reflectionArea);

        updateReflectionButton();

        // Wire up the button
        const reflBtn = document.getElementById('btnReflection');
        if (reflBtn) {
            reflBtn.addEventListener('click', generateReflection);
        }
    }

    function updateReflectionButton() {
        const btn = document.getElementById('btnReflection');
        if (!btn) return;
        const answered = EVAL_QUESTIONS.filter(q => evalState[q.id] != null).length;
        if (answered >= EVAL_QUESTIONS.length) {
            btn.style.display = 'block';
            btn.textContent = '🪞 See My Reflection';
        } else if (answered > 0) {
            btn.style.display = 'block';
            btn.textContent = `🪞 See My Reflection (${answered}/${EVAL_QUESTIONS.length} answered)`;
            btn.style.opacity = '0.6';
        } else {
            btn.style.display = 'none';
        }
    }

    // ===== Reflection / Feedback Engine =====
    function generateReflection() {
        const results = document.getElementById('reflectionResults');
        if (!results) return;

        const answered = EVAL_QUESTIONS.filter(q => evalState[q.id] != null);
        if (answered.length === 0) {
            results.innerHTML = '<p style="color:var(--text-dim);text-align:center;">Complete the self-evaluation above first.</p>';
            return;
        }

        // Categorize scores
        const categories = {};
        EVAL_QUESTIONS.forEach(q => {
            const score = evalState[q.id];
            if (score == null) return;
            if (!categories[q.category]) categories[q.category] = { total: 0, count: 0, items: [] };
            categories[q.category].total += score;
            categories[q.category].count++;
            categories[q.category].items.push({ ...q, score });
        });

        // Compute averages and sort
        const catEntries = Object.entries(categories).map(([name, data]) => ({
            name,
            avg: data.total / data.count,
            ...data,
            meta: CATEGORY_META[name] || { icon: '📋', desc: '' }
        }));

        const strengths = catEntries.filter(c => c.avg >= 3).sort((a, b) => b.avg - a.avg);
        const growthAreas = catEntries.filter(c => c.avg < 3).sort((a, b) => a.avg - b.avg);

        // Individual item analysis
        const topItems = EVAL_QUESTIONS
            .filter(q => evalState[q.id] >= 4)
            .map(q => q.text);
        const growItems = EVAL_QUESTIONS
            .filter(q => evalState[q.id] != null && evalState[q.id] <= 2)
            .map(q => ({ text: q.text, tip: q.tip, score: evalState[q.id] }));

        // Overall score
        const totalScore = EVAL_QUESTIONS.reduce((sum, q) => sum + (evalState[q.id] || 0), 0);
        const maxScore = EVAL_QUESTIONS.length * 4;
        const pct = Math.round((totalScore / maxScore) * 100);

        // Build score bar color
        let barColor = 'var(--vermillion)';
        if (pct >= 75) barColor = 'var(--jade)';
        else if (pct >= 50) barColor = 'var(--gold)';

        let html = '';

        // Overall Score Bar
        html += `
        <div style="background:var(--subtle-bg);border-radius:var(--radius-md);padding:var(--space-lg);margin-bottom:var(--space-lg);border:1px solid var(--border);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm);">
                <strong style="font-size:1.05rem;">Overall Self-Assessment</strong>
                <span style="font-size:1.2rem;font-weight:800;color:${barColor};">${totalScore} / ${maxScore}</span>
            </div>
            <div style="background:var(--border);border-radius:20px;height:12px;overflow:hidden;">
                <div style="width:${pct}%;height:100%;background:${barColor};border-radius:20px;transition:width 0.6s ease;"></div>
            </div>
            <p style="color:var(--text-dim);font-size:0.8rem;margin-top:var(--space-xs);text-align:right;">${pct}%</p>
        </div>`;

        // Category Breakdown
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:var(--space-sm);margin-bottom:var(--space-lg);">`;
        catEntries.forEach(cat => {
            const catPct = Math.round((cat.avg / 4) * 100);
            let catColor = 'var(--vermillion)';
            if (cat.avg >= 3) catColor = 'var(--jade)';
            else if (cat.avg >= 2) catColor = 'var(--gold)';
            html += `
            <div style="background:var(--subtle-bg);border-radius:var(--radius);padding:var(--space-md);text-align:center;border:1px solid var(--border);">
                <div style="font-size:1.5rem;">${cat.meta.icon}</div>
                <div style="font-weight:700;font-size:0.85rem;margin:4px 0;">${cat.name}</div>
                <div style="font-size:1.1rem;font-weight:800;color:${catColor};">${cat.avg.toFixed(1)}</div>
                <div style="font-size:0.7rem;color:var(--text-dim);">out of 4.0</div>
            </div>`;
        });
        html += `</div>`;

        // Strengths
        if (topItems.length > 0) {
            html += `
            <div style="background:rgba(74,160,120,0.08);border:1px solid rgba(74,160,120,0.3);border-radius:var(--radius-md);padding:var(--space-md);margin-bottom:var(--space-md);">
                <strong style="color:var(--jade);">🌟 Your Strengths</strong>
                <ul style="margin:var(--space-sm) 0 0;padding-left:1.2rem;line-height:1.7;">
                    ${topItems.map(t => `<li style="font-size:0.88rem;">${t}</li>`).join('')}
                </ul>
            </div>`;
        }

        // Growth Areas with Actionable Tips
        if (growItems.length > 0) {
            html += `
            <div style="background:rgba(212,160,57,0.08);border:1px solid rgba(212,160,57,0.3);border-radius:var(--radius-md);padding:var(--space-md);margin-bottom:var(--space-md);">
                <strong style="color:var(--gold);">🌱 Growth Areas & Next Steps</strong>
                <div style="margin-top:var(--space-sm);">
                    ${growItems.map(item => `
                        <div style="padding:var(--space-sm) 0;border-bottom:1px dotted var(--border);">
                            <div style="font-size:0.88rem;font-weight:600;">${item.text}</div>
                            <div style="font-size:0.82rem;color:var(--jade);margin-top:4px;font-style:italic;">💡 ${item.tip}</div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        // No growth areas — excellent!
        if (growItems.length === 0 && topItems.length > 0) {
            html += `
            <div style="background:rgba(74,160,120,0.08);border:1px solid rgba(74,160,120,0.3);border-radius:var(--radius-md);padding:var(--space-md);text-align:center;margin-bottom:var(--space-md);">
                <strong style="color:var(--jade);">🏆 Excellent self-assessment!</strong>
                <p style="font-size:0.88rem;color:var(--text-dim);margin-top:var(--space-xs);">You rated yourself highly across all areas. Challenge yourself: can you mentor a classmate who needs support?</p>
            </div>`;
        }

        // Middle-range advice
        if (growItems.length === 0 && topItems.length === 0) {
            html += `
            <div style="background:rgba(212,160,57,0.08);border:1px solid rgba(212,160,57,0.3);border-radius:var(--radius-md);padding:var(--space-md);text-align:center;">
                <strong style="color:var(--gold);">📈 Solid Foundation</strong>
                <p style="font-size:0.88rem;color:var(--text-dim);margin-top:var(--space-xs);">You're meeting expectations consistently. Push for a 4 in your strongest category next seminar.</p>
            </div>`;
        }

        // Animate in
        results.style.opacity = '0';
        results.innerHTML = html;
        requestAnimationFrame(() => {
            results.style.transition = 'opacity 0.4s ease';
            results.style.opacity = '1';
        });

        // Scroll into view
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function updateDisplay(moveId, isPositive) {
        const countEl = document.getElementById(`count-${moveId}`);
        if (countEl) {
            countEl.textContent = counts[moveId];
            countEl.classList.remove('pulse-anim');
            void countEl.offsetWidth; // trigger reflow
            countEl.classList.add('pulse-anim');
        }

        if (isPositive && totalDisplay) {
            let total = 0;
            POSITIVE_MOVES.forEach(m => total += (counts[m.id] || 0));
            totalDisplay.textContent = total;
            totalDisplay.classList.remove('pulse-anim');
            void totalDisplay.offsetWidth;
            totalDisplay.classList.add('pulse-anim');
        }
    }

    function saveData() {
        localStorage.setItem('ahsas_seminar_dna', JSON.stringify(counts));
    }

    // 3. Reset Button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your current tracking and self-evaluation history?')) {
                counts = {};
                evalState = {};
                saveData();
                localStorage.removeItem('ahsas_seminar_eval');
                
                renderGrid();
                renderEvalForm();
                const results = document.getElementById('reflectionResults');
                if (results) results.innerHTML = '';
            }
        });
    }

    // Init All
    renderGrid();
    renderEvalForm();
});
