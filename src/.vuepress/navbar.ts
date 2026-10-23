import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "首页", link: "/", icon: "fa-solid fa-house" },
  { text: "Linux", link: "/linux/", icon: "fa-brands fa-linux" },
  { text: "Python", link: "/python/", icon: "fa-brands fa-python" },
  { text: "Windows", link: "/windows/", icon: "fa-brands fa-windows" },
  { text: "NAS", link: "/nas/", icon: "fa-solid fa-hard-drive" },
  { text: "Godot", link: "/godot/", icon: "fa-solid fa-gamepad" },
  {
    text: "更多",
    icon: "fa-solid fa-layer-group",
    children: [
      { text: "分类", link: "/category/", icon: "fa-solid fa-folder-tree" },
      { text: "标签", link: "/tag/", icon: "fa-solid fa-tags" },
      { text: "时间轴", link: "/timeline/", icon: "fa-solid fa-bars-staggered" },
      { text: "Golang", link: "/golang/", icon: "fa-solid fa-code" },
      { text: "关于我", link: "/intro.html", icon: "fa-solid fa-circle-info" },
    ],
  },
]);
