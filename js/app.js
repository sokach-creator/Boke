/* ============================================================
 * Sokach Blog —— 单文件应用逻辑（路由 + 渲染）
 * 无任何依赖，配合 js/data.js 使用
 * ============================================================ */
"use strict";

/* ---------------- 内联图标 ---------------- */
const ICONS = {
  home:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/></svg>',
  clock:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  folder:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  image:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m5 19 5.5-5.5 3 3L17 13l4 4"/></svg>',
  chat:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H4l1.6-3.2A8 8 0 1 1 21 12Z"/></svg>',
  link:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 0 7.1 0l2.4-2.4a5 5 0 0 0-7.1-7.1L11 5.9"/><path d="M14 10a5 5 0 0 0-7.1 0l-2.4 2.4a5 5 0 0 0 7.1 7.1L13 18.1"/></svg>',
  message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18v11H8l-5 4Z"/><path d="M8 9h8M8 12.5h5"/></svg>',
  user:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  search:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>',
  moon:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5Z"/></svg>',
  sun:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9 6.7 6.7M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>',
  menu:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 6-6 6 6"/></svg>',
  github:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 8.8 21.5c.5.1.7-.2.7-.5v-1.7C6.7 19.9 6.1 18 6.1 18c-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5A3.9 3.9 0 0 1 6.7 8.7a3.6 3.6 0 0 1 .1-2.7s.9-.3 2.8 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1.1 2.7c0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>',
  bilibili:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4.5 9.5 8M17 4.5 14.5 8"/><rect x="3" y="8" width="18" height="12" rx="3"/><path d="m9 12.5 3 1.7 3-1.7"/></svg>',
  mail:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 2.8V7M16 2.8V7M3.5 10.5h17"/></svg>',
  tag:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.6 2.6 21 11a2 2 0 0 1 0 2.8l-6.8 6.8a2 2 0 0 1-2.8 0L3 12.2V4a2 2 0 0 1 2-2h7.2Z"/><circle cx="8.2" cy="8.2" r="1.4"/></svg>',
  pen:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
};

/* ---------------- 工具函数 ---------------- */
const $  = (sel) => document.querySelector(sel);
const app = $("#app");
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function excerptOf(a) {
  if (a.excerpt) return a.excerpt;
  const plain = a.content.replace(/[#>*`\-\[\]!()]/g, "").replace(/\s+/g, " ").trim();
  return plain.slice(0, 90) + "…";
}
function fmtDate(d) {
  const dt = new Date(d + "T00:00:00");
  return `${dt.getFullYear()} 年 ${dt.getMonth() + 1} 月 ${dt.getDate()} 日`;
}

/* ---------------- 迷你 Markdown 渲染器 ---------------- */
function renderMarkdown(md) {
  let html = "";
  const lines = md.split("\n");
  let inCode = false, codeBuf = [], listMode = null, quoteMode = false, tableBuf = null;

  const flushTable = () => {
    if (!tableBuf || !tableBuf.length) { tableBuf = null; return; }
    const rows = tableBuf
      .filter(r => !/^\|[\s:|-]+\|$/.test(r))
      .map(r => r.replace(/^\||\|$/g, "").split("|").map(c => c.trim()));
    if (rows.length) {
      html += "<table><thead><tr>" + rows[0].map(c => `<th>${inline(c)}</th>`).join("") + "</tr></thead><tbody>";
      rows.slice(1).forEach(r => { html += "<tr>" + r.map(c => `<td>${inline(c)}</td>`).join("") + "</tr>"; });
      html += "</tbody></table>";
    }
    tableBuf = null;
  };

  const inline = (t) => escapeHtml(t)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

  const closeAll = () => {
    if (listMode) { html += `</${listMode}>`; listMode = null; }
    if (quoteMode) { html += "</blockquote>"; quoteMode = false; }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim().startsWith("```")) {
      if (inCode) { html += `<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`; codeBuf = []; inCode = false; }
      else { closeAll(); inCode = true; }
      continue;
    }
    if (inCode) { codeBuf.push(raw); continue; }

    if (!line.trim()) { closeAll(); continue; }
    if (/^-{3,}$/.test(line.trim())) { closeAll(); html += "<hr>"; continue; }

    if (line.trim().startsWith("|")) { closeAll(); (tableBuf ||= []).push(line.trim()); continue; }
    if (tableBuf) flushTable();

    const h = line.match(/^(#{1,4})\s+(.*)/);
    if (h) { closeAll(); const lv = h[1].length; html += `<h${lv + 1} class="md-h">${inline(h[2])}</h${lv + 1}>`; continue; }

    if (line.startsWith(">")) {
      if (!quoteMode) { closeAll(); html += "<blockquote>"; quoteMode = true; }
      html += `<p>${inline(line.replace(/^>\s?/, ""))}</p>`; continue;
    }

    const ul = line.match(/^[-*]\s+(.*)/);
    const ol = line.match(/^(\d+)[.、]\s+(.*)/);
    if (ul) {
      if (listMode !== "ul") { closeAll(); html += "<ul>"; listMode = "ul"; }
      html += `<li>${inline(ul[1])}</li>`; continue;
    }
    if (ol) {
      if (listMode !== "ol") { closeAll(); html += "<ol>"; listMode = "ol"; }
      html += `<li>${inline(ol[2])}</li>`; continue;
    }

    closeAll();
    html += `<p>${inline(line)}</p>`;
  }
  if (inCode) html += `<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`;
  if (tableBuf) flushTable();
  closeAll();
  return html;
}

/* ---------------- 顶部导航 ---------------- */
const NAV_ITEMS = [
  { hash: "#/home",       text: "主页",   icon: "home" },
  { hash: "#/timeline",   text: "时间轴", icon: "clock" },
  { hash: "#/categories", text: "分类",   icon: "folder" },
  { hash: "#/albums",     text: "相册",   icon: "image" },
  { hash: "#/says",       text: "说说",   icon: "chat" },
  { hash: "#/friends",    text: "友链",   icon: "link" },
  { hash: "#/message",    text: "留言",   icon: "message" },
  { hash: "#/about",      text: "关于",   icon: "user" },
];

function buildNav() {
  $("#navLinks").innerHTML = NAV_ITEMS.map(
    (it) => `<a href="${it.hash}" data-hash="${it.hash}">${ICONS[it.icon]}<span>${it.text}</span></a>`
  ).join("");
  $("#drawer").innerHTML = NAV_ITEMS.map(
    (it) => `<a href="${it.hash}" data-hash="${it.hash}">${ICONS[it.icon]}<span>${it.text}</span></a>`
  ).join("") + `<div class="drawer-socials">${SITE.socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener" title="${s.name}">${ICONS[s.icon] || ICONS.link}</a>`).join("")}</div>`;
  $("#searchBtn").innerHTML = ICONS.search;
  $("#searchIcon").innerHTML = ICONS.search;
  $("#backTop").innerHTML = ICONS.arrowUp;
  $("#navAvatar").src = SITE.avatar;
  $("#footer").innerHTML = `
    <div class="footer-inner">
      <p class="footer-motto">${SITE.motto}</p>
      <p>© ${new Date().getFullYear()} ${SITE.name} · 手写 HTML/CSS/JS${SITE.beian ? ` · ${SITE.beian}` : ""}</p>
    </div>`;
}

function markActiveNav(hash) {
  const base = "#/" + (hash.replace(/^#\//, "").split("/")[0] || "home");
  const active = ["#/article"].includes(base) ? "#/home" : base;
  document.querySelectorAll("a[data-hash]").forEach(a =>
    a.classList.toggle("active", a.dataset.hash === active));
}

/* ---------------- 页面片段 ---------------- */
const WAVE = `<svg class="wave" viewBox="0 0 1440 120" preserveAspectRatio="none"><path fill="currentColor" d="M0,64 C240,110 480,116 720,92 C960,68 1200,20 1440,48 L1440,120 L0,120 Z"></path></svg>`;

function heroBlock() {
  return `
  <section class="hero">
    <div class="hero-bg" style="background-image:url('${SITE.banner}')"></div>
    <div class="hero-mask"></div>
    <div class="hero-content">
      <img class="hero-avatar" src="${SITE.avatar}" alt="头像">
      <h1 class="hero-title">${SITE.name}</h1>
      <p class="hero-motto">${SITE.motto}</p>
      <div class="hero-socials">
        ${SITE.socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener" title="${s.name}">${ICONS[s.icon] || ICONS.link}</a>`).join("")}
      </div>
    </div>
    <a class="hero-scroll" href="#post-list" aria-label="向下滚动"><span></span></a>
    ${WAVE}
  </section>`;
}

function articleCard(a) {
  return `
  <article class="post-card reveal">
    <a class="post-cover" href="#/article/${a.slug}">
      <img src="${a.cover}" alt="${escapeHtml(a.title)}" loading="lazy">
    </a>
    <div class="post-body">
      <h2 class="post-title"><a href="#/article/${a.slug}">${escapeHtml(a.title)}</a></h2>
      <div class="post-meta">
        <span>${ICONS.calendar}${fmtDate(a.date)}</span>
        <a class="meta-cat" href="#/categories">${ICONS.folder}${escapeHtml(a.category)}</a>
      </div>
      <p class="post-excerpt">${escapeHtml(excerptOf(a))}</p>
      <a class="post-more" href="#/article/${a.slug}">阅读全文 →</a>
    </div>
  </article>`;
}

function slimHeader(title, sub) {
  return `
  <section class="page-hero">
    <div class="hero-bg" style="background-image:url('${SITE.banner}')"></div>
    <div class="hero-mask"></div>
    <div class="page-hero-content">
      <h1>${title}</h1>
      ${sub ? `<p>${sub}</p>` : ""}
    </div>
    ${WAVE}
  </section>`;
}

function revealObserve() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

/* ---------------- 各页面 ---------------- */
function pageHome() {
  const cards = ARTICLES.map(articleCard).join("");
  app.innerHTML = `
    ${heroBlock()}
    <div class="container" id="post-list">
      <section class="profile-card reveal">
        <img class="profile-avatar" src="${SITE.avatar}" alt="头像">
        <div class="profile-info">
          <h3>${SITE.name}</h3>
          <p>${SITE.motto}</p>
          <div class="profile-stats">
            <span><b>${ARTICLES.length}</b> 文章</span>
            <span><b>${new Set(ARTICLES.map(a => a.category)).size}</b> 分类</span>
            <span><b>${SAYS.length}</b> 说说</span>
          </div>
        </div>
      </section>
      ${cards}
      <div class="home-end reveal">— 到底啦，去<a href="#/timeline">时间轴</a>翻翻旧文吧 —</div>
    </div>`;
}

function pageArticle(slug) {
  const a = ARTICLES.find(x => x.slug === slug);
  if (!a) { app.innerHTML = `<section class="page-hero"><div class="hero-bg" style="background-image:url('${SITE.banner}')"></div><div class="hero-mask"></div><div class="page-hero-content"><h1>404</h1><p>这篇文章好像飞走了</p></div></section>`; return; }
  const idx = ARTICLES.indexOf(a);
  const prev = ARTICLES[idx + 1], next = ARTICLES[idx - 1];
  app.innerHTML = `
    <section class="page-hero article-hero">
      <div class="hero-bg" style="background-image:url('${a.cover || SITE.banner}')"></div>
      <div class="hero-mask"></div>
      <div class="page-hero-content">
        <h1>${escapeHtml(a.title)}</h1>
        <p>${fmtDate(a.date)} · ${escapeHtml(a.category)} · ${a.tags.map(t => "#" + escapeHtml(t)).join(" ")}</p>
      </div>
    </section>
    <div class="container">
      <article class="post-content reveal">${renderMarkdown(a.content)}</article>
      <nav class="post-nav reveal">
        ${prev ? `<a class="pn prev" href="#/article/${prev.slug}"><small>← 上一篇</small><span>${escapeHtml(prev.title)}</span></a>` : "<span></span>"}
        ${next ? `<a class="pn next" href="#/article/${next.slug}"><small>下一篇 →</small><span>${escapeHtml(next.title)}</span></a>` : "<span></span>"}
      </nav>
      ${commentSection("公开评论")}
    </div>`;
  mountComment($("#commentMount"));
}

function pageTimeline() {
  const byYear = {};
  ARTICLES.forEach(a => { (byYear[a.date.slice(0, 4)] ||= []).push(a); });
  const years = Object.keys(byYear).sort((x, y) => y.localeCompare(x));
  app.innerHTML = `
    ${slimHeader("时间轴", `共 ${ARTICLES.length} 篇文章，慢慢写，不着急`)}
    <div class="container">
      <div class="timeline reveal">
        ${years.map(y => `
          <div class="tl-year"><span>${y}</span></div>
          ${byYear[y].map(a => `
            <a class="tl-item" href="#/article/${a.slug}">
              <span class="tl-dot"></span>
              <span class="tl-date">${a.date.slice(5).replace("-", " / ")}</span>
              <span class="tl-title">${escapeHtml(a.title)}</span>
            </a>`).join("")}`).join("")}
      </div>
    </div>`;
}

function pageCategories() {
  const map = {};
  ARTICLES.forEach(a => { (map[a.category] ||= []).push(a); });
  const cats = Object.keys(map);
  app.innerHTML = `
    ${slimHeader("分类", `${cats.length} 个分类`)}
    <div class="container">
      <div class="cat-cloud reveal">
        ${cats.map(c => `<button class="cat-chip" data-cat="${escapeHtml(c)}">${escapeHtml(c)}<small>${map[c].length}</small></button>`).join("")}
      </div>
      <div id="catList"></div>
    </div>`;
  const renderList = (c) => {
    $("#catList").innerHTML = (c ? map[c] : ARTICLES).map(articleCard).join("");
    document.querySelectorAll(".cat-chip").forEach(b => b.classList.toggle("active", b.dataset.cat === c));
    revealObserve();
  };
  document.querySelectorAll(".cat-chip").forEach(b => b.onclick = () => renderList(b.dataset.cat));
  renderList(null);
}

function pageAlbums() {
  app.innerHTML = `
    ${slimHeader("相册", "生活的截图 · 点击查看大图")}
    <div class="container">
      <div class="album-grid">
        ${ALBUMS.map(p => `
          <figure class="album-item reveal" data-src="${p.src}">
            <img src="${p.src}" alt="${escapeHtml(p.title)}" loading="lazy">
            <figcaption><b>${escapeHtml(p.title)}</b><span>${p.date}</span></figcaption>
          </figure>`).join("")}
      </div>
    </div>`;
  document.querySelectorAll(".album-item").forEach(f => f.onclick = () => {
    $("#lightboxImg").src = f.dataset.src;
    $("#lightbox").hidden = false;
  });
}

function pageSays() {
  app.innerHTML = `
    ${slimHeader("说说", "碎碎念 · 一句话的日常")}
    <div class="container">
      ${SAYS.map(s => `
        <div class="say-card reveal">
          <img class="say-avatar" src="${SITE.avatar}" alt="">
          <div class="say-bubble">
            <div class="say-head"><b>${SITE.name}</b><time>${s.date}</time></div>
            <p>${escapeHtml(s.text)}</p>
            <span class="say-mood">${s.mood}</span>
          </div>
        </div>`).join("")}
    </div>`;
}

function pageFriends() {
  app.innerHTML = `
    ${slimHeader("友情链接", "山不见我，我自去见山")}
    <div class="container">
      <div class="friend-grid">
        ${FRIENDS.map(f => `
          <a class="friend-card reveal" href="${f.url}" target="_blank" rel="noopener">
            <img src="${f.avatar || SITE.avatar}" alt="" onerror="this.src='${SITE.avatar}'">
            <div><b>${escapeHtml(f.name)}</b><span>${escapeHtml(f.desc)}</span></div>
          </a>`).join("")}
      </div>
      <div class="friend-tip reveal">
        ${ICONS.link}
        <p>想交换友链？欢迎到<a href="#/message">留言板</a>告诉我你的<b>站点名称、链接和简介</b>，看到就会添加～</p>
      </div>
    </div>`;
}

function pageMessage() {
  app.innerHTML = `
    ${slimHeader("留言板", "路过就留下点声音吧")}
    <div class="container">
      <div class="msg-form-card reveal">
        <div class="msg-form-head">${ICONS.pen}<b>写条留言</b></div>
        <input id="msgName" type="text" maxlength="20" placeholder="怎么称呼你？（选填）">
        <textarea id="msgText" maxlength="300" rows="4" placeholder="说点什么吧…（300 字以内）"></textarea>
        <div class="msg-form-foot">
          <small>上面这块是本地草稿留言，只保存在你自己的浏览器里；<b>公开留言请使用下方评论区</b>（配合 GitHub 评论或独立后端，所有人可见）。</small>
          <button id="msgSubmit">发送 ✈️</button>
        </div>
      </div>
      <div id="msgWall"></div>
      ${commentSection("公开留言板（所有人可见）")}
    </div>`;
  const KEY = "sokach-blog-messages";
  const renderWall = () => {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    $("#msgWall").innerHTML = list.length
      ? list.map(m => `
        <div class="say-card reveal visible">
          <img class="say-avatar" src="${SITE.avatar}" alt="">
          <div class="say-bubble">
            <div class="say-head"><b>${escapeHtml(m.name || "神秘访客")}</b><time>${m.time}</time></div>
            <p>${escapeHtml(m.text)}</p>
          </div>
        </div>`).join("")
      : `<div class="msg-empty reveal visible">还没有留言，来做第一个吧～</div>`;
  };
  $("#msgSubmit").onclick = () => {
    const text = $("#msgText").value.trim();
    if (!text) { $("#msgText").focus(); return; }
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    list.unshift({ name: $("#msgName").value.trim(), text, time: new Date().toLocaleString("zh-CN", { hour12: false }) });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
    $("#msgText").value = ""; $("#msgName").value = "";
    renderWall();
  };
  renderWall();
  mountComment($("#commentMount"));
}

function pageAbout() {
  app.innerHTML = `
    ${slimHeader("关于本站", "一间互联网上的小房间")}
    <div class="container">
      <article class="post-content reveal">
        <p>你好，我是 <b>Sokach</b>，欢迎来到我的个人博客。</p>
        <h2 class="md-h">关于我</h2>
        <ul>
          <li>🏋️ 喜欢折腾各种有意思的东西</li>
          <li>📷 偶尔拍照，🚶 偶尔散步，🎧 经常戴耳机</li>
          <li>✍️ 想把学到的东西、想到的事情都写下来</li>
        </ul>
        <h2 class="md-h">关于本站</h2>
        <ul>
          <li>前台为手写 HTML / CSS / JavaScript，无框架、零依赖</li>
          <li>部署在免费静态托管平台，通过 CNAME 绑定自有域名</li>
          <li>支持暗色模式、全文搜索、Markdown 写作</li>
        </ul>
        <blockquote><p>如果内容对你有帮助，欢迎常来。—— 来自 ${SITE.name}</p></blockquote>
      </article>
    </div>`;
}

function pageSearch() { /* 搜索走弹窗，不占路由 */ }

/* ---------------- 公开评论（Giscus / Waline） ---------------- */
let walineInstance = null;

const isDarkNow = () => document.documentElement.classList.contains("dark");

function commentHint(el, msg) {
  const d = document.createElement("div");
  d.className = "comment-hint";
  d.innerHTML = `💬 ${msg}`;
  el.appendChild(d);
}

function mountComment(el) {
  if (!el || typeof COMMENT === "undefined" || !COMMENT || COMMENT.provider === "none") return;
  if (COMMENT.provider === "giscus") return mountGiscus(el);
  if (COMMENT.provider === "waline") return mountWaline(el);
}

/* 每次路由切换前调用，防止评论组件残留 */
function unmountComment() {
  if (walineInstance) { try { walineInstance.destroy(); } catch (e) {} walineInstance = null; }
  try { window.WalineBlog?.instance?.destroy?.(); } catch (e) {}
  if (window.WalineBlog) window.WalineBlog.instance = null;
}

function mountGiscus(el) {
  const g = COMMENT.giscus || {};
  if (!g.repo || !g.repoId || !g.categoryId) {
    commentHint(el,
      `公开评论尚未配置：在 <code>js/data.js</code> 的 <b>COMMENT.giscus</b> 中填入
       <code>repo</code> / <code>repoId</code> / <code>categoryId</code>，
       获取方法见 <b>README「接入公开评论」</b>。`);
    return;
  }
  const holder = document.createElement("div");
  holder.className = "giscus-holder";
  el.appendChild(holder);
  const s = document.createElement("script");
  s.src = "https://giscus.app/client.js";
  s.async = true;
  s.crossOrigin = "anonymous";
  [
    ["data-repo", g.repo],
    ["data-repo-id", g.repoId],
    ["data-category", g.category || "Announcements"],
    ["data-category-id", g.categoryId],
    ["data-mapping", g.mapping || "url"],
    ["data-strict", "0"],
    ["data-reactions-enabled", "1"],
    ["data-emit-metadata", "0"],
    ["data-input-position", "top"],
    ["data-theme", isDarkNow() ? "dark" : "light"],
    ["data-lang", g.lang || "zh-CN"],
    ["data-loading", "lazy"],
  ].forEach(([k, v]) => s.setAttribute(k, v));
  holder.appendChild(s);
}

function mountWaline(el) {
  const w = COMMENT.waline || {};
  if (!w.serverURL) {
    commentHint(el,
      `公开评论尚未配置：在 <code>js/data.js</code> 的 <b>COMMENT.waline</b> 中填入
       <code>serverURL</code>（部署方法见 <b>README「接入公开评论」</b>）。`);
    return;
  }
  const holder = document.createElement("div");
  holder.id = "waline-holder";
  el.appendChild(holder);
  if (!document.querySelector('link[data-waline]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/@waline/client@3/dist/waline.css";
    link.setAttribute("data-waline", "1");
    document.head.appendChild(link);
  }
  window.WalineBlog = window.WalineBlog || {};
  const s = document.createElement("script");
  s.type = "module";
  s.textContent = `
    import("https://unpkg.com/@waline/client@3/dist/waline.js")
      .then((m) => {
        window.WalineBlog.instance = m.init({
          el: "#waline-holder",
          serverURL: ${JSON.stringify(w.serverURL)},
          path: location.hash || "#/home",
          dark: "html.dark",
          lang: "zh-CN",
          emoji: ${JSON.stringify(w.emoji || [])},
          reaction: ${w.reaction === true ? "true" : "false"},
        });
        window.WalineBlog.loaded = true;
      })
      .catch(() => {
        document.getElementById("waline-holder").innerHTML =
          '<div class="comment-hint">⚠️ Waline 脚本加载失败，请检查网络或更换 CDN 地址。</div>';
      });`;
  el.appendChild(s);
  walineInstance = null; /* 实例由模块异步创建，销毁时走 window.WalineBlog */
}

/* 暗色切换时同步 giscus 主题 */
function syncCommentTheme(dark) {
  document.querySelectorAll("iframe.giscus-frame").forEach((frame) => {
    frame.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: dark ? "dark" : "light" } } },
      "https://giscus.app"
    );
  });
}

/* 评论区块的通用 HTML */
function commentSection(title) {
  return `
    <section class="comment-card reveal" id="commentMount">
      <div class="comment-title">${ICONS.chat}${title}</div>
    </section>`;
}

/* ---------------- 路由 ---------------- */
const ROUTES = {
  home:       pageHome,
  timeline:   pageTimeline,
  categories: pageCategories,
  albums:     pageAlbums,
  says:       pageSays,
  friends:    pageFriends,
  message:    pageMessage,
  about:      pageAbout,
};

function router() {
  const hash = location.hash || "#/home";
  const [, page, param] = hash.split("/");
  closeDrawer();
  $("#lightbox").hidden = true;
  unmountComment();
  if (page === "article") pageArticle(param);
  else (ROUTES[page] || pageHome)();
  markActiveNav(hash);
  document.body.classList.toggle("at-hero", hash === "#/home");
  window.scrollTo(0, 0);
  revealObserve();
}

/* ---------------- 暗色模式 ---------------- */
function initTheme() {
  const saved = localStorage.getItem("sokach-theme");
  const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
  $("#themeBtn").innerHTML = dark ? ICONS.sun : ICONS.moon;
}
function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("sokach-theme", dark ? "dark" : "light");
  $("#themeBtn").innerHTML = dark ? ICONS.sun : ICONS.moon;
  syncCommentTheme(dark);
}

/* ---------------- 搜索 ---------------- */
function initSearch() {
  const mask = $("#searchMask"), input = $("#searchInput"), box = $("#searchResults");
  const open = () => { mask.hidden = false; input.value = ""; box.innerHTML = `<div class="search-tip">支持标题、摘要、正文全文检索</div>`; setTimeout(() => input.focus(), 30); };
  const close = () => { mask.hidden = true; };
  const run = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { box.innerHTML = `<div class="search-tip">支持标题、摘要、正文全文检索</div>`; return; }
    const hits = ARTICLES.filter(a =>
      a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
    box.innerHTML = hits.length
      ? hits.map(a => `<a class="search-hit" href="#/article/${a.slug}"><b>${escapeHtml(a.title)}</b><span>${escapeHtml(excerptOf(a)).slice(0, 70)}…</span></a>`).join("")
      : `<div class="search-tip">没有找到与「${escapeHtml(input.value)}」相关的文章</div>`;
  };
  $("#searchBtn").onclick = open;
  $("#searchClose").onclick = close;
  mask.addEventListener("click", (e) => { if (e.target === mask) close(); });
  input.addEventListener("input", run);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { const first = box.querySelector(".search-hit"); if (first) { close(); location.hash = first.getAttribute("href"); } } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); closeDrawer(); $("#lightbox").hidden = true; } });
  box.addEventListener("click", (e) => { if (e.target.closest(".search-hit")) close(); });
}

/* ---------------- 抽屉菜单 ---------------- */
function closeDrawer() { document.body.classList.remove("drawer-open"); }
function initDrawer() {
  $("#burgerBtn").innerHTML = ICONS.menu;
  $("#burgerBtn").onclick = () => document.body.classList.toggle("drawer-open");
  $("#drawerMask").onclick = closeDrawer;
  $("#drawer").addEventListener("click", (e) => { if (e.target.closest("a")) closeDrawer(); });
}

/* ---------------- 全局事件 ---------------- */
function initGlobal() {
  window.addEventListener("hashchange", router);
  window.addEventListener("scroll", () => {
    document.body.classList.toggle("scrolled", window.scrollY > 30);
    $("#backTop").classList.toggle("show", window.scrollY > 600);
  }, { passive: true });
  $("#backTop").onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  $("#themeBtn").onclick = toggleTheme;
  $("#lightbox").onclick = () => { $("#lightbox").hidden = true; };
  document.querySelectorAll('a[href^="#post-list"]').forEach(() => {});
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest('a[href="#post-list"]');
    if (anchor) { e.preventDefault(); $("#post-list")?.scrollIntoView({ behavior: "smooth" }); }
  });
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".post-content img, .md-h + p img");
    if (img && img.src) { $("#lightboxImg").src = img.src; $("#lightbox").hidden = false; }
  });
}

/* ---------------- 启动 ---------------- */
buildNav();
initTheme();
initDrawer();
initSearch();
initGlobal();
router();
