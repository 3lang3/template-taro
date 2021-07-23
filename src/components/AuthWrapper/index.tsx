import { navigateBack, switchTab } from '@tarojs/taro';
import { useSelector } from 'react-redux';
import Button from '../Button';
import { FullPageError, FullPageLoader } from '../Chore';
import Flex from '../Flex';
import Icon from '../Icon';
import Typography from '../Typography';
import './index.less';

// 登录引导ui
function UnauthorizedView() {
  return (
    <Flex className="unauthorized" direction="column" justify="center">
      <Icon className="unauthorized__icon" icon="icon-logo" />
      <Typography.Text className="mb50">抱歉，此页面需要登录后才能查看</Typography.Text>
      <Button className="mb30" type="primary" onClick={() => switchTab({ url: '/pages/me/index' })}>
        去登录
      </Button>
      <Typography.Text type="secondary" onClick={() => navigateBack()}>
        返回
      </Typography.Text>
    </Flex>
  );
}

/**
 * 登录校验Wrapper组件
 * 当页面需要登录才能浏览时适用
 * @example "/pages/play-detail/index"
 */
export default function AuthWrapper({ children }) {
  const { loading, error, data } = useSelector((state) => state.common);
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError />;
  if (!data.ids) return <UnauthorizedView />;
  return children;
}
