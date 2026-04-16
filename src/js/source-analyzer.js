/**
 * AHSAS Source Analyzer — Step-based analysis tool
 * Fully client-side with localStorage persistence
 * 4-step flow: Observe → Evaluate (HIPP/API) → PIECES → CER
 */

(function () {
  'use strict';

  // ===== State =====
  const STORAGE_KEY = 'ahsas_source_analyzer';
  let currentStep = 0;
  const TOTAL_STEPS = 4; // 0-3, plus review
  let sourceType = 'text';
  let primarySecondary = 'primary';
  let selectedPiecesThemes = new Set();
  let activeEvalTab = 0; // internal tab within Step 1 (Evaluate)

  // ===== DOM refs =====
  const panels = document.querySelectorAll('.step-panel[data-panel]');
  const pips = document.querySelectorAll('.step-pip');
  const connectors = document.querySelectorAll('.step-connector');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnPrint = document.getElementById('btnPrintAnalysis');
  const btnCopy = document.getElementById('btnCopyAnalysis');
  const btnClear = document.getElementById('btnClearAll');
  const saveIndicator = document.getElementById('saveIndicator');

  // All saveable fields
  const FIELDS = [
    'sourceTitle', 'sourceContent', 'observeNotes',
    'evalField0', 'evalField1', 'evalField2', 'evalField3',
    'piecesExplanation',
    'cerClaim', 'cerEvidence', 'cerReasoning'
  ];

  // ===== HIPP / API Evaluation Frameworks =====
  const FRAMEWORKS = {
    primary: {
      name: 'HIPP',
      tabs: [
        {
          letter: 'H',
          label: 'Historical Context',
          icon: '🕰️',
          questions: [
            'When was this document written?',
            'What was happening at the time that is related to this document?',
            '<em>Consider:</em> Does the context impact the content or reliability of the document? If so, how?'
          ],
          placeholder: 'When was this written? What was happening at the time? How does context affect its reliability?'
        },
        {
          letter: 'I',
          label: 'Intended Audience',
          icon: '👥',
          questions: [
            'Who was this document created for?',
            'Did the author intend for the public or a specific group to read this?',
            'Would the author expect a person or group NOT to be part of the audience?',
            'Would the author\'s message likely change based on their audience?'
          ],
          placeholder: 'Who was this created for? Would the message change for a different audience?'
        },
        {
          letter: 'P',
          label: 'Purpose',
          icon: '🎯',
          questions: [
            'Why or for what reason was this source produced?',
            'What did the author want the audience to do/think/feel as a result?',
            '<em>Consider:</em> Does the purpose impact its content or reliability? If so, how?'
          ],
          placeholder: 'Why was this produced? What did the author want the audience to do/think/feel?'
        },
        {
          letter: 'P',
          label: 'Point of View',
          icon: '🔍',
          questions: [
            'Who is the person/institution/group that created the document?',
            'What is one significant thing about the author\'s identity (experiences, family, nationality, job, religion, political views) that might have impacted what they wrote?',
            '<em>Consider:</em> How does the author\'s identity shape the content of this source?'
          ],
          placeholder: 'Who is the author? What about their identity might have shaped this source?'
        }
      ]
    },
    secondary: {
      name: 'API',
      tabs: [
        {
          letter: 'A',
          label: 'Author\'s Background',
          icon: '✍️',
          questions: [
            'What person or institution wrote this document?',
            'What are their credentials (e.g., professor, researcher, reporter)?',
            'What is important about the author\'s identity (nationality, ethnicity, religion, gender, political affiliation) that might affect the content?',
            '<em>Consider:</em> Is this a reputable source of information?'
          ],
          placeholder: 'Who wrote this? What are their credentials? Does their identity affect the content?'
        },
        {
          letter: 'P',
          label: 'Publisher',
          icon: '📰',
          questions: [
            'When was this document published? Who published it?',
            'What is important about the publisher\'s identity that might affect the content?',
            '<em>Consider:</em> Is this a reputable publisher or is it unknown or self-published?',
            '<em>Consider:</em> Does the publisher\'s identity impact reliability?'
          ],
          placeholder: 'Who published this? Is the publisher reputable? Does the age affect reliability?'
        },
        {
          letter: 'I',
          label: 'Intended Audience',
          icon: '👥',
          questions: [
            'What type of audience was this document created for?',
            'Does the document cite its sources? How?',
            '<em>Consider:</em> Is this created for a scholarly or popular audience?',
            '<em>Consider:</em> Does the audience impact the information included?'
          ],
          placeholder: 'Who is the target audience? Scholarly or popular? Does it cite sources?'
        }
      ]
    }
  };

  const OBSERVE_QUESTIONS = {
    primary: [
      'What are the first things you notice?',
      'What specific details stand out — names, dates, places, numbers?',
      'What is the tone or mood?',
      'What format is this source in (letter, speech, law, artwork)?'
    ],
    secondary: [
      'What is the main argument or thesis of this source?',
      'What evidence does the author use to support their argument?',
      'What is the organizational structure?',
      'What terminology or concepts does the author use?'
    ]
  };

  // ===== Init =====
  function init() {
    loadState();
    prefillFromURL();
    setupSourceType();
    setupPSToggle();
    setupEvalTabs();
    setupPiecesChips();
    setupNavigation();
    setupAutoSave();
    setupExport();
    setupWordCounts();
    setupCERPipeline();
    updateQuestions();
    renderStep();
  }

  // ===== Deep-link pre-fill from URL params =====
  function prefillFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('title')) return;

    // Pre-fill source title
    const title = params.get('title');
    const titleEl = document.getElementById('sourceTitle');
    if (titleEl && title && !titleEl.value) titleEl.value = title;

    // Pre-fill source content from snippet
    const snippet = params.get('snippet');
    const contentEl = document.getElementById('sourceContent');
    if (contentEl && snippet && !contentEl.value) contentEl.value = snippet;

    // Pre-fill source format type (text, image, map, data)
    const type = params.get('type');
    if (type && ['text', 'image', 'map', 'data'].includes(type)) {
      sourceType = type;
      document.querySelectorAll('.source-type-btn').forEach(b => b.classList.remove('active'));
      const btn = document.querySelector(`.source-type-btn[data-type="${type}"]`);
      if (btn) btn.classList.add('active');
      updateSourcePlaceholder();
    }

    // Pre-fill primary/secondary toggle
    const sType = params.get('sourceType');
    if (sType && ['primary', 'secondary'].includes(sType)) {
      primarySecondary = sType;
      document.querySelectorAll('.ps-toggle-btn').forEach(b => b.classList.remove('active'));
      const btn = document.querySelector(`.ps-toggle-btn[data-ps="${sType}"]`);
      if (btn) btn.classList.add('active');
      updateQuestions();
      buildEvalTabs();
      renderEvalTab();
    }

    // Clean URL params without page reload
    window.history.replaceState({}, '', window.location.pathname);

    // Show a toast with creator info if available
    const creator = params.get('creator');
    const toastMsg = 'Source pre-filled: ' + title + (creator ? ' by ' + creator : '');
    if (window.showToast) window.showToast(toastMsg);
  }

  // ===== Source Type =====
  function setupSourceType() {
    document.querySelectorAll('.source-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.source-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sourceType = btn.dataset.type;
        updateSourcePlaceholder();
        saveState();
      });
    });
    const activeBtn = document.querySelector(`.source-type-btn[data-type="${sourceType}"]`);
    if (activeBtn) {
      document.querySelectorAll('.source-type-btn').forEach(b => b.classList.remove('active'));
      activeBtn.classList.add('active');
    }
    updateSourcePlaceholder();
  }

  function updateSourcePlaceholder() {
    const el = document.getElementById('sourceContent');
    if (!el) return;
    const placeholders = {
      text: 'Paste the text of the source here...',
      image: 'Describe the image or artifact in detail — what do you see?',
      map: 'Describe the map — what region, time period, and features are shown?',
      data: 'Describe the data or chart — what variables, trends, and time period?'
    };
    el.placeholder = placeholders[sourceType] || placeholders.text;
  }

  // ===== Primary / Secondary Toggle =====
  function setupPSToggle() {
    document.querySelectorAll('.ps-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ps-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        primarySecondary = btn.dataset.ps;
        activeEvalTab = 0;
        updateQuestions();
        buildEvalTabs();
        renderEvalTab();
        saveState();
      });
    });
    const activeBtn = document.querySelector(`.ps-toggle-btn[data-ps="${primarySecondary}"]`);
    if (activeBtn) {
      document.querySelectorAll('.ps-toggle-btn').forEach(b => b.classList.remove('active'));
      activeBtn.classList.add('active');
    }
  }

  function updateQuestions() {
    const qs = OBSERVE_QUESTIONS[primarySecondary] || OBSERVE_QUESTIONS.primary;
    setQuestionList('observeQuestionsList', qs);
    // Update framework badge
    const fw = FRAMEWORKS[primarySecondary];
    const badge = document.getElementById('frameworkBadge');
    if (badge) badge.textContent = fw.name;
  }

  function setQuestionList(id, questions) {
    const ul = document.getElementById(id);
    if (!ul) return;
    ul.innerHTML = questions.map(q => `<li>${q}</li>`).join('');
  }

  // ===== Eval Letter-Tabs =====
  function setupEvalTabs() {
    buildEvalTabs();
    renderEvalTab();
  }

  function buildEvalTabs() {
    const fw = FRAMEWORKS[primarySecondary];
    const tabBar = document.getElementById('evalTabBar');
    const titleEl = document.getElementById('evalStepTitle');
    if (!tabBar) return;

    // Update step title
    if (titleEl) titleEl.textContent = `📝 ${fw.name} Evaluation`;

    // Build tab buttons
    tabBar.innerHTML = fw.tabs.map((tab, i) => {
      const active = i === activeEvalTab ? ' active' : '';
      return `<button class="eval-tab${active}" data-tab="${i}" title="${tab.label}">
        <span class="eval-tab-letter">${tab.letter}</span>
        <span class="eval-tab-label">${tab.label}</span>
      </button>`;
    }).join('');

    // Bind clicks
    tabBar.querySelectorAll('.eval-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeEvalTab = parseInt(btn.dataset.tab, 10);
        renderEvalTab();
        saveState();
        checkAnalyzerQuality('evalFieldActive');
      });
    });
  }

  function renderEvalTab() {
    const fw = FRAMEWORKS[primarySecondary];
    const tab = fw.tabs[activeEvalTab];
    if (!tab) return;

    // Update tab bar active state
    const tabBar = document.getElementById('evalTabBar');
    if (tabBar) {
      tabBar.querySelectorAll('.eval-tab').forEach((btn, i) => {
        btn.classList.toggle('active', i === activeEvalTab);
      });
    }

    // Update the subtitle
    const subtitle = document.getElementById('evalStepSubtitle');
    if (subtitle) subtitle.textContent = `${tab.icon} ${tab.label}`;

    // Update guiding questions
    setQuestionList('evalQuestionsList', tab.questions);

    // Update the single textarea label + placeholder
    const labelEl = document.querySelector('label[for="evalFieldActive"]');
    const textarea = document.getElementById('evalFieldActive');
    if (labelEl) labelEl.textContent = tab.label;
    if (textarea) {
      textarea.placeholder = tab.placeholder;
      // Swap value from storage fields
      textarea.value = val(`evalField${activeEvalTab}`);
    }
  }

  // Sync the active textarea back to the correct hidden field before navigating
  function syncEvalField() {
    const textarea = document.getElementById('evalFieldActive');
    const hidden = document.getElementById(`evalField${activeEvalTab}`);
    if (textarea && hidden) {
      hidden.value = textarea.value;
    }
  }

  // ===== PIECES Chips =====
  function setupPiecesChips() {
    document.querySelectorAll('.pieces-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const theme = chip.dataset.theme;
        if (selectedPiecesThemes.has(theme)) {
          selectedPiecesThemes.delete(theme);
          chip.classList.remove('selected');
        } else {
          selectedPiecesThemes.add(theme);
          chip.classList.add('selected');
        }
        saveState();
      });
    });
    selectedPiecesThemes.forEach(theme => {
      const chip = document.querySelector(`.pieces-chip[data-theme="${theme}"]`);
      if (chip) chip.classList.add('selected');
    });
  }

  // ===== Navigation =====
  function setupNavigation() {
    btnNext.addEventListener('click', () => {
      syncEvalField();
      // Quality gate on Observe step (step 0)
      if (currentStep === 0) {
        const obs = val('observeNotes');
        const wc = obs ? obs.split(/\s+/).length : 0;
        const gate = document.getElementById('observeGate');
        if (wc < 18) { // strict with slight tolerance
          if (gate) {
            gate.className = 'quality-gate gate-fail visible';
            gate.innerHTML = '<div class="gate-item"><span class="gate-icon">🔴</span><span><strong>Observations too brief.</strong> Write at least 20 words describing what you see in the source. You have ' + wc + '.</span></div>';
          }
          return;
        } else {
          if (gate) gate.className = 'quality-gate';
        }
      }
      if (currentStep < TOTAL_STEPS - 1) {
        currentStep++;
        renderStep();
      } else {
        showReview();
      }
      saveState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnPrev.addEventListener('click', () => {
      syncEvalField();
      if (currentStep === 'review') {
        currentStep = TOTAL_STEPS - 1;
      } else if (currentStep > 0) {
        currentStep--;
      }
      renderStep();
      saveState();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Clickable pips
    pips.forEach(pip => {
      pip.addEventListener('click', () => {
        syncEvalField();
        const step = parseInt(pip.dataset.step, 10);
        currentStep = step;
        renderStep();
        saveState();
      });
    });
  }

  function renderStep() {
    panels.forEach(p => p.classList.remove('active'));

    if (currentStep === 'review') {
      const reviewPanel = document.querySelector('[data-panel="review"]');
      if (reviewPanel) reviewPanel.classList.add('active');
      btnNext.textContent = 'Continue →';
      btnNext.disabled = true;
      btnPrev.disabled = false;
    } else {
      const panel = document.querySelector(`[data-panel="${currentStep}"]`);
      if (panel) panel.classList.add('active');

      btnPrev.disabled = (currentStep === 0);
      btnNext.disabled = false;
      btnNext.textContent = (currentStep === TOTAL_STEPS - 1) ? 'Review Analysis →' : 'Continue →';
    }

    // If we're on the Evaluate step, refresh the tab content
    if (currentStep === 1) {
      buildEvalTabs();
      renderEvalTab();
    }

    // Update pips
    pips.forEach(pip => {
      const step = parseInt(pip.dataset.step, 10);
      pip.classList.remove('active', 'completed');
      if (currentStep === 'review' || step < currentStep) {
        pip.classList.add('completed');
      } else if (step === currentStep) {
        pip.classList.add('active');
      }
    });

    connectors.forEach(conn => {
      const idx = parseInt(conn.dataset.conn, 10);
      conn.classList.toggle('completed', currentStep === 'review' || idx < currentStep);
    });
  }

  function showReview() {
    syncEvalField();
    currentStep = 'review';
    buildReview();
    renderStep();

    // Record progress
    if (window.ahsasProgress) {
      const title = val('sourceTitle') || 'Source Analysis';
      window.ahsasProgress.recordCompletion('source-analysis', title.substring(0, 50));
    }
  }

  function buildReview() {
    const container = document.getElementById('reviewContent');
    const titleEl = document.getElementById('reviewSourceTitle');
    const title = val('sourceTitle');
    titleEl.textContent = title || 'Untitled Source';

    const fw = FRAMEWORKS[primarySecondary];
    let html = '';

    // Source info
    const sourceContent = val('sourceContent');
    if (sourceContent) {
      html += `<div class="review-block">
        <div class="review-label" style="color:var(--text-dim);">Source (${sourceType} — ${primarySecondary})</div>
        <div class="review-content">${escapeHtml(sourceContent)}</div>
      </div>`;
    }

    // Observe
    const obs = val('observeNotes');
    html += `<div class="review-block">
      <div class="review-label observe-label">Observe</div>
      ${obs ? `<div class="review-content">${escapeHtml(obs)}</div>` : '<div class="review-empty">No notes added</div>'}
    </div>`;

    // Evaluate (HIPP or API)
    let evalContent = '';
    fw.tabs.forEach((tab, i) => {
      const v = val(`evalField${i}`);
      if (v) {
        evalContent += `<div class="review-field-block"><strong class="review-field-label">${tab.icon} ${tab.letter} — ${tab.label}</strong><div class="review-content">${escapeHtml(v)}</div></div>`;
      }
    });
    html += `<div class="review-block">
      <div class="review-label context-label">${fw.name} Evaluation</div>
      ${evalContent || '<div class="review-empty">No notes added</div>'}
    </div>`;

    // PIECES
    let piecesContent = '';
    if (selectedPiecesThemes.size > 0) {
      const themeNames = { political: '🏛️ Political', innovation: '🔬 Innovation', environmental: '🌍 Environmental', cultural: '🎭 Cultural', economic: '💰 Economic', social: '👥 Social' };
      const chips = Array.from(selectedPiecesThemes).map(t => themeNames[t] || t).join(' · ');
      piecesContent += `<div class="review-themes">${chips}</div>`;
    }
    const pExp = val('piecesExplanation');
    if (pExp) piecesContent += `<div class="review-content">${escapeHtml(pExp)}</div>`;
    html += `<div class="review-block">
      <div class="review-label pieces-label">PIECES Connection</div>
      ${piecesContent || '<div class="review-empty">No notes added</div>'}
    </div>`;

    // CER
    const cerFields = [
      { id: 'cerClaim', label: 'Claim' },
      { id: 'cerEvidence', label: 'Evidence' },
      { id: 'cerReasoning', label: 'Reasoning' }
    ];
    let cerContent = '';
    cerFields.forEach(f => {
      const v = val(f.id);
      if (v) cerContent += `<div class="review-field-block"><strong class="review-field-label">${f.label}</strong><div class="review-content">${escapeHtml(v)}</div></div>`;
    });
    html += `<div class="review-block">
      <div class="review-label cer-label">CER Connection</div>
      ${cerContent || '<div class="review-empty">No notes added</div>'}
    </div>`;

    // NoodleTools Bridge
    const ntTitle = val('sourceTitle') || '';
    const ntTypeLabels = {
      website: 'Website / Online', pdf: 'PDF Document', book: 'Book',
      journal: 'Journal / Academic Article', news: 'News Article',
      video: 'Video', other: 'Other'
    };
    const ntTypeLabel = ntTypeLabels[sourceType] || sourceType || 'source';
    html += `
      <div class="nt-bridge">
        <div class="nt-bridge-icon">📚</div>
        <div class="nt-bridge-body">
          <div class="nt-bridge-header">
            <span class="nt-wordmark">NoodleTools</span>
            <span class="nt-bridge-tip">Create your Works Cited entry</span>
          </div>
          <p class="nt-bridge-desc">
            Great analysis! Now open NoodleTools to build the citation for
            <strong>${ntTitle ? escapeHtml(ntTitle) : 'this source'}</strong>.
            In NoodleTools, choose <strong>${escapeHtml(ntTypeLabel)}</strong> as the source type,
            then enter the author, title, URL/publisher, and date accessed.
          </p>
          <a class="nt-btn" href="https://my.noodletools.com" target="_blank" rel="noopener noreferrer">
            Open NoodleTools ↗
          </a>
        </div>
      </div>`;

    container.innerHTML = html;
  }

  // ===== Auto-save & Quality Gates =====
  function setupAutoSave() {
    FIELDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', debounce(() => {
        saveState();
        flashSave();
        checkAnalyzerQuality(id);
      }, 400));
    });

    // Also listen on the active eval textarea
    const evalActive = document.getElementById('evalFieldActive');
    if (evalActive) {
      evalActive.addEventListener('input', debounce(() => {
        syncEvalField();
        saveState();
        flashSave();
        checkAnalyzerQuality('evalFieldActive');
      }, 400));
    }
    
    // Initial checks
    setTimeout(() => {
      checkAnalyzerQuality('evalFieldActive');
      checkAnalyzerQuality('piecesExplanation');
      checkAnalyzerQuality('cerClaim');
      checkAnalyzerQuality('cerEvidence');
      checkAnalyzerQuality('cerReasoning');
    }, 500);
  }

  function saveState() {
    syncEvalField();
    const data = {
      sourceType, primarySecondary, currentStep, activeEvalTab,
      selectedPiecesThemes: Array.from(selectedPiecesThemes)
    };
    FIELDS.forEach(id => {
      data[id] = val(id);
    });
    try {
      const serialised = JSON.stringify(data);
      if (window.AHSAS_SYNC) {
        window.AHSAS_SYNC.setItem(STORAGE_KEY, serialised);
      } else {
        localStorage.setItem(STORAGE_KEY, serialised);
      }
    } catch (e) { /* Quota exceeded */ }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      sourceType = data.sourceType || 'text';
      primarySecondary = data.primarySecondary || 'primary';
      currentStep = data.currentStep ?? 0;
      if (currentStep === 'review') currentStep = 'review';
      activeEvalTab = data.activeEvalTab ?? 0;
      selectedPiecesThemes = new Set(data.selectedPiecesThemes || []);

      FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (el && data[id]) el.value = data[id];
      });
    } catch (e) { /* Parse error */ }
  }

  function flashSave() {
    const textEl = document.getElementById('analyzerAutosaveText');
    const now = new Date();
    if (textEl) textEl.textContent = 'Saved at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    saveIndicator.classList.add('visible');
    clearTimeout(saveIndicator._hideTimer);
    saveIndicator._hideTimer = setTimeout(() => saveIndicator.classList.remove('visible'), 5000);
  }

  // ===== Export =====
  function setupExport() {
    btnPrint.addEventListener('click', () => window.print());

    btnCopy.addEventListener('click', () => {
      const text = buildPlainText();
      navigator.clipboard.writeText(text).then(() => {
        btnCopy.textContent = '✓ Copied!';
        setTimeout(() => { btnCopy.textContent = '📋 Copy as Text'; }, 1500);
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btnCopy.textContent = '✓ Copied!';
        setTimeout(() => { btnCopy.textContent = '📋 Copy as Text'; }, 1500);
      });
    });

    btnClear.addEventListener('click', () => {
      if (!confirm('Start a new analysis? This will clear all your current notes.')) return;
    localStorage.removeItem(STORAGE_KEY);
    if (window.AHSAS_SYNC) window.AHSAS_SYNC.removeItem(STORAGE_KEY);
      FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const evalActive = document.getElementById('evalFieldActive');
      if (evalActive) evalActive.value = '';
      selectedPiecesThemes.clear();
      document.querySelectorAll('.pieces-chip').forEach(c => c.classList.remove('selected'));
      sourceType = 'text';
      primarySecondary = 'primary';
      currentStep = 0;
      activeEvalTab = 0;
      document.querySelectorAll('.source-type-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.source-type-btn[data-type="text"]').classList.add('active');
      document.querySelectorAll('.ps-toggle-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.ps-toggle-btn[data-ps="primary"]').classList.add('active');
      updateQuestions();
      updateSourcePlaceholder();
      buildEvalTabs();
      renderEvalTab();
      renderStep();
    });
  }

  function buildPlainText() {
    const title = val('sourceTitle') || 'Untitled Source';
    const fw = FRAMEWORKS[primarySecondary];
    const lines = [
      `SOURCE ANALYSIS: ${title}`,
      `Type: ${sourceType} (${primarySecondary}) — ${fw.name} Evaluation`,
      '',
      '--- OBSERVE ---',
      val('observeNotes') || '(empty)',
      ''
    ];
    lines.push(`--- ${fw.name} EVALUATION ---`);
    fw.tabs.forEach((tab, i) => {
      lines.push(`${tab.letter} — ${tab.label}: ${val(`evalField${i}`) || '(empty)'}`);
    });
    lines.push('');
    lines.push('--- PIECES ---');
    lines.push(`Themes: ${Array.from(selectedPiecesThemes).join(', ') || '(none)'}`);
    lines.push(val('piecesExplanation') || '(empty)');
    lines.push('');
    lines.push('--- CER ---');
    lines.push(`Claim: ${val('cerClaim') || '(empty)'}`);
    lines.push(`Evidence: ${val('cerEvidence') || '(empty)'}`);
    lines.push(`Reasoning: ${val('cerReasoning') || '(empty)'}`);
    return lines.join('\n');
  }

  // ===== Util =====
  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // ===== Word Counts =====
  function setupWordCounts() {
    const pairs = [
      ['sourceContent', 'wcSourceContent'],
      ['observeNotes', 'wcObserveNotes'],
      ['cerClaim', 'wcCerClaim'],
      ['cerEvidence', 'wcCerEvidence'],
      ['cerReasoning', 'wcCerReasoning']
    ];
    pairs.forEach(([taId, wcId]) => {
      const ta = document.getElementById(taId);
      const wc = document.getElementById(wcId);
      if (!ta || !wc) return;
      const update = () => {
        const text = ta.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        const minLabel = taId === 'observeNotes' ? ' \u00b7 Minimum 20 words to continue' : '';
        wc.textContent = words + ' word' + (words !== 1 ? 's' : '') + minLabel;
        wc.classList.toggle('has-content', words > 0);
        // Auto-update observation checklist
        if (taId === 'observeNotes') updateObserveChecklist(text, words);
      };
      ta.addEventListener('input', update);
      update(); // Init
    });
  }

  // ===== Observation Checklist Auto-Check =====
  function updateObserveChecklist(text, wordCount) {
    const lower = (text || '').toLowerCase();
    const checks = {
      details: /\b\d{3,4}\b/.test(text) || /[A-Z][a-z]{2,}/.test(text),
      format: ['letter', 'speech', 'law', 'decree', 'artwork', 'painting', 'map', 'chart', 'document', 'text', 'treaty', 'diary', 'photograph', 'edict', 'poem', 'scroll', 'inscription', 'memoir'].some(w => lower.includes(w)),
      tone: ['tone', 'mood', 'perspective', 'formal', 'informal', 'persuasive', 'urgent', 'defensive', 'critical', 'celebratory', 'solemn', 'authoritative', 'confident', 'emotional', 'neutral', 'biased', 'sympathetic'].some(w => lower.includes(w)),
      words: wordCount >= 20
    };
    document.querySelectorAll('.observe-check-item').forEach(item => {
      const key = item.dataset.check;
      const icon = item.querySelector('.observe-check-icon');
      if (checks[key]) {
        item.classList.add('checked');
        if (icon) icon.textContent = '\u2611';
      } else {
        item.classList.remove('checked');
        if (icon) icon.textContent = '\u2610';
      }
    });
  }

  // ===== Quality Gate Engine =====
  function checkAnalyzerQuality(id) {
    const el = document.getElementById(id);
    let gateId = '';
    if (id === 'evalFieldActive') gateId = 'gateEval';
    else if (id === 'piecesExplanation') gateId = 'gatePieces';
    else if (id === 'cerClaim') gateId = 'gateCerClaim';
    else if (id === 'cerEvidence') gateId = 'gateCerEvidence';
    else if (id === 'cerReasoning') gateId = 'gateCerReasoning';
    
    if (!gateId) return;
    const gate = document.getElementById(gateId);
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

    if (id === 'evalFieldActive') {
      if (wc < 12) issues.push({ icon: '🔴', text: `<strong>Develop your thoughts.</strong> This evaluation needs to be more detailed (~15 words). You have ${wc}.` });
    } 
    else if (id === 'piecesExplanation') {
      if (wc < 12) issues.push({ icon: '🔴', text: `<strong>Needs detail.</strong> Explain how the source demonstrates the theme (~15 words). You have ${wc}.` });
      const connectors = ['shows', 'demonstrates', 'reveals', 'highlights', 'because', 'indicates'];
      if (!connectors.some(c => lower.includes(c)) && wc >= 5) {
        issues.push({ icon: '🟡', text: '<strong>Show the connection:</strong> Try using verbs like "demonstrates," "reveals," or "shows that" to explain the connection.' });
      }
    } 
    else if (id === 'cerClaim') {
      if (wc < 8) issues.push({ icon: '🔴', text: `<strong>Too short.</strong> A claim must be a complete sentence taking a stance (~10 words). You have ${wc}.` });
      const arguable = ['because', 'although', 'while', 'however'];
      if (!arguable.some(a => lower.includes(a)) && wc >= 8) {
        issues.push({ icon: '🟡', text: '<strong>Checking arguability:</strong> Is this a historical fact or an argument? Try adding "because" to make it debatable.' });
      }
    }
    else if (id === 'cerEvidence') {
      if (wc < 12) issues.push({ icon: '🔴', text: `<strong>Be specific.</strong> Evidence needs specific facts, dates, or quotes (~15 words). You have ${wc}.` });
    }
    else if (id === 'cerReasoning') {
      if (wc < 15) issues.push({ icon: '🔴', text: `<strong>Unpack the evidence.</strong> Explain exactly *how* the evidence proves the claim (~20 words). You have ${wc}.` });
      const reasonWords = ['proves', 'shows', 'because', 'demonstrates', 'means'];
      if (!reasonWords.some(r => lower.includes(r)) && wc >= 10) {
        issues.push({ icon: '🟡', text: '<strong>Connect it back:</strong> Use words like "This proves that..." or "This demonstrates..."' });
      }
    }

    if (issues.length > 0) {
      const hasRed = issues.some(i => i.icon === '🔴');
      gate.classList.add(hasRed ? 'gate-fail' : 'gate-warn');
      gate.innerHTML = issues.map(i => `<div style="margin-top:4px;">${i.icon} ${i.text}</div>`).join('');
    } else {
      gate.classList.add('gate-pass');
      gate.innerHTML = `<div style="margin-top:4px;">✅ <strong>Solid work.</strong> (${wc} words)</div>`;
    }
  }

  // ===== Send to CER Builder Pipeline =====
  function setupCERPipeline() {
    const btn = document.getElementById('btnSendToCER');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const handoff = {
        claim: val('cerClaim'),
        evidence: val('cerEvidence'),
        reasoning: val('cerReasoning'),
        theme: selectedPiecesThemes.size > 0 ? Array.from(selectedPiecesThemes)[0] : '',
        sourceTitle: val('sourceTitle'),
        from: 'source-analyzer',
        ts: Date.now()
      };
      try {
        localStorage.setItem('ahsas_cer_handoff', JSON.stringify(handoff));
      } catch(e) {}
      // Navigate to CER builder
      btn.textContent = '\u2713 Sent!';
      setTimeout(() => { window.location.href = '/cer-builder.html'; }, 600);
    });
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Reload state when user signs in mid-session (cloud data just pulled down)
  window.addEventListener('ahsas:sync-ready', () => {
    loadState();
    renderStep();
  });
})();
