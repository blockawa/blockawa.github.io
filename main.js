/* 文章数据 */
const posts = [
  {
    title: "Markdown Tutorial",
    date: "2025-01-20",
    tags: ["Markdown", "Blogging"],
    desc: "A simple example of a Markdown blog post.",
    words: 1700,
    mins: 9,
    img: "img/1.jpg"
  },
  {
    title: "Markdown Mermaid",
    date: "2023-10-01",
    tags: ["Markdown", "Blogging", "Mermaid"],
    desc: "A simple example of a Markdown blog post with Mermaid.",
    words: 578,
    mins: 3,
    img: "img/2.jpg"
  },
  {
    title: "Include Video in the Posts",
    date: "2022-08-01",
    tags: ["Example", "Video"],
    desc: "This post demonstrates how to include embedded video in a blog post.",
    words: 62,
    mins: 1,
    img: "img/3.jpg"
  }
];

/* 渲染卡片 */
const grid = document.getElementById('grid');
posts.forEach(p => {
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

/* Lightbox */
const overlay = document.getElementById('overlay');
const overlayImg = document.getElementById('overlay-img');

function openLightbox(src) {
  overlayImg.src = src;
  overlay.classList.add('show');
}
overlay.addEventListener('click', () => overlay.classList.remove('show'));

/* 搜索（简单过滤标题） */
document.getElementById('search').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  [...grid.children].forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    card.style.display = title.includes(q) ? '' : 'none';
  });
});
