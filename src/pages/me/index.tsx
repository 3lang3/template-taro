import { useSelector } from 'react-redux';
import { FullPageLoader } from '@/components/Chore';
import CustomTabBar from '@/components/CustomTabBar';
import MePage from './components/MePage';
import CompanyPage from './components/CompanyPage';

const PageContentWithTabbar = () => {
  const { loading, data } = useSelector((state) => state.common);

  if (loading) return <FullPageLoader />;
  if (data.identity === 3) return <CompanyPage />;
  return <MePage />;
};

export default () => {
  return (
    <>
      <PageContentWithTabbar />
      <CustomTabBar />
    </>
  );
};
