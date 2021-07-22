/* eslint-disable import/first */
import { Provider } from 'react-redux';
import { Component } from 'react';
import Taro, { getStorageSync } from '@tarojs/taro';
import store from '@/state/config/store';
import { silentLogin } from './utils/login';
import { getCustomNavigationInfo } from './components/CustomNavigation/helper';
import { setIsReadAll } from '@/state/message';
import config from './config';
/**
 * taro-ui 组件依赖的样式文件
 * @summary 全局导入和按需导入打包后体积相差100+kb
 */
import 'taro-ui/dist/style/index.scss';
import './style/global.less';

class App extends Component<any, any> {
  componentDidMount() {
    silentLogin();
    getCustomNavigationInfo();
    // 只有登录时获取消息未读状态
    if (getStorageSync(config.storage.tokenKey)) {
      store.dispatch(setIsReadAll() as any);
    }

    // 处理富文本html img标签
    (Taro as any).options.html.transformElement = (el) => {
      if (el.nodeName === 'image') {
        el.setAttribute('mode', 'widthFix');
      }
      return el;
    };
  }
  // 获取场景值
  onLaunch(opts) {
    console.log(`launch scence: ${opts.scence}`);
  }
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
