// Seminar Toolkit Module
// Implements localStorage Discussion DNA tracking and Self-Assessment Form

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
    { id: 'q-eye', text: 'I looked at the one other person who was speaking.' },
    { id: 'q-listen', text: 'I was courteous by actively listening and waiting my turn.' },
    { id: 'q-open', text: 'I listened to the ideas of others with an open mind.' },
    { id: 'q-uncertain', text: 'I shared my ideas even when I was uncertain.' },
    { id: 'q-build', text: 'I built on what was said while giving my opinion.' },
    { id: 'q-evidence', text: 'I used specific and accurate evidence to support my ideas.' },
    { id: 'q-connect', text: 'I made connections between multiple texts/ideas.' },
    { id: 'q-new', text: 'I contributed new ideas to the dialogue.' },
    { id: 'q-tangent', text: 'I avoided going on tangents unrelated to the focus.' }
];

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
                });
            });

            evalForm.appendChild(row);
        });
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
            }
        });
    }

    // Init All
    renderGrid();
    renderEvalForm();
});
