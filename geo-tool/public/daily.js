/* Daily AI Quiz — frontend logic. */

const $ = (id) => document.getElementById(id);

// ---- State ----
let currentDate = todayStr();
let dailyQuestions = [];
let answeredMap = {}; // { date: { questionId: { selected, correct } } }

// Load persisted state
try {
  answeredMap = JSON.parse(localStorage.getItem('geo_quiz_answered') || '{}');
} catch { answeredMap = {}; }

// ---- Init ----
renderDate();
loadQuestions();
updateStats();

// ---- Date helpers ----
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function shiftDate(dateStr, days) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

// ---- Date nav ----
$('prev-day').addEventListener('click', () => {
  currentDate = shiftDate(currentDate, -1);
  renderDate();
  loadQuestions();
});

$('next-day').addEventListener('click', () => {
  if (currentDate >= todayStr()) return; // Can't go past today
  currentDate = shiftDate(currentDate, 1);
  renderDate();
  loadQuestions();
});

function renderDate() {
  $('current-date').textContent = formatDate(currentDate);
  $('next-day').disabled = currentDate >= todayStr();
  $('next-day').style.opacity = currentDate >= todayStr() ? 0.4 : 1;
}

// ---- Load questions ----
async function loadQuestions() {
  const container = $('questions-container');
  container.innerHTML = '<p class="loading">Loading questions...</p>';
  $('completion-msg').classList.add('hidden');

  try {
    const res = await fetch(`/api/daily-questions?date=${currentDate}`);
    const data = await res.json();
    dailyQuestions = data.questions;
    renderQuestions();
  } catch (e) {
    container.innerHTML = '<p class="loading">Failed to load questions. Is the server running?</p>';
  }
}

// ---- Render questions ----
function renderQuestions() {
  const container = $('questions-container');
  container.innerHTML = '';

  const dateAnswers = answeredMap[currentDate] || {};

  dailyQuestions.forEach((q, idx) => {
    const answered = dateAnswers[q.id];
    const card = document.createElement('div');
    card.className = 'question-card' +
      (answered ? (answered.correct ? ' answered-correct' : ' answered-wrong') : '');
    card.id = `q-${q.id}`;

    card.innerHTML = `
      <div class="q-header">
        <span class="q-category">${q.category}</span>
        <span class="q-difficulty">${q.difficulty}</span>
      </div>
      <div class="q-text">${idx + 1}. ${escapeHtml(q.question)}</div>
      <div class="q-text-zh">${escapeHtml(q.questionZh)}</div>
      <div class="q-options">
        ${q.options.map((opt, oi) => {
          let cls = 'q-option';
          if (answered) {
            if (oi === answered.selected && answered.correct) cls += ' selected-correct';
            else if (oi === answered.selected && !answered.correct) cls += ' selected-wrong';
            if (oi === q.correctIndex && !answered.correct) cls += ' reveal-correct';
          }
          return `<button class="${cls}" data-qi="${q.id}" data-oi="${oi}" ${answered ? 'disabled' : ''}>${escapeHtml(opt)}</button>`;
        }).join('')}
      </div>
      <div class="checkmark ${answered ? (answered.correct ? 'correct' : 'wrong') : ''}">
        <div>
          <strong>${answered ? (answered.correct ? '&#x2705; Correct!' : '&#x274C; Incorrect') : ''}</strong>
          <div class="explanation">${answered ? escapeHtml(q.explanation) : ''}</div>
          <div class="explanation" style="margin-top:4px">${answered ? escapeHtml(q.explanationZh) : ''}</div>
          ${answered && q.resource ? `<div class="explanation" style="margin-top:6px"><a href="${q.resource}" target="_blank" rel="noopener">Learn more &rarr;</a></div>` : ''}
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach click handlers
  container.querySelectorAll('.q-option:not([disabled])').forEach(btn => {
    btn.addEventListener('click', handleAnswer);
  });

  updateProgress();
}

// ---- Handle answer ----
function handleAnswer(e) {
  const btn = e.currentTarget;
  const qId = parseInt(btn.dataset.qi, 10);
  const oIdx = parseInt(btn.dataset.oi, 10);
  const q = dailyQuestions.find(q => q.id === qId);
  if (!q) return;

  const correct = oIdx === q.correctIndex;

  // Save answer
  if (!answeredMap[currentDate]) answeredMap[currentDate] = {};
  answeredMap[currentDate][qId] = { selected: oIdx, correct };
  localStorage.setItem('geo_quiz_answered', JSON.stringify(answeredMap));

  // Re-render that question
  renderQuestions();
  updateStats();

  // Check if all done
  const dateAnswers = answeredMap[currentDate] || {};
  const doneCount = dailyQuestions.filter(q => dateAnswers[q.id]).length;
  if (doneCount === dailyQuestions.length) {
    const correctCount = dailyQuestions.filter(q => dateAnswers[q.id]?.correct).length;
    $('correct-count').textContent = correctCount;
    $('completion-msg').classList.remove('hidden');
    $('completion-msg').scrollIntoView({ behavior: 'smooth' });
  }
}

// ---- Progress bar ----
function updateProgress() {
  const dateAnswers = answeredMap[currentDate] || {};
  const done = dailyQuestions.filter(q => dateAnswers[q.id]).length;
  const total = dailyQuestions.length || 5;
  const pct = Math.round((done / total) * 100);
  $('progress-bar').style.width = pct + '%';
  $('progress-text').textContent = `${done} / ${total} completed`;
}

// ---- Stats (streak & total) ----
function updateStats() {
  // Total answered
  let total = 0;
  for (const date in answeredMap) {
    total += Object.keys(answeredMap[date]).length;
  }
  $('total-answered').textContent = total;

  // Streak: count consecutive days ending at today
  let streak = 0;
  let checkDate = todayStr();
  while (true) {
    const dayAnswers = answeredMap[checkDate];
    if (dayAnswers && Object.keys(dayAnswers).length >= 5) {
      streak++;
      checkDate = shiftDate(checkDate, -1);
    } else {
      break;
    }
  }
  $('streak-count').textContent = streak;
}

// ---- Reminder (browser notification) ----
$('reminder-btn').addEventListener('click', async () => {
  const btn = $('reminder-btn');

  if (btn.classList.contains('active-reminder')) {
    // Turn off
    localStorage.removeItem('geo_quiz_reminder');
    btn.classList.remove('active-reminder');
    btn.textContent = 'Set Daily Reminder';
    return;
  }

  // Request notification permission
  if (!('Notification' in window)) {
    alert('Your browser does not support notifications. Try Chrome or Edge.');
    return;
  }

  const perm = await Notification.requestPermission();
  if (perm !== 'granted') {
    alert('Notification permission denied. Please enable it in browser settings.');
    return;
  }

  // Ask for time
  const time = prompt('What time should I remind you daily? (24h format, e.g., 10:30)', '10:30');
  if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return;

  localStorage.setItem('geo_quiz_reminder', time);
  btn.classList.add('active-reminder');
  btn.textContent = `Reminder set: ${time} daily`;
  scheduleReminder(time);
});

// Check if reminder is already set
(function initReminder() {
  const saved = localStorage.getItem('geo_quiz_reminder');
  if (saved) {
    const btn = $('reminder-btn');
    btn.classList.add('active-reminder');
    btn.textContent = `Reminder set: ${saved} daily`;
    scheduleReminder(saved);
  }
})();

function scheduleReminder(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  function check() {
    const now = new Date();
    if (now.getHours() === h && now.getMinutes() === m) {
      const dateAnswers = answeredMap[todayStr()] || {};
      const done = Object.keys(dateAnswers).length;
      if (done < 5) {
        new Notification('GEO Daily AI Quiz', {
          body: `You have ${5 - done} questions left today. Keep your streak going!`,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧠</text></svg>'
        });
      }
    }
  }
  // Check every 60 seconds
  setInterval(check, 60000);
}

// ---- Helpers ----
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
