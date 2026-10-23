import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://lichengcheng.top",

  author: {
    name: "lcc",
    url: "https://lichengcheng.top",
  },

  iconAssets: "fontawesome-with-brands",

  logo: "/logo-lcc.svg",
  navbarTitle: "lcc 的运维笔记",

  repo: "w871507855/w871507855.github.io",
  docsDir: "src",
  docsBranch: "main",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 侧边栏内条目排序：README 优先，其次按手动 order，再按时间倒序
  sidebarSorter: ["readme", "order", "date-desc", "filename"],

  // 页脚
  displayFooter: true,

  // 博客相关
  blog: {
    name: "lcc",
    avatar: "/logo-lcc.svg",
    description: "一个运维的日常笔记",
    intro: "/intro.html",
    articlePerPage: 10,
    articleInfo: ["Author", "Date", "Category", "Tag", "ReadingTime"],
    medias: {
      BiliBili: "https://space.bilibili.com/13379189?spm_id_from=333.1007.0.0",
      Email: "mailto:871507855@qq.com",
      Gitee: "https://gitee.com/ahlcc",
      GitHub: "https://github.com/w871507855",
      VuePressThemeHope: {
        icon: "https://theme-hope-assets.vuejs.press/logo.svg",
        link: "https://theme-hope.vuejs.press",
      },
    },
  },

  // 文章页面信息
  pageInfo: ["Author", "Date", "Category", "Tag", "ReadingTime", "Word"],

  // 外观
  darkmode: "switch",
  themeColor: false,
  fullscreen: true,
  print: true,
  pure: false,

  locales: {
    "/": {
      footer:
        '<span>lcc 的运维笔记</span> · <a href="/intro.html">关于我</a> · <a href="/category/">分类</a> · <a href="/timeline/">时间轴</a>',
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,

    // 代码块一键复制
    copyCode: {
      showInMobile: true,
    },

    // 回到顶部
    backToTop: true,

    // 图片预览
    photoSwipe: true,

    // 阅读时间
    readingTime: true,

    // 从 git 提交记录读取最后更新时间
    git: true,

    // 站点地图
    sitemap: true,

    // 启用之前需安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务，在生产环境中请自行部署并使用自己的服务！
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://waline-comment.vuejs.press",
    // },

    components: {
      components: ["Badge", "VPCard"],
    },

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    markdownImage: {
      figure: true,
      lazyload: true,
      size: true,
    },

    // markdownMath: {
    //   // 启用前安装 katex
    //   type: "katex",
    //   // 或者安装 mathjax-full
    //   type: "mathjax",
    // },

    // 此功能被开启用于演示，你应仅当使用时保留。
    markdownTab: true,

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    mdEnhance: {
      align: true,
      attrs: true,
      component: true,
      demo: true,
      include: true,
      mark: true,
      plantuml: true,
      spoiler: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tasklist: true,
      vPre: true,
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },
  },
});
