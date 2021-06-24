export default {
  pages: [
    // 首页
    'pages/index/index',
    // 曲库
    'pages/lib/index',
    // 我的
    'pages/me/index',
    // 播放详情页
    'pages/play-detail/index',
    // 入驻申请
    'pages/settlein/index',
    // 入驻申请第二步
    'pages/settlein/next',
    // 机构页
    'pages/company/index',
    // 机构 已购词曲
    'pages/company-bought/index',
    // 专辑
    'pages/album/index',
    // 专辑详情
    'pages/album-detail/index',
    // 动态详情
    'pages/news-detail/index',
    // 热门歌曲榜
    'pages/hot-board/index',
    // 个人资料
    'pages/profile/index',
    // 更换手机号
    'pages/profile/mobile',
    // 更换邮箱
    'pages/profile/email',
    // 出售词曲
    'pages/sell/index',
    // 出售词曲第二步
    'pages/sell/next',
    // 消息通知
    'pages/message/index',
    // 消息通知详情
    'pages/message/detail',
  ],
  tabBar: {
    custom: true,
    list: [
      {
        iconPath: 'assets/tab/tab_1.png',
        selectedIconPath: 'assets/tab/tab_1_ac.png',
        pagePath: 'pages/index/index',
        text: '最新',
      },
      {
        iconPath: 'assets/tab/tab_2.png',
        selectedIconPath: 'assets/tab/tab_2_ac.png',
        pagePath: 'pages/lib/index',
        text: '曲库',
      },
      {
        iconPath: 'assets/tab/tab_3.png',
        selectedIconPath: 'assets/tab/tab_3_ac.png',
        pagePath: 'pages/me/index',
        text: '我的',
      },
    ],
    color: '#000',
    selectedColor: '#6236FF',
    backgroundColor: '#fff',
    borderStyle: 'white',
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
};
