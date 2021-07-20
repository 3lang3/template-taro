import { View } from '@tarojs/components';
import { ViewProps } from '@tarojs/components/types/View';
import Flex from '../Flex';
import './index.less';

export type P = {
  children: React.ReactElement;
  overlayProps?: ViewProps;
};

export default ({ children, overlayProps }: P) => {
  return (
    <View className="pop">
      <View className="pop-overlay" {...overlayProps} />
      <Flex direction="column" justify="center" className="pop-container">
        {children}
      </Flex>
    </View>
  );
};
