/* eslint-disable import/first */
import { Provider } from 'react-redux';
import { Component } from 'react';
import store from '@/state/config/store';
import { silentLogin } from './utils/login';
import { getCustomNavigationInfo } from './components/CustomNavigation/helper';

/**
 * taro-ui 组件依赖的样式文件
 * @summary 全局导入和按需导入打包后体积相差100+kb
 */
import 'taro-ui/dist/style/index.scss';
// import 'taro-ui/dist/style/components/button.scss';
// import 'taro-ui/dist/style/components/activity-indicator.scss';
// import 'taro-ui/dist/style/components/loading.scss';
// import 'taro-ui/dist/style/components/modal.scss';
// import 'taro-ui/dist/style/components/list.scss';
// import 'taro-ui/dist/style/components/icon.scss';
// import 'taro-ui/dist/style/components/checkbox.scss';
// import 'taro-ui/dist/style/components/form.scss';
// import 'taro-ui/dist/style/components/input.scss';

import './style/global.less';

class App extends Component<any, any> {
  componentDidMount() {
    silentLogin();
    getCustomNavigationInfo();
  }
  // 获取场景值
  onLaunch(opts) {
    console.log(`launch scence: ${opts.scence}`);
    // showModal({ title: '场景值', content: `value: ${opts.scence}` });
  }
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
