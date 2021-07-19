import { Provider } from 'react-redux';
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

//   // 对应 onShow
//   useDidShow(() => {
//     const r = getCurrentInstance();
//     console.log(r)
//   });

//   return <Provider store={store}>{children}</Provider>;
// };

class App extends Component<any, any> {
  // 可以使用所有的 React 生命周期方法
  componentDidMount() {
    silentLogin();
    getCustomNavigationInfo();
  }

  // 对应 onLaunch
  onLaunch(opts) {
    console.log(opts);
  }
  render() {
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    return (
      <Provider store={store}>
        {/* this.props.children 是将要被渲染的页面 */}
        {this.props.children}
      </Provider>
    );
  }
}

export default App;
