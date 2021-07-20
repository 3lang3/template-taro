import { Provider } from 'react-redux';
import { showModal } from '@tarojs/taro';
import { Component } from 'react';
import store from '@/state/config/store';
import { silentLogin } from './utils/login';
import { getCustomNavigationInfo } from './components/CustomNavigation/helper';
import './style/taro.theme.scss';
import './style/global.less';

// const App = ({ children }) => {
//   useEffect(() => {
//     silentLogin();
//     getCustomNavigationInfo();
//   }, []);
//   return <Provider store={store}>{children}</Provider>;
// };

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
