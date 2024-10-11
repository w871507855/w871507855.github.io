import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "李成成博客",
  description: "李成成博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
