const ADMIN_PASSWORD = '123456';   // 本地密码，可自行修改

const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
  setup() {
    const logined = ref(false);
    const password = ref('');
    const page = ref('list');
    const posts = ref([]);
    const keyword = ref('');
    const filterCat = ref('all');
    const curPage = ref(1);
    const pageSize = 10;
    const isNew = ref(true);
    const editingId = ref(null);
    const form = ref({ title: '', category: '', body: '' });
    const previewHTML = ref('');
    const fileInput = ref(null);

    function login() {
      if (password.value === ADMIN_PASSWORD) {
        localStorage.setItem('cat_admin', '1');
        logined.value = true;
        loadPosts();
      } else {
        alert('密码错误');
      }
    }

    function logout() {
      localStorage.removeItem('cat_admin');
      logined.value = false;
    }

    function loadPosts() {
      const data = JSON.parse(localStorage.getItem('cat_posts') || '[]');
      posts.value = data.map((p, idx) => ({ ...p, id: p.id || idx }));
    }

    function savePosts() {
      localStorage.setItem('cat_posts', JSON.stringify(posts.value));
    }

    const categories = computed(() => {
      const set = new Set(posts.value.map(p => p.category));
      return Array.from(set).sort();
    });

    const filtered = computed(() => {
      let list = posts.value;
      if (filterCat.value !== 'all') {
        list = list.filter(p => p.category === filterCat.value);
      }
      if (keyword.value.trim()) {
        const q = keyword.value.toLowerCase();
        list = list.filter(p => p.title.toLowerCase().includes(q) || p.tags.join(' ').toLowerCase().includes(q));
      }
      return list.reverse(); // 新 -> 旧
    });

    const pages = computed(() => {
      const len = Math.ceil(filtered.value.length / pageSize);
      return Array.from({ length: len }, (_, i) => i + 1);
    });

    const paginated = computed(() => {
      const start = (curPage.value - 1) * pageSize;
      return filtered.value.slice(start, start + pageSize);
    });

    function openNew() {
      isNew.value = true;
      editingId.value = null;
      form.value = { title: '', category: '', body: '' };
      previewHTML.value = '';
      page.value = 'edit';
    }

    function edit(item) {
      isNew.value = false;
      editingId.value = item.id;
      form.value = { title: item.title, category: item.category, body: item.body || '' };
      renderMarkdown();
      page.value = 'edit';
    }

    function save() {
      if (!form.value.title.trim()) { alert('标题不能为空'); return; }
      const payload = {
        ...form.value,
        date: new Date().toISOString().slice(0, 10),
        words: form.value.body.length,
        mins: Math.max(1, Math.round(form.value.body.length / 300)),
        tags: form.value.body.match(/#[\u4e00-\u9fa5\w-]+/g)?.map(t => t.slice(1)) || []
      };
      if (isNew.value) {
        payload.id = Date.now();
        posts.value.unshift(payload);
      } else {
        const idx = posts.value.findIndex(p => p.id === editingId.value);
        if (idx !== -1) Object.assign(posts.value[idx], payload);
      }
      savePosts();
      page.value = 'list';
    }

    function remove(id) {
      if (confirm('确定删除？')) {
        posts.value = posts.value.filter(p => p.id !== id);
        savePosts();
      }
    }

    function renderMarkdown() {
      previewHTML.value = marked.parse(form.value.body);
    }

    function exportJSON() {
      const blob = new Blob([JSON.stringify(posts.value, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cat_posts_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    function importJSON(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!Array.isArray(data)) throw new Error('格式错误');
          posts.value = data;
          savePosts();
          curPage.value = 1;
          alert('导入成功');
        } catch (err) {
          alert('导入失败：' + err.message);
        }
        e.target.value = '';
      };
      reader.readAsText(file);
    }

    onMounted(() => {
      if (localStorage.getItem('cat_admin')) {
        logined.value = true;
        loadPosts();
      }
    });

    return {
      logined, password, page, keyword, filterCat, curPage,
      paginated, pages, categories, isNew, form, previewHTML, fileInput,
      login, logout, openNew, edit, save, remove, exportJSON, importJSON, renderMarkdown
    };
  }
}).mount('#app');
