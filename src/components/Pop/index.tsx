import { View } from '@tarojs/components';
import Flex from '../Flex';
import './index.less';

export type P = {
  children: React.ReactElement; // 是否显示
};

export default ({ children }: P) => {
  return (
    <View className="pop">
      <View className="pop-overlay" />
      <Flex direction="column" justify="center" className="pop-container">
        {children}
      </Flex>
    </View>
  );
};
