/* 文章数据（新增 category 字段） */
const posts = [
  {
    title: "Markdown Tutorial",
    date: "2025-01-20",
    tags: ["Markdown", "Blogging"],
    category: "Markdown",
    words: 1700,
    mins: 9,
    img: "img/1.jpg"
  },
  {
    title: "Markdown Mermaid",
    date: "2023-10-01",
    tags: ["Markdown", "Blogging", "Mermaid"],
    category: "Markdown",
    words: 578,
    mins: 3,
    img: "img/2.jpg"
  },
  {
    title: "Include Video in the Posts",
    date: "2022-08-01",
    tags: ["Example", "Video"],
    category: "Video",
    words: 62,
    mins: 1,
    img: "img/3.jpg"
  },
  {
    title: "Material 3 Migration Guide",
    date: "2024-06-11",
    tags: ["Material", "Guide"],
    category: "Markdown",
    words: 1200,
    mins: 6,
    img: "img/4.jpg"
  },
  {
    title: "Live Coding Session",
    date: "2023-12-25",
    tags: ["Video", "Live"],
    category: "Video",
    words: 0,
    mins: 120,
    img: "img/5.jpg"
  }
];

/* 渲染 */
const grid = document.getElementById('grid');
const tabs = [...document.querySelectorAll('.tab')];
let activeCat = 'all';

function render(cat = 'all') {
  grid.innerHTML = '';
  const filtered = cat === 'all' ? posts : posts.filter(p => p.category === cat);
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="">
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-meta">${p.date} · ${p.words}字 · ${p.mins}分钟</div>
        <div class="card-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
      </div>
    `;
    card.addEventListener('click', () => openLightbox(p.img));
    grid.appendChild(card);
  });
}

/* 分类切换 */
tabs.forEach(tab =>
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCat = tab.dataset.cat;
    render(activeCat);
  })
);

/* 搜索（标题 & 标签） */
document.getElementById('search').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  [...grid.children].forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    const tagText = [...card.querySelectorAll('.card-tags span')].map(s => s.textContent.toLowerCase()).join(' ');
    card.style.display = (title.includes(q) || tagText.includes(q)) ? '' : 'none';
  });
});

/* Lightbox */
const overlay = document.getElementById('overlay');
const overlayImg = document.getElementById('overlay-img');
function openLightbox(src) {
  overlayImg.src = src;
  overlay.classList.add('show');
}
overlay.addEventListener('click', () => overlay.classList.remove('show'));

/* FAB 返回顶部 */
const fab = document.getElementById('fab');
window.addEventListener('scroll', () => {
  fab.classList.toggle('show', window.scrollY > 400);
});
fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* 初始渲染 */
render();
