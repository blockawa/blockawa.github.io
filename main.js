/* ========== 示例文章数据 ========== */
const posts = [
  {
    title: "Markdown Tutorial",
    date: "2025-01-20",
    tags: ["Markdown", "Blogging"],
    category: "Markdown",
    desc: "一篇简洁易懂的 Markdown 入门教程。",
    img: "img/1.jpg"
  },
  {
    title: "Markdown Mermaid",
    date: "2023-10-01",
    tags: ["Markdown", "Blogging", "Mermaid"],
    category: "Markdown",
    desc: "在 Markdown 中优雅绘制 Mermaid 流程图。",
    img: "img/2.jpg"
  },
  {
    title: "Include Video in the Posts",
    date: "2022-08-01",
    tags: ["Example", "Video"],
    category: "Video",
    desc: "演示如何在博客文章中嵌入视频。",
    img: "img/3.jpg"
  }
];

/* ========== DOM 引用 ========== */
const grid     = document.getElementById('grid');
const tabs     = [...document.querySelectorAll('.tab')];
const search   = document.getElementById('search');
const overlay  = document.getElementById('overlay');
const overlayImg = document.getElementById('overlay-img');
const fab      = document.getElementById('fab');

/* ========== 渲染网格 ========== */
function render(cat = 'all') {
  grid.innerHTML = '';
  const filtered = (cat === 'all') ? posts : posts.filter(p => p.category === cat);
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    // 仅在“全部”分类下显示标签
    const tagsHTML = (cat === 'all' && p.tags.length)
      ? `<div class="card-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>`
      : '';

    card.innerHTML = `
      <img src="${p.img}" alt="">
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-meta">${p.desc}</div>
        ${tagsHTML}
      </div>
    `;
    card.addEventListener('click', () => openLightbox(p.img));
    grid.appendChild(card);
  });
}

/* ========== 分类 TabRow ========== */
tabs.forEach(tab =>
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    render(tab.dataset.cat);
  })
);

/* ========== 搜索（标题 + 标签） ========== */
search.addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  [...grid.children].forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    const tagText = [...card.querySelectorAll('.card-tags span')]
      .map(s => s.textContent.toLowerCase())
      .join(' ');
    card.style.display = (title.includes(q) || tagText.includes(q)) ? '' : 'none';
  });
});

/* ========== Lightbox ========== */
function openLightbox(src) {
  overlayImg.src = src;
  overlay.classList.add('show');
}
overlay.addEventListener('click', () => overlay.classList.remove('show'));

/* ========== 返回顶部 FAB ========== */
window.addEventListener('scroll', () => fab.classList.toggle('show', window.scrollY > 400));
fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ========== 实时公告 ========== */
async function loadNotice() {
  try {
    const res = await fetch('notice.json?t=' + Date.now());
    const data = await res.json();
    const notice = document.createElement('div');
    notice.id = 'notice';
    notice.textContent = data.msg;
    document.body.appendChild(notice);
    setTimeout(() => { notice.style.opacity = 0; }, 5000);
    setTimeout(() => notice.remove(), 5400);
  } catch (_) {}
}

/* ========== Material 3 加载完成 ========== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.classList.add('hide');
  setTimeout(() => loader.remove(), 500);
  loadNotice();
});

/* ========== 路由平滑过渡 ========== */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href]:not([href^="#"])');
  if (!link) return;
  e.preventDefault();
  document.body.classList.add('fade-out');
  setTimeout(() => (location.href = link.href), 300);
});

/* ========== 首次渲染 ========== */
render();
