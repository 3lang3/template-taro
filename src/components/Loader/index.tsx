import { AtActivityIndicator } from 'taro-ui';
import Flex from '../Flex';

export const PageLoader = () => {
  return (
    <Flex justify="center" style={{ width: '100%', height: '100vh' }}>
      <AtActivityIndicator />
    </Flex>
  );
};
