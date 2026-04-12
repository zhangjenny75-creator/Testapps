/* Study Resources page logic. */

let allResources = [];
let showFreeOnly = false;

async function loadResources() {
  const container = document.getElementById('resources-container');
  try {
    const res = await fetch('/api/resources');
    const data = await res.json();
    allResources = data.resources;
    renderResources();
  } catch (e) {
    container.innerHTML = '<p class="loading">Failed to load resources.</p>';
  }
}

function renderResources() {
  const container = document.getElementById('resources-container');
  container.innerHTML = '';

  allResources.forEach(cat => {
    const items = showFreeOnly ? cat.items.filter(i => i.free) : cat.items;
    if (items.length === 0) return;

    const section = document.createElement('div');
    section.className = 'resource-category';
    section.innerHTML = `
      <h2>${esc(cat.category)}</h2>
      <div class="cat-zh">${esc(cat.categoryZh)}</div>
      ${items.map(item => `
        <div class="resource-item">
          <div class="resource-info">
            <div class="resource-name">${esc(item.name)}</div>
            <div class="resource-name-zh">${esc(item.nameZh)}</div>
          </div>
          <div class="resource-meta">
            <span class="badge badge-level">${esc(item.level)}</span>
            <span class="badge ${item.free ? 'badge-free' : 'badge-paid'}">${item.free ? 'Free' : 'Paid'}</span>
            <a class="resource-link" href="${item.url}" target="_blank" rel="noopener">Open &rarr;</a>
          </div>
        </div>
      `).join('')}
    `;
    container.appendChild(section);
  });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showFreeOnly = btn.dataset.filter === 'free';
    renderResources();
  });
});

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadResources();
