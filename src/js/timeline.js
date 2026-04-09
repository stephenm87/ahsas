// Timeline: Interactive event explorer
document.addEventListener('DOMContentLoaded', function() {
    const data = window.AHSAS_CURRICULUM;
    if (!data) return;

    const themes = data.piecesThemes;
    let activeUnitId = null;
    let activeEventIndex = -1;

    // Get bookmarks from localStorage
    function getBookmarks() {
        return JSON.parse(localStorage.getItem('ahsas-bookmarks') || '[]');
    }

    // Get units with events
    const units = data.units.filter(u => u.keyEvents.length > 0);

    // ===== Build Unit Tabs =====
    const tabsContainer = document.getElementById('unitTabs');
    units.forEach(unit => {
        const tab = document.createElement('button');
        tab.className = 'unit-tab';
        tab.textContent = unit.icon + ' U' + unit.number;
        tab.title = `Unit ${unit.number}: ${unit.title} — ${unit.dateRange || unit.period}`;
        tab.dataset.unitId = unit.id;
        tab.style.setProperty('--active-tab-color', unit.color);
        tab.addEventListener('click', () => selectUnit(unit.id));
        tabsContainer.appendChild(tab);
    });

    // ===== Format Date =====
    function formatDate(d) {
        if (d === null || d === undefined) return '';
        if (d < 0) return '~' + Math.abs(d).toLocaleString() + ' BCE';
        return d + ' CE';
    }

    function shortDate(d) {
        if (d === null || d === undefined) return '?';
        if (d < 0) return Math.abs(d) + ' BCE';
        return d + ' CE';
    }

    // ===== Select Unit (with transition) =====
    function selectUnit(unitId) {

        const oldRail = document.getElementById('timelineRailWrapper');
        const isTransition = activeUnitId !== null && oldRail && oldRail.querySelector('.timeline-rail-outer');

        activeUnitId = unitId;
        activeEventIndex = -1;
        const unit = units.find(u => u.id === unitId);
        if (!unit) return;

        // Update tab states
        tabsContainer.querySelectorAll('.unit-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.unitId === unitId);
        });

        // Sort events by date
        const events = [...unit.keyEvents].sort((a, b) => {
            if (a.date === null && b.date === null) return 0;
            if (a.date === null) return -1;
            if (b.date === null) return 1;
            return a.date - b.date;
        });

        // Render unit header
        document.getElementById('unitHeader').innerHTML = `
            <div class="unit-header" style="--unit-color: ${unit.color};">
                <span class="unit-header-icon">${unit.icon}</span>
                <div>
                    <div class="unit-header-title">${unit.title}</div>
                    <div class="unit-header-period">${unit.dateRange || unit.period}</div>
                    <div class="unit-header-desc">${unit.description}</div>
                </div>
                <div class="unit-header-right">
                    <div class="unit-header-stats">
                        <strong>${events.length}</strong>
                        key events
                    </div>
                </div>
            </div>`;

        // Build rail HTML
        let railHtml = '<div class="timeline-rail">';
        events.forEach((event, i) => {
            const primaryTheme = event.pieces && event.pieces.length > 0 ? event.pieces[0] : 'political';
            const primaryColor = themes[primaryTheme] ? themes[primaryTheme].color : '#888';
            const pieceDots = (event.pieces || []).map(p => {
                const t = themes[p];
                return t ? `<span class="node-piece-dot" style="background:${t.color};"></span>` : '';
            }).join('');

            railHtml += `
                <div class="event-node" data-index="${i}" style="--node-color:${primaryColor};" onclick="window._selectEvent(${i})">
                    <div class="node-date">${shortDate(event.date)}</div>
                    <div class="node-label">${event.title}</div>
                    <div class="node-dot"></div>
                    <div class="node-pieces">${pieceDots}</div>
                </div>`;
        });
        railHtml += '</div>';

        const newRailContent = `
            <div class="timeline-rail-outer rail-enter">
                <div class="rail-fade-left" id="railFadeL"></div>
                <div class="rail-fade-right visible" id="railFadeR"></div>
                <button class="rail-scroll-btn left" id="railBtnL" onclick="window._scrollRail(-1)">←</button>
                <button class="rail-scroll-btn right visible" id="railBtnR" onclick="window._scrollRail(1)">→</button>
                <div class="timeline-rail-wrapper" id="railScroller">${railHtml}</div>
                <div class="rail-progress"><div class="rail-progress-fill" id="railProgress" style="width:10%;"></div></div>
            </div>`;

        if (isTransition) {
            // Slide-out old, slide-in new
            const oldOuter = oldRail.querySelector('.timeline-rail-outer');
            oldOuter.classList.add('rail-exit');
            setTimeout(() => {
                oldRail.innerHTML = newRailContent;
                wireRailScroll();
                window._currentEvents = events;
                window._currentUnit = unit;
                selectEvent(0);
            }, 220);
        } else {
            oldRail.innerHTML = newRailContent;
            wireRailScroll();
            window._currentEvents = events;
            window._currentUnit = unit;
            selectEvent(0);
        }
    }

    function wireRailScroll() {
        requestAnimationFrame(() => {
            const scroller = document.getElementById('railScroller');
            if (scroller) {
                updateScrollIndicators(scroller);
                scroller.addEventListener('scroll', () => updateScrollIndicators(scroller), { passive: true });
            }
            // Remove rail-enter class after animation
            const outer = document.querySelector('.timeline-rail-outer.rail-enter');
            if (outer) {
                outer.addEventListener('animationend', () => outer.classList.remove('rail-enter'), { once: true });
            }
        });
    }

    // ===== Select Event =====
    function selectEvent(index) {
        const events = window._currentEvents;
        const unit = window._currentUnit;
        if (!events || index < 0 || index >= events.length) return;

        activeEventIndex = index;
        const event = events[index];
        const primaryTheme = event.pieces && event.pieces.length > 0 ? event.pieces[0] : 'political';
        const primaryColor = themes[primaryTheme] ? themes[primaryTheme].color : '#888';

        // Update active node
        document.querySelectorAll('.event-node').forEach((n, i) => {
            n.classList.toggle('active', i === index);
        });

        // Scroll active node into view
        const activeNode = document.querySelector(`.event-node[data-index="${index}"]`);
        if (activeNode) {
            activeNode.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        // PIECES tags
        const tags = (event.pieces || []).map(p => {
            const t = themes[p];
            if (!t) return '';
            return `<span class="detail-panel-tag" style="background:${t.color}22;color:${t.color};border:1px solid ${t.color}33;">${t.icon} ${t.label}</span>`;
        }).join('');

        // Source link
        const sourceLink = event.sourceUrl
            ? `<a class="detail-panel-source" href="${event.sourceUrl}" target="_blank" rel="noopener">📖 Read more ↗</a>`
            : '';

        // Navigation
        const prevIdx = index - 1;
        const nextIdx = index + 1;
        const prevDisabled = prevIdx < 0 ? 'disabled' : '';
        const nextDisabled = nextIdx >= events.length ? 'disabled' : '';

        // Related sources with bookmark badges
        const bookmarks = getBookmarks();
        const unitSources = (window.AHSAS_SOURCES || []).filter(s => s.unit === unit.id);
        let sourcesHtml = '';
        if (unitSources.length > 0) {
            const sourceCards = unitSources.map((s, si) => {
                const isBookmarked = bookmarks.includes(s.id);
                const bookmarkBadge = isBookmarked ? '<span class="src-bookmark-badge">⭐ Bookmarked</span>' : '';
                const typeBadge = s.type === 'primary'
                    ? '<span class="src-badge primary">📜 Primary</span>'
                    : '<span class="src-badge secondary">📖 Secondary</span>';
                const formatMap = { text: '📝 Text', image: '🖼️ Image', map: '🗺️ Map' };
                const fmtClass = 'format-' + (s.format || 'text');
                const formatBadge = `<span class="src-badge ${fmtClass}">${formatMap[s.format] || '📝 Text'}</span>`;
                const prompts = (s.analysisPrompts || []).map(p => `<div class="src-card-prompt">${p}</div>`).join('');
                return `
                    <div class="src-card ${isBookmarked ? 'src-bookmarked' : ''}" id="srcCard${si}">
                        <div class="src-card-header" onclick="window._toggleSrcCard(${si})">
                            <div class="src-card-badges">${typeBadge}${formatBadge}${bookmarkBadge}</div>
                            <span class="src-card-title">${s.title}</span>
                            <span class="src-card-toggle">▼</span>
                        </div>
                        <div class="src-card-body">
                            <div class="src-card-meta">${s.creator} · ${s.date}</div>
                            <div class="src-card-snippet">${s.snippet}</div>
                            <div class="src-card-citation-label">MLA Citation</div>
                            <div class="src-card-citation">${s.mlaCitation}</div>
                            ${prompts ? `<div class="src-card-prompts"><div class="src-card-prompts-label">Analysis Prompts</div>${prompts}</div>` : ''}
                            <div class="src-card-actions">
                                ${s.url ? `<a class="src-action-link view" href="${s.url}" target="_blank" rel="noopener">View Original</a>` : ''}
                                <a class="src-action-link analyze" href="/source-analyzer.html?title=${encodeURIComponent(s.title)}&type=${encodeURIComponent(s.format || 'text')}&sourceType=${encodeURIComponent(s.type)}">Analyze This Source</a>
                            </div>
                        </div>
                    </div>`;
            }).join('');
            sourcesHtml = `
                <div class="related-sources">
                    <div class="related-sources-heading">📚 Related Sources <span class="src-count">${unitSources.length}</span></div>
                    ${sourceCards}
                </div>`;
        }

        document.getElementById('detailPanel').innerHTML = `
            <div class="detail-panel" style="--panel-color:${primaryColor};">
                <div class="detail-panel-header">
                    <span class="detail-panel-date">${formatDate(event.date)}</span>
                    <span class="detail-panel-title">${event.title}</span>
                </div>
                <div class="detail-panel-tags">${tags}</div>
                <div class="detail-panel-desc">${event.description}</div>
                ${sourceLink}
                ${sourcesHtml}
                <div class="detail-panel-nav">
                    <button class="detail-nav-btn" ${prevDisabled} onclick="window._selectEvent(${prevIdx >= 0 ? prevIdx : 0})">← ${prevIdx >= 0 ? events[prevIdx].title.substring(0,25) + (events[prevIdx].title.length > 25 ? '…' : '') : 'Previous'}</button>
                    <span style="font-size:0.75rem;color:var(--text-dim);">${index + 1} / ${events.length}</span>
                    <button class="detail-nav-btn" ${nextDisabled} onclick="window._selectEvent(${nextIdx < events.length ? nextIdx : events.length - 1})">${nextIdx < events.length ? events[nextIdx].title.substring(0,25) + (events[nextIdx].title.length > 25 ? '…' : '') : 'Next'} →</button>
                </div>
            </div>`;
    }

    // ===== Scroll Indicators =====
    function updateScrollIndicators(scroller) {
        const sl = scroller.scrollLeft;
        const maxScroll = scroller.scrollWidth - scroller.clientWidth;
        const canScrollLeft = sl > 5;
        const canScrollRight = sl < maxScroll - 5;

        const fadeL = document.getElementById('railFadeL');
        const fadeR = document.getElementById('railFadeR');
        const btnL = document.getElementById('railBtnL');
        const btnR = document.getElementById('railBtnR');
        const progress = document.getElementById('railProgress');

        if (fadeL) fadeL.classList.toggle('visible', canScrollLeft);
        if (fadeR) fadeR.classList.toggle('visible', canScrollRight);
        if (btnL) btnL.classList.toggle('visible', canScrollLeft);
        if (btnR) btnR.classList.toggle('visible', canScrollRight);
        if (progress && maxScroll > 0) {
            const pct = ((sl + scroller.clientWidth) / scroller.scrollWidth) * 100;
            progress.style.width = Math.max(10, pct) + '%';
        }
    }

    window._scrollRail = function(direction) {
        const scroller = document.getElementById('railScroller');
        if (scroller) scroller.scrollBy({ left: direction * 300, behavior: 'smooth' });
    };

    // Expose for onclick handlers
    window._selectEvent = function(idx) {
        selectEvent(idx);
    };
    window._toggleSrcCard = function(idx) {
        const card = document.getElementById('srcCard' + idx);
        if (card) card.classList.toggle('expanded');
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!window._currentEvents) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIdx = activeEventIndex + 1;
            if (nextIdx < window._currentEvents.length) selectEvent(nextIdx);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIdx = activeEventIndex - 1;
            if (prevIdx >= 0) selectEvent(prevIdx);
        }
    });

    // Toast
    function showToast(msg) {
        const t = document.getElementById('toast');
        if (!t) return;
        t.textContent = msg;
        t.classList.add('visible');
        setTimeout(() => t.classList.remove('visible'), 2500);
    }

    // Auto-select first unit
    if (units.length > 0) selectUnit(units[0].id);
});
