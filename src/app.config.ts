export default {
  pages: ["pages/index/index", "pages/lib/index", "pages/me/index"],
  tabBar: {
    custom: true,
    list: [
      {
        iconPath: "assets/tab/tab_1.png",
        selectedIconPath: "assets/tab/tab_1_ac.png",
        pagePath: "pages/index/index",
        text: "最新",
      },
      {
        iconPath: "assets/tab/tab_2.png",
        selectedIconPath: "assets/tab/tab_2_ac.png",
        pagePath: "pages/lib/index",
        text: "曲库",
      },
      {
        iconPath: "assets/tab/tab_3.png",
        selectedIconPath: "assets/tab/tab_3_ac.png",
        pagePath: "pages/me/index",
        text: "我的",
      },
    ],
    color: "#000",
    selectedColor: "#6236FF",
    backgroundColor: "#fff",
    borderStyle: "white",
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
};
