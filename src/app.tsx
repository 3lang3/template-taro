/* eslint-disable import/first */
import { Provider } from 'react-redux';
import { Component } from 'react';
import store from '@/state/config/store';
import { silentLogin } from './utils/login';
import { getCustomNavigationInfo } from './components/CustomNavigation/helper';
// taro-ui 组件样式
import 'taro-ui/dist/style/index.scss';
import './style/global.less';

class App extends Component<any, any> {
  componentDidMount() {
    silentLogin();
    getCustomNavigationInfo();
  }
  // 获取场景值
  onLaunch(opts) {
    console.log(opts.scence);
    // showModal({ title: '场景值', content: `value: ${opts.scence}` });
  }
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
