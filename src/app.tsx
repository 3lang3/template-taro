import { Provider } from 'react-redux';
import { useEffect } from 'react';
import store from '@/state/config/store';
import { initCommonReducer } from '@/state/common';
import { silentLogin } from './utils/login';
import { getCustomNavigationInfo } from './components/CustomNavigation/helper';
import './style/taro.theme.scss';
import './style/global.less';

const App = ({ children }) => {
  useEffect(() => {
    silentLogin();
    getCustomNavigationInfo();
    store.dispatch(initCommonReducer() as any);
  }, []);
  return <Provider store={store}>{children}</Provider>;
};

export default App;
