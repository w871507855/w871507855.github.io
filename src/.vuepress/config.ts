import { defineUserConfig } from "vuepress";
import { container } from "@mdit/plugin-container";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "李成成博客",
  description: "李成成博客",
  locales: {
    "/": {
      lang: "zh-CN"
    }
  },
  theme,
  pagePatterns: ["**/*.md", "!*.snippet.md", "!.vuepress", "!node_modules"],
  extendsMarkdown: (md) => {
    md.use(container, {
      name: "hint",
      openRender: (tokens, index, _options) => {
        const info = tokens[index].info.trim().slice(4).trim();
        let style = "background:#262626";

        if (info.indexOf("style") > -1) {
          style = info.split("style=")[1].split('"')[1];
        }

        const title = info.replace('style="' + style + '"', "") || "Hint";
        return `<div class="custom-container hint" style="${style}">\n<p class="custom-container-title">${title}</p>\n`;
      },
    });
  },

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
