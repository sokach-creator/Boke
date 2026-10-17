/* ============================================================
 * Sokach Blog · 文章管理器（#/admin，仅站长使用）
 * 在浏览器里新建 / 编辑 / 删除文章：
 *   - 配好「仓库名 + Token」后，点「发布更改」一键提交到 GitHub，
 *     约 1~2 分钟后 GitHub Pages 自动上线；
 *   - 也可以随时「下载 data.js」手动上传（零配置兜底方案）。
 * 所有文章最终都保存在 js/data.js，本文件只负责编辑与提交。
 * ============================================================ */
"use strict";
(function () {

/* ---------------- 常量与状态 ---------------- */
const MARK_BEGIN = "// <<ARTICLES:AUTO>>";
const MARK_END   = "// <<ARTICLES:AUTO:END>>";
const LS_KEY     = "sokach-admin";
const KNOWN_KEYS = ["slug", "title", "date", "category", "tags", "cover", "excerpt", "content"];

let meta = { repo: "", branch: "main", path: "js/data.js" };
let posts = [];          // 文章工作副本（未发布的改动也先存在这里）
let sourceText = "";     // 最近一次拿到的 data.js 原文
let sourceMode = "";     // "api"（GitHub 最新）| "fetch"（可能有缓存）| "memory"（仅浏览）
let loaded = false;
let dirty = false;       // 有未发布的改动
let sessionToken = "";   // Token；不勾选“记住”时只存在内存里

try {
  if (typeof ADMIN !== "undefined" && ADMIN) meta = Object.assign({}, meta, ADMIN);
} catch (e) {}
try {
  const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
  if (saved) {
    if (saved.repo)   meta.repo   = saved.repo;
    if (saved.branch) meta.branch = saved.branch;
    if (saved.path)   meta.path   = saved.path;
    if (saved.token)  sessionToken = saved.token;
  }
} catch (e) {}

/* ============ 纯函数核心（不碰 DOM，可独立测试） ============ */

/* content 写回 data.js 时用 JS 模板字符串：转义反斜杠、反引号、${，正文保持多行可读 */
function tplLiteral(text) {
  return "`" + String(text == null ? "" : text)
    .replace(/\r\n/g, "\n")
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${") + "`";
}

/* 把文章数组生成为标记区之间的源码（一篇文章 = 一个 { ... }, 块） */
function buildArticlesBlock(list) {
  return (list || []).map((a) => {
    const lines = [
      "  {",
      "    slug: "     + JSON.stringify(a.slug) + ",",
      "    title: "    + JSON.stringify(a.title) + ",",
      "    date: "     + JSON.stringify(a.date) + ",",
      "    category: " + JSON.stringify(a.category || "") + ",",
      "    tags: "     + JSON.stringify(a.tags || []) + ",",
      "    cover: "    + JSON.stringify(a.cover || "") + ",",
      "    excerpt: "  + JSON.stringify(a.excerpt || "") + ",",
      "    content: "  + tplLiteral(a.content) + ",",
    ];
    Object.keys(a).forEach((k) => {
      if (!KNOWN_KEYS.includes(k)) lines.push("    " + JSON.stringify(k) + ": " + JSON.stringify(a[k]) + ",");
    });
    lines.push("  },");
    return lines.join("\n");
  }).join("\n\n");
}

/* 用生成块替换 data.js 原文里标记区之间的内容（SITE / COMMENT 等其余部分原样保留） */
function spliceArticles(src, list) {
  const bi = src.indexOf(MARK_BEGIN), ei = src.indexOf(MARK_END);
  if (bi < 0 || ei < 0 || ei < bi) {
    throw new Error("data.js 缺少自动生成标记（<<ARTICLES:AUTO>>）。请先把最新版 data.js 上传到仓库，再使用发布功能。");
  }
  return src.slice(0, bi) + MARK_BEGIN + "\n" + buildArticlesBlock(list) + "\n" + src.slice(ei);
}

/* 把 data.js 源码解析成对象（借浏览器原生 JS 引擎，100% 可靠） */
function parseSource(src) {
  const fn = new Function(src + "\n;return { ARTICLES: typeof ARTICLES === 'undefined' ? [] : ARTICLES, ADMIN: typeof ADMIN === 'undefined' ? {} : ADMIN };");
  return fn();
}

/* UTF-8 安全的 base64 编解码（GitHub API 要求） */
function b64encode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
function b64decode(b64) {
  const bin = atob(String(b64).replace(/\s/g, ""));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/* ---------------- GitHub Contents API ---------------- */
function ghPath() {
  return meta.path.split("/").map(encodeURIComponent).join("/");
}
async function ghGetFile(token) {
  const url = "https://api.github.com/repos/" + meta.repo + "/contents/" + ghPath() + "?ref=" + encodeURIComponent(meta.branch || "main");
  const r = await fetch(url, { headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" } });
  if (!r.ok) {
    if (r.status === 404) throw new Error("没找到文件（404）：请检查仓库名、分支、路径是否正确");
    if (r.status === 401) throw new Error("Token 无效或已过期（401），请重新生成");
    throw new Error("读取仓库失败（HTTP " + r.status + "）");
  }
  return r.json();
}
async function ghPutFile(token, sha, text, message) {
  const url = "https://api.github.com/repos/" + meta.repo + "/contents/" + ghPath();
  const r = await fetch(url, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: b64encode(text), sha, branch: meta.branch || "main" }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (r.status === 401) throw new Error("Token 无效或已过期（401）");
    if (r.status === 409) throw new Error("仓库文件刚在别处被修改过（409）：请点「重新加载」后再发布");
    if (r.status === 422) throw new Error("提交被拒绝（422）：请检查分支名是否正确");
    throw new Error("发布失败（HTTP " + r.status + "）" + (data && data.message ? "：" + data.message : ""));
  }
  return data;
}

/* ---------------- 小工具 ---------------- */
const $app = document.getElementById("app");
const $ = (s) => document.querySelector(s);
const esc = (s) => (typeof escapeHtml === "function" ? escapeHtml(String(s == null ? "" : s)) : String(s == null ? "" : s));

let toastTimer = null;
function toast(msg, ms) {
  let t = document.querySelector(".admin-toast");
  if (!t) { t = document.createElement("div"); t.className = "admin-toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), ms || 3200);
}

function today() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function suggestSlug() {
  return "post-" + today().replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 6);
}
function existingCovers() {
  const set = new Set();
  posts.forEach((a) => { if (a.cover) set.add(a.cover); });
  try { (typeof ALBUMS !== "undefined" ? ALBUMS : []).forEach((p) => p.src && set.add(p.src)); } catch (e) {}
  return Array.from(set);
}
function existingCats() {
  return Array.from(new Set(posts.map((a) => a.category).filter(Boolean)));
}
function download(name, text, mime) {
  const blob = new Blob([text], { type: (mime || "text/plain") + ";charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

/* ---------------- 数据加载 ---------------- */
async function ensureLoaded(force) {
  if (loaded && !force) return;
  loaded = false;
  if (sessionToken && meta.repo) {
    try {
      const json = await ghGetFile(sessionToken);
      sourceText = b64decode(json.content);
      sourceMode = "api";
      posts = parseSource(sourceText).ARTICLES;
      loaded = true; dirty = false;
      return;
    } catch (e) {
      toast("GitHub 读取失败：" + e.message, 5000);
    }
  }
  try {
    const r = await fetch("js/data.js?t=" + Date.now(), { cache: "no-store" });
    if (r.ok) {
      sourceText = await r.text();
      sourceMode = "fetch";
      posts = parseSource(sourceText).ARTICLES;
      loaded = true; dirty = false;
      return;
    }
  } catch (e) {}
  /* 兜底：直接用页面已加载的内存数据（此时无法发布 / 下载源码） */
  posts = JSON.parse(JSON.stringify(typeof ARTICLES !== "undefined" ? ARTICLES : []));
  sourceText = ""; sourceMode = "memory"; loaded = true; dirty = false;
}

/* ---------------- 发布 / 下载 ---------------- */
async function publishAll(skipConfirm) {
  if (!meta.repo) { toast("请先在「发布设置」里填写仓库名", 4000); return; }
  if (!sessionToken) { toast("请先在「发布设置」里粘贴 GitHub Token", 4000); return; }
  if (!skipConfirm && !confirm("把当前文章列表（" + posts.length + " 篇）发布到 GitHub？")) return;
  const btn = $("#admPublish");
  const label = btn ? btn.textContent : "";
  if (btn) { btn.disabled = true; btn.textContent = "发布中…"; }
  try {
    const json = await ghGetFile(sessionToken);           // 永远基于仓库里的最新文件改，避免覆盖别人/别处的修改
    const fresh = b64decode(json.content);
    const newSrc = spliceArticles(fresh, posts);
    await ghPutFile(sessionToken, json.sha, newSrc, "文章管理器：更新文章列表（共 " + posts.length + " 篇）");
    dirty = false; sourceText = newSrc; sourceMode = "api";
    toast("✅ 已发布！1~2 分钟后自动上线（GitHub Pages 部署中）", 5000);
    renderList();
  } catch (e) {
    toast("❌ " + (e.message || e), 5000);
    if (btn) { btn.disabled = false; btn.textContent = label; }
  }
}

function downloadDataJs() {
  if (!sourceText) { toast("当前拿不到 data.js 原文（直接双击打开 HTML 时受限），请通过线上网站或本地服务器使用", 5000); return; }
  try {
    download("data.js", spliceArticles(sourceText, posts), "text/javascript");
    toast("已下载 data.js：上传到仓库 js/ 文件夹覆盖原文件即可上线");
  } catch (e) { toast("❌ " + (e.message || e), 5000); }
}

function downloadBackup() {
  download("articles-backup-" + today().replace(/-/g, "") + ".json", JSON.stringify(posts, null, 2), "application/json");
  toast("已导出 JSON 备份（" + posts.length + " 篇）");
}

/* ---------------- 列表页 ---------------- */
function renderList() {
  const chip = sourceMode === "api"
    ? '<span class="admin-chip ok">已连接 GitHub · 数据最新</span>'
    : sourceMode === "fetch"
      ? '<span class="admin-chip">本地缓存数据 · 配置 Token 后以仓库为准</span>'
      : '<span class="admin-chip warn">内存数据 · 无法发布，请通过线上网站使用</span>';
  const needCfg = !meta.repo || !sessionToken;
  $app.innerHTML = `
  <div class="admin-wrap">
    <div class="admin-head">
      <h1>文章管理器</h1>
      <p>共 ${posts.length} 篇 · 所有改动需点「发布更改」才会上线${dirty ? '<span class="admin-dot" title="有未发布的改动"></span>' : ""}</p>
      ${chip}
    </div>

    <div class="admin-toolbar">
      <button class="admin-btn primary" id="admNew">＋ 写新文章</button>
      <button class="admin-btn" id="admPublish">发布更改${dirty ? " ●" : ""}</button>
      <button class="admin-btn" id="admDownload">下载 data.js</button>
      <button class="admin-btn" id="admBackup">导出 JSON 备份</button>
      <button class="admin-btn ghost" id="admReload">重新加载</button>
    </div>

    <details class="admin-settings"${needCfg ? " open" : ""}>
      <summary>⚙️ 发布设置（仓库名 + Token，只保存在你自己的浏览器里）</summary>
      <div class="admin-settings-body">
        <div class="admin-grid3">
          <label>GitHub 仓库<input id="admRepo" value="${esc(meta.repo)}" placeholder="用户名/仓库名，如 sakach-creator/my-blog"></label>
          <label>分支<input id="admBranch" value="${esc(meta.branch)}" placeholder="main"></label>
          <label>文件路径<input id="admPath" value="${esc(meta.path)}" placeholder="js/data.js"></label>
        </div>
        <label>GitHub Token（细粒度：只勾选博客仓库 + Contents 读写；获取步骤见 README）<input id="admToken" type="password" autocomplete="off" placeholder="${sessionToken ? "已保存，可粘贴新 Token 覆盖" : "github_pat_ 开头，粘贴到这里"}" value=""></label>
        <label class="admin-ck"><input type="checkbox" id="admRemember"> 在这台电脑上记住（明文存于浏览器，公用电脑勿勾）</label>
        <div><button class="admin-btn" id="admSaveCfg">保存设置</button></div>
      </div>
    </details>

    <div class="admin-list">
      ${posts.map((a, i) => `
        <div class="admin-item">
          <div class="admin-item-main">
            <b>${esc(a.title)}</b>
            <span>${esc(a.date || "")} · ${esc(a.category || "未分类")}${a.tags && a.tags.length ? " · " + a.tags.map(esc).join(" / ") : ""} · #/article/${esc(a.slug)}</span>
          </div>
          <div class="admin-item-act">
            <button class="admin-btn sm" data-edit="${i}">编辑</button>
            <button class="admin-btn sm danger" data-del="${i}">删除</button>
          </div>
        </div>`).join("") || '<div class="admin-empty">还没有文章，点上面「写新文章」开始吧</div>'}
    </div>

    <p class="admin-note">说明：① 新建的文章排在最前，编辑 / 删除 / 新建都先作用于本页列表，点「发布更改」才真正写入 GitHub；② 想放弃未发布的改动，点「重新加载」；③ 图片请先传到仓库 assets/ 文件夹，正文里写 ![说明](assets/文件名)。</p>
  </div>`;

  $("#admNew").onclick = () => renderEditor(null);
  $("#admPublish").onclick = () => publishAll(false);
  $("#admDownload").onclick = downloadDataJs;
  $("#admBackup").onclick = downloadBackup;
  $("#admReload").onclick = async () => {
    if (dirty && !confirm("放弃未发布的修改并重新加载？")) return;
    await ensureLoaded(true);
    renderList();
  };
  $("#admSaveCfg").onclick = () => {
    meta.repo = $("#admRepo").value.trim();
    meta.branch = $("#admBranch").value.trim() || "main";
    meta.path = $("#admPath").value.trim() || "js/data.js";
    const tk = $("#admToken").value.trim();
    if (tk) sessionToken = tk;
    const remember = $("#admRemember").checked;
    try {
      if (remember) localStorage.setItem(LS_KEY, JSON.stringify({ repo: meta.repo, branch: meta.branch, path: meta.path, token: sessionToken }));
      else localStorage.setItem(LS_KEY, JSON.stringify({ repo: meta.repo, branch: meta.branch, path: meta.path, token: "" }));
    } catch (e) {}
    toast("设置已保存" + (meta.repo && sessionToken ? "，正在连接 GitHub…" : ""));
    if (meta.repo && sessionToken) ensureLoaded(true).then(renderList);
  };
  $app.querySelectorAll("[data-edit]").forEach((b) => { b.onclick = () => renderEditor(parseInt(b.dataset.edit, 10)); });
  $app.querySelectorAll("[data-del]").forEach((b) => {
    b.onclick = () => {
      const i = parseInt(b.dataset.del, 10);
      if (!confirm("确定删除《" + posts[i].title + "》？（点「发布更改」后线上才会移除）")) return;
      posts.splice(i, 1);
      dirty = true;
      renderList();
      toast("已从列表移除，点「发布更改」生效");
    };
  });
}

/* ---------------- 编辑页 ---------------- */
function renderEditor(idx) {
  const isNew = idx == null;
  const cur = isNew ? -1 : idx;
  const a = isNew
    ? { slug: suggestSlug(), title: "", date: today(), category: "", tags: [], cover: "", excerpt: "", content: "" }
    : JSON.parse(JSON.stringify(posts[idx]));
  const covers = existingCovers(), cats = existingCats();
  $app.innerHTML = `
  <div class="admin-wrap">
    <div class="admin-head">
      <h1>${isNew ? "写新文章" : "编辑文章"}</h1>
      <p><a href="#" id="admBack">← 返回列表</a> · 改动先保存在本页内存里，点「发布更改」才会上线</p>
    </div>
    <div class="admin-form">
      <div class="admin-grid2">
        <label>标题 *<input id="edTitle" value="${esc(a.title)}" placeholder="文章标题"></label>
        <label>链接短名 slug *<input id="edSlug" value="${esc(a.slug)}" placeholder="英文/数字/中划线，如 my-first-post"></label>
      </div>
      <div class="admin-grid3">
        <label>日期<input id="edDate" type="date" value="${esc(a.date)}"></label>
        <label>分类<input id="edCat" list="catList" value="${esc(a.category)}" placeholder="如 随笔"><datalist id="catList">${cats.map((c) => `<option value="${esc(c)}">`).join("")}</datalist></label>
        <label>标签（逗号分隔）<input id="edTags" value="${esc((a.tags || []).join(", "))}" placeholder="标签1, 标签2"></label>
      </div>
      <label>封面图路径<input id="edCover" list="coverList" value="${esc(a.cover)}" placeholder="assets/xxx.jpg 或图片链接，可留空"><datalist id="coverList">${covers.map((c) => `<option value="${esc(c)}">`).join("")}</datalist></label>
      <label>摘要（留空则自动截取正文）<input id="edExcerpt" value="${esc(a.excerpt)}" placeholder="一句话摘要"></label>
      <label>正文 *（Markdown：## 标题、**加粗**、> 引用、- 列表、![图](assets/xx.jpg)、\`\`\` 代码块）<textarea id="edContent" placeholder="在这里写正文…">${esc(a.content)}</textarea></label>
    </div>
    <div class="admin-preview-card">
      <b>实时预览</b>
      <div class="post-content admin-preview" id="edPreview"></div>
    </div>
    <div class="admin-toolbar">
      <button class="admin-btn primary" id="edSave">保存到列表</button>
      <button class="admin-btn" id="edSavePub">保存并发布</button>
      <button class="admin-btn ghost" id="admCancel">取消</button>
    </div>
  </div>`;

  let pvTimer = null;
  const updPreview = () => {
    try {
      $("#edPreview").innerHTML = renderMarkdown($("#edContent").value || "*（暂无正文）*");
    } catch (e) { $("#edPreview").textContent = $("#edContent").value; }
  };
  updPreview();
  $("#edContent").addEventListener("input", () => { clearTimeout(pvTimer); pvTimer = setTimeout(updPreview, 250); });

  function collect() {
    const t = $("#edTitle").value.trim();
    const c = $("#edContent").value;
    const slug = $("#edSlug").value.trim();
    if (!t) { toast("标题不能为空"); return null; }
    if (!c.trim()) { toast("正文不能为空"); return null; }
    if (!/^[A-Za-z0-9_-]+$/.test(slug)) { toast("slug 只能用英文、数字、中划线（决定文章链接）"); return null; }
    if (posts.findIndex((x, i) => x.slug === slug && i !== cur) >= 0) { toast("slug 与其他文章重复了：" + slug); return null; }
    return {
      slug, title: t,
      date: $("#edDate").value || today(),
      category: $("#edCat").value.trim(),
      tags: $("#edTags").value.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
      cover: $("#edCover").value.trim(),
      excerpt: $("#edExcerpt").value.trim(),
      content: c,
    };
  }

  $("#admBack").onclick = (e) => { e.preventDefault(); renderList(); };
  $("#admCancel").onclick = () => renderList();
  $("#edSave").onclick = () => {
    const art = collect();
    if (!art) return;
    if (isNew) posts.unshift(art); else posts[idx] = art;
    dirty = true;
    toast("已保存到列表，记得点「发布更改」上线");
    renderList();
  };
  $("#edSavePub").onclick = () => {
    const art = collect();
    if (!art) return;
    if (isNew) posts.unshift(art); else posts[idx] = art;
    dirty = true;
    publishAll(true);
  };
}

/* ---------------- 入口（app.js 路由钩子调用） ---------------- */
window.ADMIN_VIEW = function (param) {
  $app.innerHTML = '<div class="admin-loading">正在加载文章数据…</div>';
  ensureLoaded().then(() => {
    if (param === "new") renderEditor(null);
    else if (param && /^\d+$/.test(param)) renderEditor(parseInt(param, 10));
    else renderList();
  }).catch((e) => {
    $app.innerHTML = '<div class="admin-wrap"><p class="admin-note">加载失败：' + esc(e.message || e) + "</p></div>";
  });
};

/* 暴露纯函数核心，供自动化测试使用（不影响正常功能） */
window.__ADMIN_CORE__ = { tplLiteral, buildArticlesBlock, spliceArticles, parseSource, b64encode, b64decode };

})();
