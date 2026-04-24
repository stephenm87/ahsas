    const TOTAL_STEPS = 7;
    let currentStep = 1;
    let completedSteps = new Set();
    const STORAGE_KEY = 'ahsas_research_studio';
    let _outlineRecorded = false; // prevent duplicate skill recording per session


    document.addEventListener('DOMContentLoaded', function() {
        loadState();
        renderTracker();
        buildSourceHunt();
        buildMatrix();
        buildBodyParagraphs();
        setupAutoSave();

        // Word counts for key textareas
        [['researchQuestion', 'wcResearchQ'], ['thesisStatement', 'wcThesisStatement']].forEach(([taId, wcId]) => {
            const ta = document.getElementById(taId);
            const wc = document.getElementById(wcId);
            if (!ta || !wc) return;
            const update = () => {
                const text = ta.value.trim();
                const words = text ? text.split(/\s+/).length : 0;
                wc.textContent = words + ' word' + (words !== 1 ? 's' : '');
                wc.classList.toggle('has-content', words > 0);
            };
            ta.addEventListener('input', update);
            update();
        });
        
        // Expose functions to window if called via inline onclick handlers
        window.goToStep = goToStep;
        window.addSubQuestion = addSubQuestion;
        window.analyzeQuestion = analyzeQuestion;
        window.analyzeThesis = analyzeThesis;
        window.useStarter = useStarter;
        window.openPreview = openPreview;
        window.closePreview = closePreview;
        window.copyOutline = copyOutline;
        window.printOutline = printOutline;
        window.downloadDoc = downloadDoc;
        window.printStep = printStep;
        window.copyStep = copyStep;
        window.downloadStepDoc = downloadStepDoc;
        window.addManualParagraph = addManualParagraph;
        
        // Build flowchart on step change
        buildFlowchart();
        
        // Check for cross-tool handoff imports
        checkResearchHandoff();
        
        // Load Source Analyzer completions for pipeline
        loadSourceAnalyzerData();
    });

    // ===== Cross-Tool Pipeline: Import from CER Builder or Compare Tool =====
    function checkResearchHandoff() {
        try {
            const raw = localStorage.getItem('ahsas_research_handoff');
            if (!raw) return;
            const data = JSON.parse(raw);
            localStorage.removeItem('ahsas_research_handoff');

            if (data.from === 'cer-builder') {
                // Pre-fill from CER Builder
                const topicEl = document.getElementById('topicExploration');
                if (topicEl && !topicEl.value && data.claim) {
                    // Extract topic from claim
                    topicEl.value = data.claim;
                }
                const rqEl = document.getElementById('researchQuestion');
                if (rqEl && !rqEl.value && data.claim) {
                    // Convert claim to question
                    rqEl.value = 'To what extent ' + data.claim.charAt(0).toLowerCase() + data.claim.slice(1).replace(/\.$/, '') + '?';
                }
            } else if (data.from === 'compare') {
                // Pre-fill from Compare Tool
                const topicEl = document.getElementById('topicExploration');
                if (topicEl && !topicEl.value && data.comparison) {
                    topicEl.value = data.comparison;
                }
                const rqEl = document.getElementById('researchQuestion');
                if (rqEl && !rqEl.value && data.comparison) {
                    rqEl.value = 'How did ' + data.comparison + '?';
                }
                const thesisEl = document.getElementById('thesisStatement');
                if (thesisEl && !thesisEl.value && data.synthesis) {
                    thesisEl.value = data.synthesis;
                }
            }

            saveState();

            // Show welcome banner
            const banner = document.getElementById('welcomeBackBanner');
            if (banner) {
                const fromLabel = data.from === 'cer-builder' ? 'CER Builder' : 'Compare Tool';
                banner.innerHTML = '<p>\ud83d\udce5 <strong>Imported from ' + fromLabel + '.</strong> Your work has been pre-filled. Review and refine each step.</p>' +
                    '<button class="btn btn-sm btn-gold" onclick="this.closest(\'.welcome-back-banner\').style.display=\'none\'">Dismiss</button>';
                banner.style.display = 'flex';
            }
        } catch(e) {}
    }

    const STEP_LABELS = ['Topic', 'Question', 'Sub-Qs', 'Sources', 'Evidence', 'Thesis', 'Outline'];

    function renderTracker() {
        const tracker = document.getElementById('stepTracker');
        let html = '';
        for (let i = 1; i <= TOTAL_STEPS; i++) {
            const isActive = i === currentStep;
            const isCompleted = completedSteps.has(i);
            const isLocked = i === 6 && !completedSteps.has(5);
            let cls = 'step-dot';
            if (isActive) cls += ' active';
            if (isCompleted) cls += ' completed';
            if (isLocked) cls += ' locked';
            html += `<div class="step-circle${isActive ? ' active' : ''}">`;
            html += `<div class="${cls}" onclick="${isLocked ? '' : 'goToStep(' + i + ')'}" title="Step ${i}: ${STEP_LABELS[i-1]}">${i}</div>`;
            html += `<span class="step-label">${STEP_LABELS[i-1]}</span>`;
            html += `</div>`;
            if (TOTAL_STEPS > i) html += `<div class="step-connector${isCompleted ? ' completed' : ''}"></div>`;
        }
        tracker.innerHTML = html;
    }

    function goToStep(n) {
        // ===== Substance-based step completion =====
        function isStepSubstantive(stepNum) {
            switch(stepNum) {
                case 1: {
                    const topic = document.getElementById('topicExploration');
                    const wc = topic ? (topic.value.trim().split(/\s+/).filter(Boolean).length) : 0;
                    return wc >= 8; // ~10 words with tolerance
                }
                case 2: {
                    const rq = document.getElementById('researchQuestion');
                    const wc = rq ? (rq.value.trim().split(/\s+/).filter(Boolean).length) : 0;
                    return wc >= 12; // ~15 words with tolerance
                }
                case 3: {
                    const sqs = getSubQuestions();
                    return sqs.length >= 2;
                }
                case 4: {
                    const hunts = document.querySelectorAll('[data-hunt]');
                    let filledCount = 0;
                    hunts.forEach(h => { if (h.value && h.value.trim().length > 5) filledCount++; });
                    return filledCount >= 2;
                }
                case 5: {
                    const findings = document.querySelectorAll('[data-matrix-finding]');
                    let filledCount = 0;
                    findings.forEach(f => { if (f.value && f.value.trim().length > 10) filledCount++; });
                    return filledCount >= 2;
                }
                default: return true;
            }
        }

        // Enforce inquiry sequence: cannot go to step 6 without completing 1-5
        if (n === 6) {
            const incomplete = [];
            const stepNames = ['', 'Topic Exploration', 'Research Question', 'Sub-Questions', 'Source Hunt', 'Evidence Matrix'];
            for (let i = 1; i <= 5; i++) {
                if (!isStepSubstantive(i)) incomplete.push('Step ' + i + ' (' + stepNames[i] + ')');
            }
            if (incomplete.length > 0) {
                alert('\ud83d\udcdd The Inquiry Principle\n\nYour thesis should emerge from your research, not the other way around.\n\nComplete these steps first:\n\u2022 ' + incomplete.join('\n\u2022 ') + '\n\nEach step needs meaningful content before you can write your thesis.');
                return;
            }
        }

        // Mark current step as completed if moving forward AND substantive
        if (n > currentStep) {
            if (isStepSubstantive(currentStep)) {
                completedSteps.add(currentStep);
            }
        }

        document.querySelectorAll('.step-card').forEach(c => c.classList.remove('active'));
        const stepEl = document.getElementById('step' + n);
        if (stepEl) {
            stepEl.classList.add('active');
            currentStep = n;
        }

        // Populate dynamic content
        if (n === 4) buildSourceHunt();
        if (n === 5) buildMatrix();
        if (n === 6) {
            const rq = document.getElementById('researchQuestion');
            document.getElementById('rqReminder').textContent = rq ? rq.value || '(complete Step 2 first)' : '';
        }
        if (n === 7) {
            const thesis = document.getElementById('thesisStatement');
            document.getElementById('thesisReminder').textContent = thesis ? thesis.value || '(complete Step 6 first)' : '';
            buildBodyParagraphs();
            setTimeout(buildFlowchart, 100);
            // Record Research & Inquiry skill completion (once per session)
            if (!_outlineRecorded && completedSteps.size >= 4) {
                _outlineRecorded = true;
                const rqEl = document.getElementById('researchQuestion');
                const rqText = (rqEl?.value || 'Research Project').trim().substring(0, 50);
                if (window.ahsasProgress) window.ahsasProgress.recordCompletion('research', rqText);
            }
        }

        renderTracker();
        saveState();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function getSubQuestions() {
        const textareas = document.querySelectorAll('[data-subq]');
        const sqs = [];
        textareas.forEach(ta => {
            if (ta.value.trim()) {
                const num = ta.getAttribute('data-subq');
                const pieceEl = document.querySelector(`[data-subq-piece="${num}"]`);
                sqs.push({
                    num: num,
                    text: ta.value.trim(),
                    piece: pieceEl ? pieceEl.value : ''
                });
            }
        });
        return sqs;
    }

    let subqCount = 3;
    function addSubQuestion() {
        subqCount++;
        const list = document.getElementById('subqList');
        const row = document.createElement('div');
        row.className = 'subq-row';
        row.innerHTML = `
            <div class="subq-number">${subqCount}</div>
            <div class="subq-fields">
                <textarea class="studio-input" rows="2" placeholder="Sub-question ${subqCount}..." data-subq="${subqCount}"></textarea>
                <select class="subq-pieces-select" data-subq-piece="${subqCount}">
                    <option value="">PIECES lens...</option>
                    <option value="political">🏛️ Political</option>
                    <option value="innovation">🔬 Innovation</option>
                    <option value="environmental">🌍 Environmental</option>
                    <option value="cultural">🎭 Cultural</option>
                    <option value="economic">💰 Economic</option>
                    <option value="social">👥 Social</option>
                </select>
            </div>
        `;
        list.appendChild(row);
    }

    function buildSourceHunt() {
        const area = document.getElementById('sourceHuntArea');
        if (!area) return;
        const sqs = getSubQuestions();
        if (sqs.length === 0) {
            area.innerHTML = '<p class="field-hint">Complete Step 3 first — your sub-questions will appear here.</p>';
            return;
        }
        area.innerHTML = sqs.map(sq => `
            <div class="field-group" style="background:var(--bg-card);padding:var(--space-md);border-radius:var(--radius-md);border:1px solid var(--border);box-shadow:var(--shadow-sm);">
                <label class="field-label" style="font-size:1.1rem;color:var(--jade);">Sub-Question ${sq.num}: <span style="font-weight:normal;color:var(--text);">${sq.text}</span></label>
                <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-md);">Find 2 credible sources that help answer this specific question. Evaluate their reliability.</p>
                
                <!-- Source 1 -->
                <div style="background:var(--subtle-bg);padding:var(--space-md);border-radius:var(--radius-sm);border:1px solid var(--border);margin-bottom:var(--space-sm);">
                    <div style="font-weight:600;font-size:0.9rem;margin-bottom:var(--space-xs);">Source 1</div>
                    <input class="studio-input" placeholder="Title, Author, or Citation..." data-hunt="${sq.num}-1" style="margin-bottom:var(--space-xs);">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-xs);">
                        <select class="studio-input" style="padding:8px;" data-hunt-type="${sq.num}-1">
                            <option value="">Source Type...</option>
                            <option value="academic">Academic Journal / Book</option>
                            <option value="primary">Primary Source Document</option>
                            <option value="news">Verified News / Article</option>
                            <option value="other">Other / Web</option>
                        </select>
                        <select class="studio-input" style="padding:8px;" data-hunt-rel="${sq.num}-1">
                            <option value="">Relationship...</option>
                            <option value="confirms">✅ Confirms my thinking</option>
                            <option value="complicates">⚠️ Complicates things</option>
                            <option value="contradicts">❌ Contradicts theory</option>
                        </select>
                    </div>
                    <textarea class="studio-input" rows="2" placeholder="Evaluate reliability (CRAAP: Currency, Relevance, Authority, Accuracy, Purpose)..." data-hunt-eval="${sq.num}-1"></textarea>
                    <a href="/source-analyzer.html" target="_blank" class="sa-deeplink" title="Open Source Analyzer to do a full HIPP/API + C.E.C. analysis">🔍 Analyze in Source Analyzer →</a>
                </div>

                <!-- Source 2 -->
                <div style="background:var(--subtle-bg);padding:var(--space-md);border-radius:var(--radius-sm);border:1px solid var(--border);">
                    <div style="font-weight:600;font-size:0.9rem;margin-bottom:var(--space-xs);">Source 2</div>
                    <input class="studio-input" placeholder="Title, Author, or Citation..." data-hunt="${sq.num}-2" style="margin-bottom:var(--space-xs);">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-xs);">
                        <select class="studio-input" style="padding:8px;" data-hunt-type="${sq.num}-2">
                            <option value="">Source Type...</option>
                            <option value="academic">Academic Journal / Book</option>
                            <option value="primary">Primary Source Document</option>
                            <option value="news">Verified News / Article</option>
                            <option value="other">Other / Web</option>
                        </select>
                        <select class="studio-input" style="padding:8px;" data-hunt-rel="${sq.num}-2">
                            <option value="">Relationship...</option>
                            <option value="confirms">✅ Confirms my thinking</option>
                            <option value="complicates">⚠️ Complicates things</option>
                            <option value="contradicts">❌ Contradicts theory</option>
                        </select>
                    </div>
                    <textarea class="studio-input" rows="2" placeholder="Evaluate reliability (OPVL: Origin, Purpose, Value, Limitations)..." data-hunt-eval="${sq.num}-2"></textarea>
                    <a href="/source-analyzer.html" target="_blank" class="sa-deeplink" title="Open Source Analyzer to do a full HIPP/API + C.E.C. analysis">🔍 Analyze in Source Analyzer →</a>
                </div>
            </div>
        `).join('');

        area.innerHTML += `
          <div class="nt-bridge">
            <div class="nt-bridge-icon">📚</div>
            <div class="nt-bridge-body">
              <div class="nt-bridge-header">
                <span class="nt-wordmark">NoodleTools</span>
                <span class="nt-bridge-tip">Build your Works Cited as you go</span>
              </div>
              <p class="nt-bridge-desc">
                As you track each source above, add it to your <strong>NoodleTools project</strong> right away — don't leave citations until the end.
                Have your source type, author, title, URL, and publication date ready.
              </p>
              <a class="nt-btn" href="https://my.noodletools.com" target="_blank" rel="noopener noreferrer">
                Open NoodleTools for this project ↗
              </a>
            </div>
          </div>`;
    }

    function buildMatrix() {
        const container = document.getElementById('matrixContainer');
        if (!container) return;
        const sqs = getSubQuestions();
        if (sqs.length === 0) {
            container.innerHTML = '<p class="field-hint">Complete Steps 3 and 4 first — the matrix will auto-populate.</p>';
            return;
        }
        
        let html = `<div style="display:flex;flex-direction:column;gap:var(--space-lg);">`;
        sqs.forEach(sq => {
            html += `
            <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="background:rgba(45,138,110,0.1);padding:var(--space-md);border-bottom:1px solid var(--border);">
                    <div style="font-weight:600;color:var(--jade);margin-bottom:4px;">Sub-Question ${sq.num}</div>
                    <div style="font-size:0.95rem;">${sq.text}</div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);padding:var(--space-md);border-bottom:1px solid var(--border);">
                    <div style="display:flex;flex-direction:column;gap:var(--space-xs);">
                        <label class="field-label" style="font-size:0.85rem;margin-bottom:2px;">Source 1: Key Finding</label>
                        <textarea class="studio-input" rows="3" data-matrix-finding="${sq.num}-1" placeholder="What specific fact/evidence does Source 1 provide?"></textarea>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:var(--space-xs);">
                        <label class="field-label" style="font-size:0.85rem;margin-bottom:2px;">Source 2: Key Finding</label>
                        <textarea class="studio-input" rows="3" data-matrix-finding="${sq.num}-2" placeholder="What specific fact/evidence does Source 2 provide?"></textarea>
                    </div>
                </div>
                <div style="padding:var(--space-md);background:var(--subtle-bg);">
                    <label class="field-label" style="color:var(--jade);margin-bottom:var(--space-xs);">Synthesis: Connect the Dots</label>
                    <textarea class="studio-input" rows="2" data-matrix-synthesis="${sq.num}" placeholder="How do these two findings relate? Do they agree, disagree, or provide different puzzle pieces?"></textarea>
                </div>
            </div>`;
        });
        html += `</div>`;
        html += `
          <div class="nt-bridge" style="margin-top:var(--space-xl);">
            <div class="nt-bridge-icon">📚</div>
            <div class="nt-bridge-body">
              <div class="nt-bridge-header">
                <span class="nt-wordmark">NoodleTools</span>
                <span class="nt-bridge-tip">Turn each finding into a Notecard</span>
              </div>
              <p class="nt-bridge-desc">
                Each <strong>key finding</strong> above should become a NoodleTools notecard linked to its source.
                Copy the text → open NoodleTools → create a notecard. This makes writing your outline much faster.
              </p>
              <a class="nt-btn" href="https://my.noodletools.com" target="_blank" rel="noopener noreferrer">
                Open NoodleTools Notecards ↗
              </a>
            </div>
          </div>`;
        container.innerHTML = html;
        
        // Auto-populate from Source Analyzer data if available
        autoPopulateMatrix();
    }

    let manualParaCount = 0;

    function buildBodyParagraphs() {
        const container = document.getElementById('bodyParagraphs');
        if (!container) return;
        const sqs = getSubQuestions();
        let html = '';

        if (sqs.length === 0) {
            html += `
            <div style="text-align:center;padding:var(--space-lg);background:var(--subtle-bg);border-radius:var(--radius);border:1px dashed var(--border);margin-bottom:var(--space-md);">
                <p style="color:var(--text-dim);font-size:0.9rem;margin-bottom:var(--space-sm);">
                    📝 Body paragraphs are auto-generated from your <strong>sub-questions in Step 3</strong>.
                </p>
                <button class="btn-secondary" onclick="goToStep(3)" style="margin-bottom:var(--space-sm);">
                    ← Go to Step 3 to add sub-questions
                </button>
                <p style="color:var(--text-dim);font-size:0.8rem;margin-top:var(--space-sm);">—  or  —</p>
            </div>`;
        }

        // Render paragraphs from sub-questions
        sqs.forEach((sq, i) => {
            html += buildParaSection(i + 1, `SQ${sq.num}`, sq.text, sq.num);
        });

        // Render any manually-added paragraphs
        for (let m = 1; m <= manualParaCount; m++) {
            const idx = sqs.length + m;
            html += buildParaSection(idx, `Manual`, '', `manual-${m}`);
        }

        html += `
        <button class="btn-secondary" onclick="addManualParagraph()" style="width:100%;margin-top:var(--space-lg);padding:var(--space-md);border:2px dashed var(--gold);background:rgba(212,160,57,0.08);color:var(--gold);font-weight:700;font-size:1rem;cursor:pointer;transition:all 0.2s ease;letter-spacing:0.5px;" onmouseover="this.style.background='rgba(212,160,57,0.18)';this.style.borderStyle='solid'" onmouseout="this.style.background='rgba(212,160,57,0.08)';this.style.borderStyle='dashed'">
            ＋ Add Body Paragraph
        </button>`;

        container.innerHTML = html;
    }

    function buildParaSection(num, label, sqText, dataKey) {
        // Check for Source Analyzer data that could pre-fill
        const saData = getSourceAnalyzerForSQ(dataKey);
        const hasImport = saData && (saData.claim || saData.evidence || saData.reasoning);
        
        return `
            <div class="outline-section">
                <div class="outline-section-label body">Body Paragraph ${num} — ${label}</div>
                ${sqText ? `<p style="font-size:0.82rem;color:var(--text-dim);margin-bottom:var(--space-md);font-style:italic;">${sqText}</p>` : ''}
                ${hasImport ? `
                <div class="sa-import-banner">
                    <div class="sa-import-icon">🔗</div>
                    <div class="sa-import-body">
                        <div class="sa-import-label">Source Analyzer notes available</div>
                        <div class="sa-import-desc">Auto-fill from your C.E.C. & CER analysis of <strong>${saData.sourceTitle || 'source'}</strong></div>
                    </div>
                    <button class="sa-import-btn" onclick="importSAToOutline('${dataKey}')">↓ Import</button>
                </div>` : ''}
                <div class="field-group">
                    <label class="field-label">Claim</label>
                    <textarea class="studio-input" rows="2" placeholder="What argument will this paragraph make?" data-outline-claim="${dataKey}"></textarea>
                </div>
                <div class="field-group">
                    <label class="field-label">Evidence</label>
                    <textarea class="studio-input" rows="2" placeholder="What specific evidence supports this claim?" data-outline-evidence="${dataKey}"></textarea>
                </div>
                <div class="field-group" style="margin-bottom:0;">
                    <label class="field-label">Reasoning</label>
                    <textarea class="studio-input" rows="2" placeholder="How does this evidence support the claim? Why does it matter?" data-outline-reasoning="${dataKey}"></textarea>
                </div>
            </div>`;
    }

    function addManualParagraph() {
        manualParaCount++;
        buildBodyParagraphs();
        saveState();
    }

    // ===== Shared outline data helper =====
    function getOutlineData() {
        const rq = document.getElementById('researchQuestion')?.value || '';
        const thesis = document.getElementById('thesisStatement')?.value || '';
        const hook = document.getElementById('outlineHook')?.value || '';
        const bg = document.getElementById('outlineBg')?.value || '';
        const restate = document.getElementById('outlineRestate')?.value || '';
        const significance = document.getElementById('outlineSignificance')?.value || '';
        const sqs = getSubQuestions();
        const bodyParas = [];

        // From sub-questions
        sqs.forEach((sq, i) => {
            bodyParas.push({
                num: i + 1,
                sq: sq.text,
                claim: document.querySelector(`[data-outline-claim="${sq.num}"]`)?.value || '',
                evidence: document.querySelector(`[data-outline-evidence="${sq.num}"]`)?.value || '',
                reasoning: document.querySelector(`[data-outline-reasoning="${sq.num}"]`)?.value || ''
            });
        });

        // From manually-added paragraphs
        for (let m = 1; m <= manualParaCount; m++) {
            const key = `manual-${m}`;
            bodyParas.push({
                num: sqs.length + m,
                sq: '(manual paragraph)',
                claim: document.querySelector(`[data-outline-claim="${key}"]`)?.value || '',
                evidence: document.querySelector(`[data-outline-evidence="${key}"]`)?.value || '',
                reasoning: document.querySelector(`[data-outline-reasoning="${key}"]`)?.value || ''
            });
        }

        return { rq, thesis, hook, bg, restate, significance, bodyParas };
    }

    function toRoman(n) {
        const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
        const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
        let r = '';
        for (let i = 0; vals.length > i; i++) {
            while (n >= vals[i]) { r += syms[i]; n -= vals[i]; }
        }
        return r;
    }

    // ===== 4. Visual Flowchart =====
    function buildFlowchart() {
        const fc = document.getElementById('outlineFlowchart');
        if (!fc) return;
        const d = getOutlineData();
        const esc = t => t ? t.substring(0, 80) + (t.length > 80 ? '…' : '') : '<em>Not yet written</em>';
        
        let html = `
            <div class="flow-node intro">
                <div class="flow-label">Introduction</div>
                <div class="flow-content">${esc(d.hook || d.thesis)}</div>
            </div>
            <div class="flow-arrow"></div>`;
        
        d.bodyParas.forEach((bp, i) => {
            html += `
            <div class="flow-node body">
                <div class="flow-label">Body ¶${bp.num}: ${esc(bp.sq)}</div>
                <div class="flow-content">${esc(bp.claim)}</div>
            </div>
            <div class="flow-arrow"></div>`;
        });
        
        html += `
            <div class="flow-node conclusion">
                <div class="flow-label">Conclusion</div>
                <div class="flow-content">${esc(d.restate || d.significance)}</div>
            </div>`;
        
        fc.innerHTML = html;
    }

    // ===== 1. Preview Modal =====
    function openPreview() {
        buildFlowchart();
        const d = getOutlineData();
        const v = (text) => text ? text : '<span class="empty">(not yet written)</span>';
        
        let html = `
            <h1>📝 Research Paper Outline</h1>
            <div class="preview-rq"><strong>Research Question:</strong> ${v(d.rq)}</div>
            
            <h2 class="intro-h">I. Introduction</h2>
            <div class="preview-field"><span class="pf-label">Hook / Context:</span> <span class="pf-value">${v(d.hook)}</span></div>
            <div class="preview-field"><span class="pf-label">Background:</span> <span class="pf-value">${v(d.bg)}</span></div>
            <div class="preview-field"><span class="pf-label">Thesis:</span> <span class="pf-value"><strong>${v(d.thesis)}</strong></span></div>`;
        
        d.bodyParas.forEach((bp, i) => {
            const rn = toRoman(i + 2); // II, III, IV...
            html += `
            <h2 class="body-h">${rn}. Body Paragraph ${bp.num}</h2>
            <div class="preview-sq-label">Sub-Question: ${v(bp.sq)}</div>
            <div class="preview-field"><span class="pf-label">Claim:</span> <span class="pf-value">${v(bp.claim)}</span></div>
            <div class="preview-field"><span class="pf-label">Evidence:</span> <span class="pf-value">${v(bp.evidence)}</span></div>
            <div class="preview-field"><span class="pf-label">Reasoning:</span> <span class="pf-value">${v(bp.reasoning)}</span></div>`;
        });
        
        const concNum = toRoman(d.bodyParas.length + 2);
        html += `
            <h2 class="conclusion-h">${concNum}. Conclusion</h2>
            <div class="preview-field"><span class="pf-label">Restate Thesis:</span> <span class="pf-value">${v(d.restate)}</span></div>
            <div class="preview-field"><span class="pf-label">Significance:</span> <span class="pf-value">${v(d.significance)}</span></div>`;
        
        document.getElementById('previewContent').innerHTML = html;
        document.getElementById('previewOverlay').classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    function closePreview() {
        document.getElementById('previewOverlay').classList.remove('open');
        document.body.style.overflow = '';
    }

    // ===== 2. Copy to Clipboard =====
    function copyOutline() {
        const d = getOutlineData();
        let text = '# Research Paper Outline\n\n';
        text += `## Research Question\n${d.rq}\n\n`;
        text += `## Thesis\n${d.thesis}\n\n`;
        text += `---\n\n## Introduction\n**Hook:** ${d.hook}\n\n**Background:** ${d.bg}\n\n**Thesis:** ${d.thesis}\n\n`;
        d.bodyParas.forEach(bp => {
            text += `## Body Paragraph ${bp.num}: ${bp.sq}\n`;
            text += `- **Claim:** ${bp.claim}\n`;
            text += `- **Evidence:** ${bp.evidence}\n`;
            text += `- **Reasoning:** ${bp.reasoning}\n\n`;
        });
        text += `## Conclusion\n**Restate Thesis:** ${d.restate}\n\n**Significance:** ${d.significance}\n`;

        navigator.clipboard.writeText(text).then(() => {
            showIndicator('✅ Outline copied to clipboard!');
        }).catch(() => {
            // Fallback: download
            const blob = new Blob([text], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'research-outline.md'; a.click();
            URL.revokeObjectURL(url);
            showIndicator('📥 Downloaded as research-outline.md');
        });
    }

    // ===== 3. Print / Save as PDF =====
    function printOutline() {
        openPreview();
        setTimeout(() => { window.print(); }, 400);
    }

    // ===== 3b. Per-Step Print =====
    function printStep(stepNum) {
        const container = document.getElementById('stepPrintContainer');
        if (!container) return;

        const STEP_TITLES = {
            1: '🗺️ Topic Exploration',
            2: '❓ Question Workshop',
            3: '🔀 Sub-Question Mapping',
            4: '🔍 Source Hunt',
            5: '📊 Evidence Matrix',
            6: '💡 Emerging Thesis',
            7: '📝 Outline Builder'
        };
        const STEP_SKILLS = {
            1: 'Curiosity & Topic Selection',
            2: 'Questioning & Critical Thinking',
            3: 'Decomposition & Analytical Framing',
            4: 'Source Evaluation & Evidence Gathering',
            5: 'Synthesis & Pattern Recognition',
            6: 'Thesis Construction from Evidence',
            7: 'Essay Architecture & CER Integration'
        };

        const v = (val) => val && val.trim() ? `<span class="print-field-value">${val.trim()}</span>` : `<span class="print-field-empty">(not yet completed)</span>`;
        const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let html = `<h1>Research Studio — Step ${stepNum}: ${STEP_TITLES[stepNum]}</h1>`;
        html += `<div class="print-meta">Skill: ${STEP_SKILLS[stepNum]} · Printed ${now}</div>`;

        switch (stepNum) {
            case 1: {
                const area = document.getElementById('topicArea')?.value || '';
                const why = document.getElementById('topicWhy')?.value || '';
                const qs = document.getElementById('topicQuestions')?.value || '';
                html += `<div class="print-field"><div class="print-field-label">Broad Area of Interest</div>${v(area)}</div>`;
                html += `<div class="print-field"><div class="print-field-label">Why Does This Interest You?</div>${v(why)}</div>`;
                html += `<div class="print-field"><div class="print-field-label">Initial Questions (Brainstorm)</div>${v(qs)}</div>`;
                break;
            }
            case 2: {
                const rq = document.getElementById('researchQuestion')?.value || '';
                const checks = [...document.querySelectorAll('.rq-check')];
                const checkLabels = [
                    'Open-ended (not yes/no)',
                    'Specific enough to research',
                    'Requires analysis, not just description',
                    'Connects to a PIECES theme',
                    'Genuinely interesting to me'
                ];
                html += `<div class="print-field"><div class="print-field-label">Research Question</div>${v(rq)}</div>`;
                html += `<div class="print-field"><div class="print-field-label">Quality Checklist</div>`;
                checks.forEach((c, i) => {
                    html += `<div class="print-checklist-item">${c.checked ? '☑' : '☐'} ${checkLabels[i] || ''}</div>`;
                });
                html += `</div>`;
                break;
            }
            case 3: {
                const sqs = getSubQuestions();
                const piecesLabels = { political: '🏛️ Political', innovation: '🔬 Innovation', environmental: '🌍 Environmental', cultural: '🎭 Cultural', economic: '💰 Economic', social: '👥 Social' };
                if (sqs.length === 0) {
                    html += `<div class="print-field"><div class="print-field-empty">No sub-questions written yet.</div></div>`;
                } else {
                    sqs.forEach(sq => {
                        html += `<div class="print-subq"><div class="print-subq-num">Sub-Question ${sq.num}</div>`;
                        html += `<div class="print-field-value">${sq.text}</div>`;
                        if (sq.piece) html += `<div style="font-size:9pt;color:#666;margin-top:2px;">PIECES Lens: ${piecesLabels[sq.piece] || sq.piece}</div>`;
                        html += `</div>`;
                    });
                }
                break;
            }
            case 4: {
                const sqs = getSubQuestions();
                if (sqs.length === 0) {
                    html += `<div class="print-field"><div class="print-field-empty">Complete sub-questions first.</div></div>`;
                } else {
                    sqs.forEach(sq => {
                        html += `<div class="print-subq"><div class="print-subq-num">Sources for Sub-Question ${sq.num}: ${sq.text}</div>`;
                        for (let s = 1; s <= 2; s++) {
                            const title = document.querySelector(`[data-hunt="${sq.num}-${s}"]`)?.value || '';
                            const type = document.querySelector(`[data-hunt-type="${sq.num}-${s}"]`)?.value || '';
                            const rel = document.querySelector(`[data-hunt-rel="${sq.num}-${s}"]`)?.value || '';
                            const evalN = document.querySelector(`[data-hunt-eval="${sq.num}-${s}"]`)?.value || '';
                            const relLabels = { confirms: '✅ Confirms', complicates: '⚠️ Complicates', contradicts: '❌ Contradicts' };
                            html += `<div style="margin-top:8px;padding-left:12px;border-left:2px solid #ddd;">`;
                            html += `<div class="print-field-label">Source ${s}</div>`;
                            html += `<div class="print-field">${v(title)}</div>`;
                            if (type) html += `<div style="font-size:9pt;color:#666;">Type: ${type}</div>`;
                            if (rel) html += `<div style="font-size:9pt;color:#666;">Relationship: ${relLabels[rel] || rel}</div>`;
                            if (evalN) html += `<div class="print-field"><div class="print-field-label">Evaluation</div>${v(evalN)}</div>`;
                            html += `</div>`;
                        }
                        html += `</div>`;
                    });
                }
                break;
            }
            case 5: {
                const sqs = getSubQuestions();
                const patterns = document.getElementById('emergingPatterns')?.value || '';
                if (sqs.length === 0) {
                    html += `<div class="print-field"><div class="print-field-empty">Complete sub-questions first.</div></div>`;
                } else {
                    sqs.forEach(sq => {
                        html += `<div class="print-subq"><div class="print-subq-num">Evidence for Sub-Question ${sq.num}: ${sq.text}</div>`;
                        const f1 = document.querySelector(`[data-matrix-finding="${sq.num}-1"]`)?.value || '';
                        const f2 = document.querySelector(`[data-matrix-finding="${sq.num}-2"]`)?.value || '';
                        const syn = document.querySelector(`[data-matrix-synthesis="${sq.num}"]`)?.value || '';
                        html += `<div class="print-field"><div class="print-field-label">Source 1 Finding</div>${v(f1)}</div>`;
                        html += `<div class="print-field"><div class="print-field-label">Source 2 Finding</div>${v(f2)}</div>`;
                        html += `<div class="print-field"><div class="print-field-label">Synthesis</div>${v(syn)}</div>`;
                        html += `</div>`;
                    });
                }
                html += `<div class="print-field"><div class="print-field-label">Emerging Patterns</div>${v(patterns)}</div>`;
                break;
            }
            case 6: {
                const rq = document.getElementById('researchQuestion')?.value || '';
                const thesis = document.getElementById('thesisStatement')?.value || '';
                const checks = [...document.querySelectorAll('.thesis-check')];
                const checkLabels = [
                    'Directly answers the research question',
                    'Arguable (someone could disagree)',
                    'Specific (not vague or overly broad)',
                    'Supported by evidence',
                    'Acknowledges complexity (not one-sided)'
                ];
                html += `<div class="print-field"><div class="print-field-label">Research Question</div>${v(rq)}</div>`;
                html += `<div class="print-field"><div class="print-field-label">Thesis Statement</div>${v(thesis)}</div>`;
                html += `<div class="print-field"><div class="print-field-label">Thesis Checklist</div>`;
                checks.forEach((c, i) => {
                    html += `<div class="print-checklist-item">${c.checked ? '☑' : '☐'} ${checkLabels[i] || ''}</div>`;
                });
                html += `</div>`;
                break;
            }
            default:
                // Step 7 uses the existing full preview/print
                printOutline();
                return;
        }

        // Populate container and print
        container.innerHTML = html;
        // Small delay to ensure DOM renders before print dialog
        setTimeout(() => {
            window.print();
            // Clean up after print so it doesn't interfere next time
            setTimeout(() => { container.innerHTML = ''; }, 500);
        }, 300);
    }

    // ===== 3c. Per-Step Plain Text Generator (shared by copy & download) =====
    function getStepPlainText(stepNum) {
        const STEP_TITLES = {
            1: 'Topic Exploration', 2: 'Question Workshop', 3: 'Sub-Question Mapping',
            4: 'Source Hunt', 5: 'Evidence Matrix', 6: 'Emerging Thesis', 7: 'Outline Builder'
        };
        const STEP_SKILLS = {
            1: 'Curiosity & Topic Selection', 2: 'Questioning & Critical Thinking',
            3: 'Decomposition & Analytical Framing', 4: 'Source Evaluation & Evidence Gathering',
            5: 'Synthesis & Pattern Recognition', 6: 'Thesis Construction from Evidence',
            7: 'Essay Architecture & CER Integration'
        };
        const piecesLabels = { political: 'Political', innovation: 'Innovation', environmental: 'Environmental', cultural: 'Cultural', economic: 'Economic', social: 'Social' };
        const relLabels = { confirms: 'Confirms', complicates: 'Complicates', contradicts: 'Contradicts' };
        const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let text = `# Research Studio — Step ${stepNum}: ${STEP_TITLES[stepNum]}\n`;
        text += `Skill: ${STEP_SKILLS[stepNum]} · ${now}\n\n---\n\n`;

        switch (stepNum) {
            case 1: {
                const area = document.getElementById('topicArea')?.value || '';
                const why = document.getElementById('topicWhy')?.value || '';
                const qs = document.getElementById('topicQuestions')?.value || '';
                text += `## Broad Area of Interest\n${area || '(not yet completed)'}\n\n`;
                text += `## Why Does This Interest You?\n${why || '(not yet completed)'}\n\n`;
                text += `## Initial Questions (Brainstorm)\n${qs || '(not yet completed)'}\n`;
                break;
            }
            case 2: {
                const rq = document.getElementById('researchQuestion')?.value || '';
                const checks = [...document.querySelectorAll('.rq-check')];
                const checkLabels = ['Open-ended (not yes/no)', 'Specific enough to research', 'Requires analysis, not just description', 'Connects to a PIECES theme', 'Genuinely interesting to me'];
                text += `## Research Question\n${rq || '(not yet completed)'}\n\n`;
                text += `## Quality Checklist\n`;
                checks.forEach((c, i) => { text += `${c.checked ? '[x]' : '[ ]'} ${checkLabels[i] || ''}\n`; });
                text += '\n';
                break;
            }
            case 3: {
                const sqs = getSubQuestions();
                if (sqs.length === 0) {
                    text += '(No sub-questions written yet.)\n';
                } else {
                    sqs.forEach(sq => {
                        text += `### Sub-Question ${sq.num}\n${sq.text}\n`;
                        if (sq.piece) text += `PIECES Lens: ${piecesLabels[sq.piece] || sq.piece}\n`;
                        text += '\n';
                    });
                }
                break;
            }
            case 4: {
                const sqs = getSubQuestions();
                if (sqs.length === 0) {
                    text += '(Complete sub-questions first.)\n';
                } else {
                    sqs.forEach(sq => {
                        text += `### Sources for Sub-Question ${sq.num}: ${sq.text}\n\n`;
                        for (let s = 1; s <= 2; s++) {
                            const title = document.querySelector(`[data-hunt="${sq.num}-${s}"]`)?.value || '';
                            const type = document.querySelector(`[data-hunt-type="${sq.num}-${s}"]`)?.value || '';
                            const rel = document.querySelector(`[data-hunt-rel="${sq.num}-${s}"]`)?.value || '';
                            const evalN = document.querySelector(`[data-hunt-eval="${sq.num}-${s}"]`)?.value || '';
                            text += `**Source ${s}:** ${title || '(not yet added)'}\n`;
                            if (type) text += `Type: ${type}\n`;
                            if (rel) text += `Relationship: ${relLabels[rel] || rel}\n`;
                            if (evalN) text += `Evaluation: ${evalN}\n`;
                            text += '\n';
                        }
                    });
                }
                break;
            }
            case 5: {
                const sqs = getSubQuestions();
                const patterns = document.getElementById('emergingPatterns')?.value || '';
                if (sqs.length === 0) {
                    text += '(Complete sub-questions first.)\n\n';
                } else {
                    sqs.forEach(sq => {
                        text += `### Evidence for Sub-Question ${sq.num}: ${sq.text}\n\n`;
                        const f1 = document.querySelector(`[data-matrix-finding="${sq.num}-1"]`)?.value || '';
                        const f2 = document.querySelector(`[data-matrix-finding="${sq.num}-2"]`)?.value || '';
                        const syn = document.querySelector(`[data-matrix-synthesis="${sq.num}"]`)?.value || '';
                        text += `**Source 1 Finding:** ${f1 || '(not yet completed)'}\n`;
                        text += `**Source 2 Finding:** ${f2 || '(not yet completed)'}\n`;
                        text += `**Synthesis:** ${syn || '(not yet completed)'}\n\n`;
                    });
                }
                text += `## Emerging Patterns\n${patterns || '(not yet completed)'}\n`;
                break;
            }
            case 6: {
                const rq = document.getElementById('researchQuestion')?.value || '';
                const thesis = document.getElementById('thesisStatement')?.value || '';
                const checks = [...document.querySelectorAll('.thesis-check')];
                const checkLabels = ['Directly answers the research question', 'Arguable (someone could disagree)', 'Specific (not vague or overly broad)', 'Supported by evidence', 'Acknowledges complexity (not one-sided)'];
                text += `## Research Question\n${rq || '(not yet completed)'}\n\n`;
                text += `## Thesis Statement\n${thesis || '(not yet completed)'}\n\n`;
                text += `## Thesis Checklist\n`;
                checks.forEach((c, i) => { text += `${c.checked ? '[x]' : '[ ]'} ${checkLabels[i] || ''}\n`; });
                text += '\n';
                break;
            }
            default:
                // Step 7 — use existing full outline copy
                return null;
        }
        return text;
    }

    // ===== 3d. Copy Step to Clipboard =====
    function copyStep(stepNum) {
        if (stepNum === 7) { copyOutline(); return; }
        const text = getStepPlainText(stepNum);
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            showIndicator('✅ Step ' + stepNum + ' copied to clipboard!');
        }).catch(() => {
            // Fallback: download as .md
            const blob = new Blob([text], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `research-step-${stepNum}.md`; a.click();
            URL.revokeObjectURL(url);
            showIndicator('📥 Downloaded as research-step-' + stepNum + '.md');
        });
    }

    // ===== 3e. Download Step as .doc =====
    function downloadStepDoc(stepNum) {
        if (stepNum === 7) { downloadDoc(); return; }
        const text = getStepPlainText(stepNum);
        if (!text) return;

        const STEP_TITLES = {
            1: 'Topic Exploration', 2: 'Question Workshop', 3: 'Sub-Question Mapping',
            4: 'Source Hunt', 5: 'Evidence Matrix', 6: 'Emerging Thesis'
        };

        // Convert markdown-style text to basic HTML for Word
        let bodyHtml = text
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[x\]/g, '☑')
            .replace(/\[ \]/g, '☐')
            .replace(/^---$/gm, '<hr>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        bodyHtml = '<p>' + bodyHtml + '</p>';

        const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Research Studio - Step ${stepNum}</title>
<style>
  body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.8; color: #1a1a1a; max-width: 700px; margin: 0 auto; padding: 40px; }
  h1 { font-size: 16pt; border-bottom: 2px solid #ccc; padding-bottom: 8px; }
  h2 { font-size: 13pt; margin-top: 20px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 4px; }
  h3 { font-size: 12pt; margin-top: 16px; color: #c7403a; }
  hr { border: none; border-top: 1px solid #ddd; margin: 12px 0; }
  p { margin: 6pt 0; }
</style>
</head><body>${bodyHtml}</body></html>`;

        const blob = new Blob([html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `research-step-${stepNum}-${STEP_TITLES[stepNum].toLowerCase().replace(/\s+/g, '-')}.doc`;
        a.click();
        URL.revokeObjectURL(url);
        showIndicator('⬇️ Downloaded Step ' + stepNum + ' as .doc');
    }

    // ===== 5. Download as .doc =====
    function downloadDoc() {
        const d = getOutlineData();
        let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Research Outline</title>
<style>
  body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.8; color: #1a1a1a; max-width: 700px; margin: 0 auto; padding: 40px; }
  h1 { font-size: 18pt; border-bottom: 2px solid #ccc; padding-bottom: 8px; }
  h2 { font-size: 14pt; margin-top: 24px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  h2.intro { color: #2563eb; } h2.body { color: #c7403a; } h2.conclusion { color: #16a34a; }
  .label { font-weight: bold; color: #555; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.5px; }
  .sq { font-style: italic; color: #888; font-size: 11pt; margin-bottom: 6pt; }
  p { margin: 6pt 0; }
</style>    <script>(function(){var t=localStorage.getItem("ahsas-theme");if(!t)t=window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)})()</script>
</head><body>
<h1>Research Paper Outline</h1>
<p><em>Research Question:</em> ${d.rq}</p>
<h2 class="intro">I. Introduction</h2>
<p><span class="label">Hook:</span> ${d.hook || '(not yet written)'}</p>
<p><span class="label">Background:</span> ${d.bg || '(not yet written)'}</p>
<p><span class="label">Thesis:</span> <strong>${d.thesis || '(not yet written)'}</strong></p>`;

        d.bodyParas.forEach((bp, i) => {
            const rn = toRoman(i + 2);
            html += `<h2 class="body">${rn}. Body Paragraph ${bp.num}</h2>
<p class="sq">Sub-Question: ${bp.sq}</p>
<p><span class="label">Claim:</span> ${bp.claim || '(not yet written)'}</p>
<p><span class="label">Evidence:</span> ${bp.evidence || '(not yet written)'}</p>
<p><span class="label">Reasoning:</span> ${bp.reasoning || '(not yet written)'}</p>`;
        });

        const concNum = toRoman(d.bodyParas.length + 2);
        html += `<h2 class="conclusion">${concNum}. Conclusion</h2>
<p><span class="label">Restate Thesis:</span> ${d.restate || '(not yet written)'}</p>
<p><span class="label">Significance:</span> ${d.significance || '(not yet written)'}</p>
</body></html>`;

        const blob = new Blob([html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'research-outline.doc';
        a.click();
        URL.revokeObjectURL(url);
        showIndicator('⬇️ Downloaded research-outline.doc');
    }

    // ===== Quality Gate Engine (Early Steps) =====
    function checkResearchQuality(id) {
        if (!id) return;
        
        // Map elements
        let el, gate, type;
        if (id.startsWith('topic')) {
            el = document.getElementById(id);
            gate = document.getElementById('gate' + id.charAt(0).toUpperCase() + id.slice(1));
            type = 'topic';
        } else if (!isNaN(id)) {
            // It's a sub-question
            el = document.querySelector(`textarea[data-subq="${id}"]`);
            gate = document.getElementById(`gateSubq${id}`);
            type = 'subq';
        }

        if (!el || !gate) return;

        const val = el.value.trim();
        const wc = val ? val.split(/\s+/).length : 0;
        const lower = val.toLowerCase();

        gate.className = 'quality-gate visible';

        if (wc === 0) {
            gate.classList.remove('visible');
            return;
        }

        let issues = [];

        if (id === 'topicArea') {
            if (wc < 15) issues.push({ icon: '🔴', text: `<strong>Needs detail.</strong> Describe your historical period or topic of interest (~20 words). You have ${wc}.` });
        }
        else if (id === 'topicWhy') {
            if (wc < 12) issues.push({ icon: '🔴', text: `<strong>Develop your interest.</strong> Explain *why* this grabs your attention (~15 words). You have ${wc}.` });
        }
        else if (id === 'topicQuestions') {
            if (wc < 15) issues.push({ icon: '🔴', text: `<strong>Brainstorm more.</strong> List at least 3-4 initial questions (~20 words). You have ${wc}.` });
            if (!val.includes('?')) issues.push({ icon: '🟡', text: '<strong>Format correctly:</strong> Make sure you are actually writing questions ending with "?".' });
        }
        else if (type === 'subq') {
            if (wc < 6) issues.push({ icon: '🔴', text: `<strong>Too short.</strong> A sub-question needs enough scope to be researched (~8 words). You have ${wc}.` });
            if (!val.includes('?')) issues.push({ icon: '🔴', text: '<strong>Must be a question.</strong> Be sure to end with a question mark "?".' });
            
            const starters = ['how', 'why', 'what', 'to what extent', 'evaluate'];
            if (!starters.some(s => lower.startsWith(s)) && wc >= 3) {
                issues.push({ icon: '🟡', text: '<strong>Try open-ended starters.</strong> Questions starting with How or Why lead to deeper analysis than Who/When/Where.' });
            }
        }

        if (issues.length > 0) {
            const hasRed = issues.some(i => i.icon === '🔴');
            gate.classList.add(hasRed ? 'gate-fail' : 'gate-warn');
            gate.innerHTML = issues.map(i => `<div style="margin-top:4px;">${i.icon} ${i.text}</div>`).join('');
        } else {
            gate.classList.add('gate-pass');
            gate.innerHTML = `<div style="margin-top:4px;">✅ <strong>Solid.</strong> (${wc} words)</div>`;
        }
    }

    function showIndicator(msg) {
        const indicator = document.getElementById('saveIndicator');
        indicator.textContent = msg;
        indicator.style.color = 'var(--jade)';
        setTimeout(() => { indicator.textContent = ''; indicator.style.color = ''; }, 3000);
    }

    // Auto-save to localStorage
    function setupAutoSave() {
        document.addEventListener('input', (e) => {
            debounce(saveState, 1000)();
            if (e.target.matches('textarea.studio-input')) {
                debounce(() => checkResearchQuality(e.target.id || e.target.getAttribute('data-subq')), 500)();
            }
        });
        document.addEventListener('change', debounce(saveState, 500));
        
        // Initial checks
        setTimeout(() => {
            checkResearchQuality('topicArea');
            checkResearchQuality('topicWhy');
            checkResearchQuality('topicQuestions');
            for(let i=1; i<=subqCount; i++) checkResearchQuality(i.toString());
        }, 1000);
    }

    function saveState() {
        const state = {
            currentStep,
            completedSteps: [...completedSteps],
            fields: {}
        };
        document.querySelectorAll('.studio-input, [data-subq], [data-subq-piece], [data-hunt], [data-hunt-type], [data-hunt-rel], [data-hunt-eval], [data-matrix-finding], [data-matrix-synthesis], [data-outline-claim], [data-outline-evidence], [data-outline-reasoning]').forEach(el => {
            const key = el.id || el.getAttribute('data-subq') || el.getAttribute('data-subq-piece') || el.getAttribute('data-hunt') || el.getAttribute('data-hunt-type') || el.getAttribute('data-hunt-rel') || el.getAttribute('data-hunt-eval') || el.getAttribute('data-matrix-finding') || el.getAttribute('data-matrix-synthesis') || el.getAttribute('data-outline-claim') || el.getAttribute('data-outline-evidence') || el.getAttribute('data-outline-reasoning');
            if (key) state.fields[key] = el.value;
        });
        // Save checkboxes
        state.rqChecks = [...document.querySelectorAll('.rq-check')].map(c => c.checked);
        state.thesisChecks = [...document.querySelectorAll('.thesis-check')].map(c => c.checked);
        state.subqCount = subqCount;

        try {
            const serialised = JSON.stringify(state);
            if (window.AHSAS_SYNC) {
                window.AHSAS_SYNC.setItem(STORAGE_KEY, serialised);
            } else {
                localStorage.setItem(STORAGE_KEY, serialised);
            }
            // Show auto-save badge
            const badge = document.getElementById('researchAutosaveBadge');
            const textEl = document.getElementById('researchAutosaveText');
            if (badge && textEl) {
                const now = new Date();
                textEl.textContent = 'Saved at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                badge.classList.add('visible');
                clearTimeout(badge._hideTimer);
                badge._hideTimer = setTimeout(() => badge.classList.remove('visible'), 5000);
            }
        } catch (e) {}
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const state = JSON.parse(raw);
            currentStep = state.currentStep || 1;
            completedSteps = new Set(state.completedSteps || []);
            subqCount = state.subqCount || 3;

            // Add extra subq rows if needed
            // Use a helper variable to avoid tripping Vite's HTML parser
            var _rowCount = document.querySelectorAll('.subq-row').length;
            while (_rowCount++ !== subqCount) {
                addSubQuestion();
            }

            // Restore fields
            if (state.fields) {
                Object.entries(state.fields).forEach(([key, val]) => {
                    const el = document.getElementById(key) ||
                               document.querySelector(`[data-subq="${key}"]`) ||
                               document.querySelector(`[data-subq-piece="${key}"]`) ||
                               document.querySelector(`[data-hunt="${key}"]`) ||
                               document.querySelector(`[data-hunt-type="${key}"]`) ||
                               document.querySelector(`[data-hunt-rel="${key}"]`) ||
                               document.querySelector(`[data-hunt-eval="${key}"]`) ||
                               document.querySelector(`[data-matrix-finding="${key}"]`) ||
                               document.querySelector(`[data-matrix-synthesis="${key}"]`) ||
                               document.querySelector(`[data-outline-claim="${key}"]`) ||
                               document.querySelector(`[data-outline-evidence="${key}"]`) ||
                               document.querySelector(`[data-outline-reasoning="${key}"]`);
                    if (el) el.value = val;
                });
            }

            // Restore checkboxes
            if (state.rqChecks) {
                document.querySelectorAll('.rq-check').forEach((c, i) => { c.checked = state.rqChecks[i] || false; });
            }
            if (state.thesisChecks) {
                document.querySelectorAll('.thesis-check').forEach((c, i) => { c.checked = state.thesisChecks[i] || false; });
            }

            // Show correct step
            document.querySelectorAll('.step-card').forEach(c => c.classList.remove('active'));
            const stepEl = document.getElementById('step' + currentStep);
            if (stepEl) stepEl.classList.add('active');

            // Welcome-back banner
            if (currentStep > 1) {
                const stepNames = ['', 'Topic Exploration', 'Research Question', 'Sub-Questions', 'Source Hunt', 'Evidence Matrix', 'Thesis', 'Outline'];
                const banner = document.getElementById('welcomeBackBanner');
                if (banner) {
                    banner.innerHTML = `
                        <p>👋 Welcome back! You're on <span class="wb-step">Step ${currentStep}: ${stepNames[currentStep] || ''}</span>.</p>
                        <button class="btn btn-sm btn-gold" onclick="this.closest('.welcome-back-banner').style.display='none'">Dismiss</button>`;
                    banner.style.display = 'flex';
                }
            }
        } catch (e) {}
    }

    function debounce(fn, ms) {
        let t;
        return function(...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), ms);
        };
    }

    // ===== SOURCE ANALYZER → RESEARCH STUDIO PIPELINE =====
    let _saAnalyses = []; // Cached Source Analyzer completions

    function loadSourceAnalyzerData() {
        _saAnalyses = [];
        try {
            // Load the main Source Analyzer state
            const raw = localStorage.getItem('ahsas_source_analyzer');
            if (raw) {
                const data = JSON.parse(raw);
                if (data.sourceTitle) {
                    _saAnalyses.push({
                        sourceTitle: data.sourceTitle || '',
                        sourceContent: data.sourceContent || '',
                        observeNotes: data.observeNotes || '',
                        cecConnect: data.cecConnect || '',
                        cecExtend: data.cecExtend || '',
                        cecChallenge: data.cecChallenge || '',
                        claim: data.cerClaim || '',
                        evidence: data.cerEvidence || '',
                        reasoning: data.cerReasoning || '',
                        piecesExplanation: data.piecesExplanation || '',
                        themes: data.selectedPiecesThemes || []
                    });
                }
            }
            // Also check for any multi-analysis storage (future-proofing)
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('ahsas_source_analyzer_') && key !== 'ahsas_source_analyzer') {
                    try {
                        const d = JSON.parse(localStorage.getItem(key));
                        if (d.sourceTitle) {
                            _saAnalyses.push({
                                sourceTitle: d.sourceTitle || '',
                                sourceContent: d.sourceContent || '',
                                observeNotes: d.observeNotes || '',
                                cecConnect: d.cecConnect || '',
                                cecExtend: d.cecExtend || '',
                                cecChallenge: d.cecChallenge || '',
                                claim: d.cerClaim || '',
                                evidence: d.cerEvidence || '',
                                reasoning: d.cerReasoning || '',
                                piecesExplanation: d.piecesExplanation || '',
                                themes: d.selectedPiecesThemes || []
                            });
                        }
                    } catch(e) {}
                }
            }
        } catch(e) {}
    }

    function autoPopulateMatrix() {
        // If there are Source Analyzer analyses, show a hint in the matrix
        if (_saAnalyses.length === 0) return;
        const container = document.getElementById('matrixContainer');
        if (!container) return;

        // Add an import banner at the top of the matrix
        const existingBanner = container.querySelector('.sa-matrix-banner');
        if (existingBanner) return; // Don't duplicate

        const banner = document.createElement('div');
        banner.className = 'sa-matrix-banner';
        banner.innerHTML = `
            <div class="sa-import-icon">\ud83d\udd17</div>
            <div class="sa-import-body">
                <div class="sa-import-label">Source Analyzer Data Available</div>
                <div class="sa-import-desc">
                    You have ${_saAnalyses.length} source analysis${_saAnalyses.length > 1 ? 'es' : ''} completed.
                    Your C.E.C. notes and CER arguments can flow into your outline in Step 7.
                </div>
            </div>
        `;
        container.insertBefore(banner, container.firstChild);
    }

    function getSourceAnalyzerForSQ(dataKey) {
        // Try to match Source Analyzer data to a sub-question paragraph
        // For now, return the first available SA analysis that has CER data
        if (_saAnalyses.length === 0) return null;
        
        // Simple strategy: assign analyses in order to body paragraphs
        const sqNum = parseInt(dataKey) || parseInt(dataKey.replace('manual-', ''));
        const idx = (sqNum || 1) - 1;
        if (idx < _saAnalyses.length) {
            return _saAnalyses[idx];
        }
        return null;
    }

    function importSAToOutline(dataKey) {
        const saData = getSourceAnalyzerForSQ(dataKey);
        if (!saData) return;

        // Populate CER fields from Source Analyzer
        const claimEl = document.querySelector(`[data-outline-claim="${dataKey}"]`);
        const evidenceEl = document.querySelector(`[data-outline-evidence="${dataKey}"]`);
        const reasoningEl = document.querySelector(`[data-outline-reasoning="${dataKey}"]`);

        if (claimEl && !claimEl.value && saData.claim) claimEl.value = saData.claim;
        if (evidenceEl && !evidenceEl.value && saData.evidence) evidenceEl.value = saData.evidence;
        if (reasoningEl && !reasoningEl.value) {
            // Combine C.E.C. notes with CER reasoning for richer content
            let reasoning = saData.reasoning || '';
            if (saData.cecConnect) reasoning += (reasoning ? ' ' : '') + saData.cecConnect;
            if (reasoning) reasoningEl.value = reasoning;
        }

        // Hide the import banner
        const banner = document.querySelector(`[onclick="importSAToOutline('${dataKey}')"]`);
        if (banner) {
            const bannerDiv = banner.closest('.sa-import-banner');
            if (bannerDiv) {
                bannerDiv.innerHTML = '<div class="sa-import-icon">\u2705</div><div class="sa-import-body"><div class="sa-import-label">Imported!</div><div class="sa-import-desc">Review and refine the pre-filled content below.</div></div>';
                bannerDiv.style.borderColor = 'rgba(45,138,110,0.3)';
                bannerDiv.style.background = 'rgba(45,138,110,0.06)';
            }
        }

        saveState();
    }
    window.importSAToOutline = importSAToOutline;

    // ===== QUESTION FEEDBACK ENGINE =====
    function analyzeQuestion() {
        const q = (document.getElementById('researchQuestion').value || '').trim();
        const placeholder = document.getElementById('feedbackPlaceholder');
        const result = document.getElementById('feedbackResult');
        
        if (!q || 10 > q.length) {
            placeholder.style.display = 'block';
            result.classList.remove('visible');
            placeholder.innerHTML = '⚠️ Type a research question above first (at least a full sentence).';
            return;
        }

        placeholder.style.display = 'none';
        const feedback = [];
        const lower = q.toLowerCase();
        const words = q.split(/\s+/);
        let overallStrength = 0;

        // 1. Check if it's a yes/no (closed) question
        const closedStarters = ['did ', 'does ', 'do ', 'is ', 'are ', 'was ', 'were ', 'can ', 'could ', 'would ', 'will ', 'should ', 'has ', 'have '];
        const isClosedEnded = closedStarters.some(s => lower.startsWith(s));
        if (isClosedEnded) {
            feedback.push({
                icon: '🔴',
                text: '<strong>Closed-ended question detected.</strong> Your question starts with a word that invites a yes/no answer. Try reframing: instead of "Did X happen?", ask "To what extent did X happen?" or "How did X shape Y?"'
            });
        } else {
            overallStrength++;
        }

        // 2. Check for analytical depth
        const analyticalStarters = ['to what extent', 'how did', 'why did', 'in what ways', 'how effective', 'what was the significance', 'how far', 'what role did', 'how successfully', 'to what degree'];
        const hasAnalytical = analyticalStarters.some(s => lower.includes(s));
        const descriptiveStarters = ['what is ', 'what are ', 'what was ', 'what were ', 'who was ', 'who were ', 'where did ', 'when did ', 'list '];
        const isDescriptive = descriptiveStarters.some(s => lower.startsWith(s));
        
        if (isDescriptive) {
            feedback.push({
                icon: '🟡',
                text: '<strong>This may be descriptive rather than analytical.</strong> Questions starting with "What was..." often lead to summary, not analysis. Consider: what about this topic requires <em>explanation</em> or <em>evaluation</em>? Push yourself to ask <em>why</em> or <em>how</em> something happened, not just <em>what</em> happened.'
            });
        } else if (hasAnalytical) {
            feedback.push({
                icon: '🟢',
                text: '<strong>Strong analytical framing!</strong> Your question invites explanation and evaluation, not just description. This is the kind of question that leads to a real argument.'
            });
            overallStrength++;
        }

        // 3. Check specificity (too short = too broad; reasonable length = good)
        if (8 > words.length) {
            feedback.push({
                icon: '🟡',
                text: '<strong>Your question might be too broad.</strong> Short questions often cover too much ground. Can you narrow the scope? Consider adding a specific time period, event, comparison, or PIECES lens. Ask yourself: could you realistically research this in a few weeks?'
            });
        } else if (words.length > 30) {
            feedback.push({
                icon: '🟡',
                text: '<strong>Your question might be too complex.</strong> Very long questions sometimes contain multiple questions in one. Try breaking it into a main research question and separate sub-questions.'
            });
        } else {
            overallStrength++;
        }

        // 4. Check for PIECES connection
        const piecesKeywords = {
            political: ['government', 'power', 'ruler', 'emperor', 'dynasty', 'state', 'political', 'policy', 'reform', 'revolution', 'war', 'military', 'authority', 'governance', 'legitimacy', 'mandate'],
            innovation: ['technology', 'innovation', 'invention', 'printing', 'gunpowder', 'compass', 'paper', 'science', 'engineering', 'innovation'],
            environmental: ['geography', 'river', 'land', 'climate', 'flood', 'environment', 'famine', 'drought', 'natural', 'resources', 'terrain'],
            cultural: ['culture', 'religion', 'confuci', 'buddhis', 'daois', 'art', 'literature', 'philosophy', 'belief', 'tradition', 'identity', 'values', 'education'],
            economic: ['trade', 'economic', 'commerce', 'silk road', 'merchants', 'taxes', 'wealth', 'poverty', 'agriculture', 'industry', 'tribute', 'market'],
            social: ['social', 'class', 'peasant', 'women', 'gender', 'family', 'society', 'rebellion', 'inequality', 'population', 'labor', 'community']
        };
        
        const connected = [];
        for (const [theme, keywords] of Object.entries(piecesKeywords)) {
            if (keywords.some(k => lower.includes(k))) connected.push(theme);
        }
        
        if (connected.length === 0) {
            feedback.push({
                icon: '🟡',
                text: '<strong>No clear PIECES connection found.</strong> Strong research questions connect to at least one PIECES theme (Political, Innovation, Environmental, Cultural, Economic, Social). Think about: which dimension of history does your question explore?'
            });
        } else {
            const themeLabels = { political: '🏛️ Political', innovation: '🔬 Innovation', environmental: '🌍 Environmental', cultural: '🎭 Cultural', economic: '💰 Economic', social: '👥 Social' };
            const tags = connected.map(c => themeLabels[c]).join(', ');
            feedback.push({
                icon: '🟢',
                text: `<strong>PIECES connection detected:</strong> ${tags}. Your question engages with clear thematic dimensions — this will help structure your analysis.`
            });
            overallStrength++;
        }

        // 5. Check for historical specificity
        const hasDate = /\d{3,4}/.test(q);
        const hasPeriod = ['dynasty', 'era', 'period', 'century', 'reign', 'tang', 'song', 'ming', 'qing', 'han', 'yuan', 'warring states', 'republic', 'mao', 'cultural revolution', 'great leap', 'opium', 'taiping', 'boxer', 'long march', 'civil war'].some(p => lower.includes(p));
        
        if (!hasDate && !hasPeriod) {
            feedback.push({
                icon: '🟡',
                text: '<strong>Consider adding historical specificity.</strong> Which dynasty, era, or time period are you focusing on? Grounding your question in a specific historical context will make it more researchable and your argument more precise.'
            });
        } else {
            overallStrength++;
        }

        // 6. Check for comparison (bonus)
        const hasComparison = ['compar', 'differ', 'similar', 'contrast', 'vs', 'versus', 'while', 'whereas', 'unlike', 'both'].some(c => lower.includes(c));
        if (hasComparison) {
            feedback.push({
                icon: '🟢',
                text: '<strong>Comparative angle detected!</strong> Comparing two cases, periods, or responses often leads to the richest analysis. Make sure both sides of your comparison are clearly defined.'
            });
            overallStrength++;
        }

        // Build suggestions based on weaknesses
        let suggestion = '';
        if (3 > overallStrength) {
            suggestion = `<div class="feedback-suggestion">
                <div class="feedback-suggestion-label">💡 Try Reshaping Your Question</div>
                <p>Strong research questions often follow patterns like these. Click one to use it as a starting point:</p>
                <div class="feedback-starters">
                    <button class="starter-chip" onclick="useStarter('To what extent did ')">To what extent did...</button>
                    <button class="starter-chip" onclick="useStarter('How did [X] shape ')">How did [X] shape...</button>
                    <button class="starter-chip" onclick="useStarter('Why did [X] respond differently to [Y] than [Z]?')">Why did [X] respond differently...</button>
                    <button class="starter-chip" onclick="useStarter('In what ways did [event] transform ')">In what ways did [event] transform...</button>
                    <button class="starter-chip" onclick="useStarter('What was the significance of ')">What was the significance of...</button>
                    <button class="starter-chip" onclick="useStarter('How effectively did ')">How effectively did...</button>
                </div>
            </div>`;
        } else if (overallStrength >= 4) {
            suggestion = `<div class="feedback-suggestion">
                <div class="feedback-suggestion-label">🎯 Looking Strong</div>
                <p>Your question has good analytical depth, specificity, and thematic grounding. Before moving on, ask yourself one final check: <em>could reasonable people disagree with the answer to this question?</em> If yes, you have an arguable research question.</p>
            </div>`;
        } else {
            suggestion = `<div class="feedback-suggestion">
                <div class="feedback-suggestion-label">💡 Almost There — Consider These Refinements</div>
                <p>Your question has potential but could be sharpened. Try asking yourself:</p>
                <p>• <strong>Scope:</strong> Can I realistically research this in the time I have?</p>
                <p>• <strong>Arguability:</strong> Could someone write a different answer than mine?</p>
                <p>• <strong>Evidence:</strong> What kind of sources would help me answer this?</p>
            </div>`;
        }

        // Render
        let html = '';
        feedback.forEach(f => {
            html += `<div class="feedback-item">
                <span class="feedback-icon">${f.icon}</span>
                <div class="feedback-text">${f.text}</div>
            </div>`;
        });
        html += suggestion;

        result.innerHTML = html;
        result.classList.add('visible');
    }

    function useStarter(text) {
        const textarea = document.getElementById('researchQuestion');
        if (textarea) {
            textarea.value = text;
            textarea.focus();
            textarea.setSelectionRange(text.length, text.length);
            saveState();
        }
    }

    // ===== THESIS COACH ENGINE =====
    function analyzeThesis() {
        const thesis = (document.getElementById('thesisStatement').value || '').trim();
        const placeholder = document.getElementById('thesisFeedbackPlaceholder');
        const result = document.getElementById('thesisFeedbackResult');
        
        if (!thesis || 15 > thesis.length) {
            placeholder.style.display = 'block';
            result.classList.remove('visible');
            placeholder.innerHTML = '⚠️ Draft a full thesis statement first before checking.';
            return;
        }

        placeholder.style.display = 'none';
        const feedback = [];
        const lower = thesis.toLowerCase();
        const words = thesis.split(/\\s+/);
        let strengthPoints = 0;

        // 1. Arguability (Subordinating Conjunctions indicating complexity/argument)
        const argumentWords = ['although', 'while', 'despite', 'because', 'however', 'rather than', 'instead of', 'argues', 'demonstrates', 'ultimately', 'yet', 'even though'];
        const hasArgument = argumentWords.some(w => lower.includes(w));
        
        if (hasArgument) {
            feedback.push({
                icon: '🟢',
                text: '<strong>Strong arguability detected!</strong> Words like "although", "because", or "while" show you are setting up tension, acknowledging complexity, and making a distinct claim.'
            });
            strengthPoints += 2;
        } else {
            feedback.push({
                icon: '🟡',
                text: '<strong>Your thesis might be a statement of fact rather than an argument.</strong> A strong thesis is arguable. Try using a structure like: "Although [Counter-argument], ultimately [Your Claim] because [Reasoning]."'
            });
        }

        // 2. Length/Depth Evaluation
        if (15 > words.length) {
            feedback.push({
                icon: '🔴',
                text: '<strong>Thesis is quite short.</strong> It likely lacks the detail needed to anchor an entire research paper. Ensure you explicitly state your main claim and at least a hint of your primary reasoning.'
            });
        } else if (words.length > 50) {
            feedback.push({
                icon: '🟡',
                text: '<strong>Thesis is getting very long.</strong> Be careful not to write an entire paragraph. A thesis should be succinct (usually 1-2 robust sentences).'
            });
            strengthPoints += 1;
        } else {
            feedback.push({
                icon: '🟢',
                text: '<strong>Strong depth and length.</strong> It appears detailed enough to anchor an essay without rambling.'
            });
            strengthPoints += 1;
        }

        // 3. Connects to RQ (We check if it shares words with the RQ)
        const rq = (document.getElementById('researchQuestion').value || '').toLowerCase();
        let connectionFound = false;
        if (rq.length > 10) {
            const rqWords = rq.split(/\\s+/).filter(w => w.length > 4); // filter small words
            const commonWords = rqWords.filter(w => lower.includes(w));
            if (commonWords.length >= 1) {
                connectionFound = true;
                feedback.push({
                    icon: '🟢',
                    text: '<strong>Directly addresses the Research Question.</strong> It clearly uses relevant terminology from your central question.'
                });
                strengthPoints += 1;
            }
        }
        
        if (!connectionFound && rq.length > 10) {
            feedback.push({
                icon: '🟡',
                text: '<strong>Does this answer your Research Question?</strong> Make sure your thesis directly responds to your core question in Step 2. Use the same key terms for clarity.'
            });
        }

        // Generate final score suggestion
        let suggestion = '';
        if (strengthPoints >= 4) {
            suggestion = `<div class="feedback-suggestion" style="border-top:2px solid var(--jade);">
                <div class="feedback-suggestion-label" style="color:var(--jade);">🎯 Excellent Draft</div>
                <p>Your thesis looks arguable, well-structured, and appropriately detailed. Use the Checklist above to quickly self-verify, then move on to Step 7 to build your outline!</p>
            </div>`;
        } else {
            suggestion = `<div class="feedback-suggestion">
                <div class="feedback-suggestion-label">💡 How to Strengthen This</div>
                <p>To improve an emerging thesis, try using the standard formula to guarantee arguability:</p>
                <div style="background:var(--subtle-bg);padding:10px;border-radius:4px;margin-top:10px;font-family:monospace;font-size:0.9rem;">
                    "Although <strong>[Counterclaim]</strong>,<br>
                    ultimately <strong>[Your position]</strong><br>
                    because <strong>[Summary of strongest evidence]</strong>."
                </div>
            </div>`;
        }

        // Render response
        let html = '';
        feedback.forEach(f => {
            html += `<div class="feedback-item">
                <span class="feedback-icon">${f.icon}</span>
                <div class="feedback-text">${f.text}</div>
            </div>`;
        });
        html += suggestion;

        result.innerHTML = html;
        result.classList.add('visible');
    }
