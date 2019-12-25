const menuList = [
  {
    title: "首页",
    key: "/home",
    icon: "home",
    isPublic: true
  },
  {
    title: "商品",
    key: "/mainproduct",
    icon: "home",
    children: [
      { title: "品类管理", key: "/category", icon: "bars" },
      { title: "商品管理", key: "/product", icon: "tool" }
    ]
  },
  {
    title: "用户管理",
    key: "/user",
    icon: "home"
  },
  {
    title: "角色管理",
    key: "/role",
    icon: "home"
  },
  {
    title: "图形图表",
    key: "/charts",
    icon: "home",
    children: [
      { title: "柱形图", key: "/charts/bar", icon: "bars" },
      { title: "折线图", key: "/charts/line", icon: "tool" },
      { title: "饼图", key: "/charts/pie", icon: "tool" }
    ]
  }
];
export default menuList;
