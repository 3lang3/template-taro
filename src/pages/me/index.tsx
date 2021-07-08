import { useSelector } from 'react-redux';
import { FullPageLoader } from '@/components/Chore';
import CustomTabBar from '@/components/CustomTabBar';
import MePage from './components/MePage';
import CompanyPage from './components/CompanyPage';

const PageContent = () => {
  const { loading, data } = useSelector((state) => state.common);

  if (loading) return <FullPageLoader />;
  // 不同身份视图不同
  // 机构身份渲染机构视图
  if (data.identity === 3) return <CompanyPage />;
  return <MePage />;
};

/**
 * @summary tab类页面不能阻塞底部导航条渲染, 页面内容请求和默认页面渲染分离
 */
export default () => {
  return (
    <>
      <PageContent />
      <CustomTabBar />
    </>
  );
};
