/* GEO Tool — Frontend controller. */

const $ = (id) => document.getElementById(id);

const contentEl = $('content');
const platformEl = $('platform');
const analyzeBtn = $('analyze-btn');
const optimizeBtn = $('optimize-btn');
const schemaBtn = $('schema-btn');

const resultsSection = $('results');
const optimizedSection = $('optimized-output');
const schemaSection = $('schema-output');

async function apiPost(endpoint, body) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

function requireContent() {
  const text = contentEl.value.trim();
  if (!text) {
    alert('Please paste your social media content first.');
    return null;
  }
  return text;
}

// ---------- Analyze ----------
analyzeBtn.addEventListener('click', async () => {
  const text = requireContent();
  if (!text) return;

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing…';
  try {
    const data = await apiPost('/api/analyze', { text, platform: platformEl.value });
    renderAnalysis(data);
  } catch (e) {
    alert('Error: ' + e.message);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze GEO Score';
  }
});

function renderAnalysis(data) {
  $('score-value').textContent = data.overallScore;
  $('score-grade').textContent = data.grade;

  const stats = $('quick-stats');
  stats.innerHTML = `
    <li><strong>${data.wordCount}</strong> words · <strong>${data.sentenceCount}</strong> sentences</li>
    <li><strong>${data.entities.length}</strong> named entities · <strong>${data.hashtags.length}</strong> hashtags · <strong>${data.stats.length}</strong> stats/numbers</li>
  `;

  const factorsList = $('factors-list');
  factorsList.innerHTML = '';
  data.factors.forEach((f) => {
    const klass = f.score >= 75 ? 'good' : f.score >= 50 ? 'ok' : 'bad';
    const div = document.createElement('div');
    div.className = `factor ${klass}`;
    div.innerHTML = `
      <div class="factor-header">
        <span class="factor-name">${humanize(f.factor)}</span>
        <span class="factor-score">${f.score}/100</span>
      </div>
      <div class="factor-feedback">${escapeHtml(f.feedback)}</div>
    `;
    factorsList.appendChild(div);
  });

  const improvementsList = $('improvements-list');
  improvementsList.innerHTML = '';
  data.topImprovements.forEach((imp) => {
    const li = document.createElement('li');
    li.textContent = imp;
    improvementsList.appendChild(li);
  });

  const tipsList = $('platform-tips-list');
  tipsList.innerHTML = '';
  if (data.platformTips.length === 0) {
    tipsList.innerHTML = '<li>No platform-specific issues detected.</li>';
  } else {
    data.platformTips.forEach((tip) => {
      const li = document.createElement('li');
      li.textContent = tip;
      tipsList.appendChild(li);
    });
  }

  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- Optimize ----------
optimizeBtn.addEventListener('click', async () => {
  const text = requireContent();
  if (!text) return;

  optimizeBtn.disabled = true;
  optimizeBtn.textContent = 'Generating…';
  try {
    const data = await apiPost('/api/optimize', { text, platform: platformEl.value });
    $('optimized-text').textContent = data.optimized;
    optimizedSection.classList.remove('hidden');
    optimizedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    alert('Error: ' + e.message);
  } finally {
    optimizeBtn.disabled = false;
    optimizeBtn.textContent = 'Generate Optimized Version';
  }
});

// ---------- Schema markup ----------
schemaBtn.addEventListener('click', async () => {
  const text = requireContent();
  if (!text) return;

  schemaBtn.disabled = true;
  schemaBtn.textContent = 'Generating…';
  try {
    const data = await apiPost('/api/schema', { text });
    const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(data.schema, null, 2)}\n<\/script>`;
    $('schema-text').textContent = jsonLd;
    schemaSection.classList.remove('hidden');
    schemaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    alert('Error: ' + e.message);
  } finally {
    schemaBtn.disabled = false;
    schemaBtn.textContent = 'Generate Schema Markup';
  }
});

// ---------- Copy-to-clipboard ----------
$('copy-schema-btn').addEventListener('click', () => {
  const txt = $('schema-text').textContent;
  navigator.clipboard.writeText(txt).then(() => {
    const btn = $('copy-schema-btn');
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = orig; }, 1500);
  });
});

// ---------- Helpers ----------
function humanize(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
