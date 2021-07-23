import { useSelector } from 'react-redux';
import { FullPageLoader } from '@/components/Chore';
import { IDENTITY } from '@/config/constant';
import { TabNavigationBar } from '@/components/CustomNavigation';
import CustomTabBar from '@/components/CustomTabBar';
import MePage from './components/MePage';
import CompanyPage from './components/CompanyPage';

const PageContent = () => {
  const { loading, data, token } = useSelector((state) => state.common);
  // 登录中...
  if (token && loading) return <FullPageLoader />;
  // 不同身份视图不同
  // 机构身份渲染机构视图
  if (data.identity === IDENTITY.COMPANY) return <CompanyPage />;
  return <MePage />;
};

/**
 * @summary tab类页面不能阻塞底部导航条渲染, 页面内容请求和默认页面渲染分离
 */
export default () => {
  return (
    <>
      <TabNavigationBar mode="light" fixedHeight />
      <PageContent />
      <CustomTabBar />
    </>
  );
};
