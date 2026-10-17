/* ============================================================
 * 站点数据配置 —— 日常只需要改这个文件
 *  1. 改 SITE：站名、签名档、头像、横幅
 *  2. 发文章：推荐用「文章管理器」（博客地址/#/admin），或往 ARTICLES 最前面加一条
 *  3. 发说说 / 加友链 / 加相册：改对应的数组
 * ============================================================ */

const SITE = {
  name: "Sokach 的个人博客",
  motto: "把日子过成诗，把代码写成歌。",
  avatar: "assets/avatar.jpg",
  banner: "assets/banner.jpg",
  // 社交链接，不需要的删掉即可
  socials: [
    { name: "GitHub",  url: "https://github.com/",      icon: "github" },
    { name: "Bilibili",url: "https://www.bilibili.com/",icon: "bilibili" },
    { name: "邮箱",    url: "mailto:me@example.com",    icon: "mail" },
  ],
  beian: "", // 例如 "某ICP备00000000号"，留空则不显示
};

/* ---------------- 公开评论系统 ----------------
 * provider 三选一："giscus"（推荐，基于 GitHub，免费免服务器）
 *                | "waline"（匿名友好，需部署一个小后端）
 *                | "none"  （关闭公开评论，只保留本地留言板）
 *
 * 【Giscus】获取方式见 README「接入公开评论」：
 *   1. 新建一个公开仓库并开启 Discussions，安装 giscus App
 *   2. 打开 https://giscus.app/zh-CN 填入仓库名
 *   3. 把生成的 repo / repoId / category / categoryId 填到下面
 * 【Waline】部署好服务端后，把访问地址填入 serverURL
 */
const COMMENT = {
  provider: "giscus",
  giscus: {
    repo: "",          // 如 "sokach/blog-comments"
    repoId: "",        // giscus.app 生成，如 "R_kgDOxxxxxx"
    category: "Announcements",
    categoryId: "",    // giscus.app 生成，如 "DIC_kwDOxxxxxx"
    mapping: "url",    // 用 URL 区分不同页面，每篇文章独立评论串
    lang: "zh-CN",
  },
  waline: {
    serverURL: "",     // 如 "https://your-waline.vercel.app"
  },
};

/* ---------------- 文章管理器 ----------------
 * 打开 博客地址/#/admin（或页脚「管理」）即可在浏览器里写文章、改文章、删文章。
 * repo 填博客所在的 GitHub 仓库（用户名/仓库名）；发布还需要一个 GitHub Token，
 * 获取步骤见 README「文章管理器」。不配置也没关系：写完点「下载 data.js」手动上传。
 */
const ADMIN = {
  repo: "",        // 如 "sakach-creator/my-blog"
  branch: "main",  // 仓库分支，一般为 main
  path: "js/data.js",
};

/* ---------------- 文章 ----------------
 * slug     唯一英文短名（决定文章链接 #/article/xxx）
 * cover    封面图路径（assets/ 下的图片）
 * category 分类；tags 标签；excerpt 摘要（留空则自动截取正文）
 * content  正文，支持 Markdown 子集：# 标题、**加粗**、`行内代码`、
 *          ``` 代码块、> 引用、- 列表、1. 列表、[链接](url)、![图片](url)、--- 分割线
 */
const ARTICLES = [
// <<ARTICLES:AUTO>>
  {
    slug: "hello-world",
    title: "你好，世界：我的博客开张啦",
    date: "2026-10-17",
    category: "随笔",
    tags: ["博客","起点"],
    cover: "assets/album-2.png",
    excerpt: "酝酿了很久，终于把自己的小站搭起来了。这里会记录我的学习笔记、生活碎片和一些不成熟的想法。",
    content: `酝酿了很久，终于把自己的小站搭起来了。以后这里就是我在互联网上的一个小房间，记录学习笔记、生活碎片，以及一些不成熟的想法。

## 为什么要写博客

> 写下来的东西才真正属于自己。

- **梳理思路**：很多问题在脑子里是一团乱麻，写出来就清晰了一半
- **留下痕迹**：时间久了，翻翻旧文章会发现自己走过多少路
- **遇见同好**：互联网那么大，总会有人恰好需要你写下的那句话

## 这个站是怎么来的

前台是手写的 HTML / CSS / JavaScript，没有引入任何框架，部署在免费托管平台上，再绑上自己的域名就能访问了。整站的配置都集中在 \`js/data.js\` 一个文件里，写文章就像填空一样简单。

## 接下来想写什么

1. 学习过程中的踩坑记录
2. 好用工具和效率技巧
3. 偶尔的生活絮叨

如果你恰好路过，欢迎常来坐坐。`,
  },

  {
    slug: "night-music",
    title: "夜航船：最近在听的歌与在读的书",
    date: "2026-10-12",
    category: "生活",
    tags: ["音乐","阅读"],
    cover: "assets/album-4.png",
    excerpt: "雨天适合 Lofi 和旧书。分享最近单曲循环的几张专辑，和一本看到一半舍不得看完的小说。",
    content: `最近总是很晚才睡。窗外的雨声、耳机里的 Lofi，再加上一本看到一半的小说，构成了十月最舒服的夜晚。

## 最近在听

- **《日落大道》** —— 晚风感的吉他前奏，一秒把人拽到海边公路
- **City Pop 精选歌单** —— 八十年代的日本都市流行乐，日夜交替时听最妙
- **雨声白噪音** —— 写代码的时候循环，比任何歌都专注

## 最近在读

> 一本好书就像夜航船，慢，但一直在往前走。

正在读一本讲小岛书店的小说，看到一半有点舍不得看完。好书就是这样吧，既想知道结局，又害怕结束。

## 一点碎念

如果有什么好听的歌或者好看的书，欢迎来[留言板](#/message)推荐给我！`,
  },
// <<ARTICLES:AUTO:END>>
];

/* ---------------- 说说（一句话动态） ---------------- */
const SAYS = [
  { date: "2026-10-17", mood: "🎉", text: "博客正式开张！撒花～以后就在这里安家了。" },
  { date: "2026-10-15", mood: "🌧️", text: "下雨天和 Lofi 真的是绝配，效率意外地高。" },
  { date: "2026-10-10", mood: "🌙", text: "熬夜调试完最后一个样式，看着页面一点点变成想要的样子，值了。" },
  { date: "2026-10-01", mood: "🌅", text: "假期第一天，去看了一场很棒的日出。新的一月，也要加油呀。" },
];

/* ---------------- 友链 ---------------- */
const FRIENDS = [
  { name: "Sokach",     url: "https://sokach.dpdns.org", desc: "我的小站 · 欢迎来逛逛", avatar: "" },
];

/* ---------------- 相册 ---------------- */
const ALBUMS = [
  { src: "assets/album-1.png", title: "星空下露营",   date: "2026-10" },
  { src: "assets/album-2.png", title: "春日的街道",   date: "2026-04" },
  { src: "assets/album-3.png", title: "黄昏的海边铁道", date: "2026-08" },
  { src: "assets/album-4.png", title: "雨夜霓虹",     date: "2026-06" },
];
