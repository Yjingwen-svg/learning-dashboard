const chapters = [
  { id: 1, title: '第 1 章：基础入门', tasks: ['任务 A', '任务 B'] },
  { id: 2, title: '第 2 章：核心概念', tasks: ['任务 C', '任务 D'] },
  // ... 补到 10 章
];

const storageKey = 'learning-progress';
let progress = JSON.parse(localStorage.getItem(storageKey) || '{}');

function save() {
  localStorage.setItem(storageKey, JSON.stringify(progress));
}

function render() {
  const container = document.getElementById('chapters');
  container.innerHTML = '';
  chapters.forEach(ch => {
    const doneCount = (progress[ch.id] || []).length;
    const percent = Math.round((doneCount / ch.tasks.length) * 100);

    const div = document.createElement('div');
    div.className = 'chapter';
    div.innerHTML = `
      <button class="toggle">${ch.title}</button>
      <div class="progress-bar"><div style="width:${percent}%"></div></div>
      <ul class="tasks" style="display:none;">
        ${ch.tasks.map((t, i) => `
          <li>
            <label>
              <input type="checkbox" data-ch="${ch.id}" data-i="${i}"
                ${(progress[ch.id] || []).includes(i) ? 'checked' : ''}>
              ${t}
            </label>
          </li>`).join('')}
      </ul>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll('.toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const ul = btn.nextElementSibling.nextElementSibling;
      ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
    });
  });

  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const chId = cb.dataset.ch;
      const i = Number(cb.dataset.i);
      if (!progress[chId]) progress[chId] = [];
      if (cb.checked) {
        if (!progress[chId].includes(i)) progress[chId].push(i);
      } else {
        progress[chId] = progress[chId].filter(x => x !== i);
      }
      save();
      render(); // 重新渲染以更新进度条
    });
  });
}

render();