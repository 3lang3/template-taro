import { Provider } from 'react-redux';
import { useEffect } from 'react';
import store from '@/state/config/store';
import { silentLogin } from './utils/login';
import { getCustomNavigationInfo } from './components/CustomNavigation/helper';
import './style/taro.theme.scss';
import './style/global.less';

const App = ({ children }) => {
  useEffect(() => {
    silentLogin();
    getCustomNavigationInfo();
  }, []);
  return <Provider store={store}>{children}</Provider>;
};

export default App;
