// AHSAS Student Progress Tracking (localStorage)
const AHSAS_PROGRESS_KEY = 'ahsas-progress';

// ── IB Skill Taxonomy ────────────────────────────────────────────────────────
const SKILLS = [
  { id: 'source-eval',   icon: '🔍', name: 'Source Evaluation',    ib: 'Paper 1 · OPVL / HIPP',  key: 'source-analysis', color: '#ef4444' },
  { id: 'argumentation', icon: '✍️',  name: 'Historical Argument',   ib: 'Paper 2 / 3 · Essay',    key: 'cer',             color: '#2d8a6e' },
  { id: 'inquiry',       icon: '🔬', name: 'Research & Inquiry',    ib: 'Internal Assessment',    key: 'research',        color: '#d4a039' },
  { id: 'discussion',    icon: '🗣️', name: 'Critical Discussion',   ib: 'Oral / Seminar',         key: 'seminar',         color: '#8b5cf6' },
  { id: 'comparison',    icon: '⚖️', name: 'Analytical Comparison', ib: 'Paper 1 / 2 · Compare',  key: 'compare',         color: '#0ea5e9' },
  { id: 'conceptual',    icon: '🧩', name: 'Conceptual Thinking',   ib: 'All Papers · PIECES',    key: 'pieces',          color: '#f97316' },
];

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(AHSAS_PROGRESS_KEY)) || { completions: [], stats: {} };
  } catch {
    return { completions: [], stats: {} };
  }
}

function saveProgress(data) {
  const json = JSON.stringify(data);
  localStorage.setItem(AHSAS_PROGRESS_KEY, json);
  // Sync to cloud if signed in
  (window.AHSAS_SYNC?.setItem(AHSAS_PROGRESS_KEY, json));
}

/**
 * Record a tool completion.
 * @param {'cer' | 'source-analysis'} toolName
 * @param {string} [label] Optional short label like "Silk Road CER"
 */
function recordCompletion(toolName, label) {
  const data = getProgress();
  const entry = {
    tool: toolName,
    label: label || toolName,
    timestamp: new Date().toISOString()
  };
  data.completions.push(entry);

  // Update stats
  if (!data.stats[toolName]) data.stats[toolName] = 0;
  data.stats[toolName]++;

  saveProgress(data);
  return data;
}

/**
 * Get all skill stats mapped to the IB taxonomy.
 * @returns {Array<{id, icon, name, ib, key, color, count}>}
 */
function getSkillStats() {
  const data = getProgress();
  return SKILLS.map(skill => ({
    ...skill,
    count: data.stats[skill.key] || 0
  }));
}

/**
 * Get aggregate stats.
 * @returns {{ cer: number, 'source-analysis': number, total: number, lastActivity: string|null }}
 */
function getStats() {
  const data = getProgress();
  const stats = {
    cer: data.stats.cer || 0,
    'source-analysis': data.stats['source-analysis'] || 0,
    total: (data.stats.cer || 0) + (data.stats['source-analysis'] || 0),
    lastActivity: null
  };

  if (data.completions.length > 0) {
    stats.lastActivity = data.completions[data.completions.length - 1].timestamp;
  }

  return stats;
}

/**
 * Get recent completions (last 5).
 * @returns {Array<{tool: string, label: string, timestamp: string}>}
 */
function getRecentActivity() {
  const data = getProgress();
  return data.completions.slice(-5).reverse();
}

/**
 * Clear all progress data.
 */
function clearProgress() {
  localStorage.removeItem(AHSAS_PROGRESS_KEY);
}

/**
 * Format a relative time string from an ISO timestamp.
 * @param {string} isoString
 * @returns {string}
 */
function formatRelativeTime(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

// Make functions available globally
window.ahsasProgress = {
  recordCompletion,
  getStats,
  getSkillStats,
  getRecentActivity,
  clearProgress,
  formatRelativeTime,
  SKILLS,
};
