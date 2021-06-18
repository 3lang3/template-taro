import store from '@/state/config/store';
import { set } from '@/state/navigation';
import { getMenuButtonBoundingClientRect, getSystemInfoSync } from '@tarojs/taro';

export function getCustomNavigationInfo() {
  // 获取系统信息
  const systemInfo = getSystemInfoSync();
  // 胶囊按钮位置信息
  const menuButtonInfo = getMenuButtonBoundingClientRect();
  const menuLeft = systemInfo.screenWidth - menuButtonInfo.right;
  const payload = {
    navBarHeight:
      (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 +
      menuButtonInfo.height +
      systemInfo.statusBarHeight,
    menuBotton: menuButtonInfo.top - systemInfo.statusBarHeight,
    menuRight: menuLeft + menuButtonInfo.width,
    menuHeight: menuButtonInfo.height,
    menuLeft,
  };
  store.dispatch(set(payload));
}
