import { View } from '@tarojs/components';
import { ViewProps } from '@tarojs/components/types/View';
import Flex from '../Flex';
import './index.less';

export type P = {
  children: React.ReactElement;
  overlayProps?: ViewProps;
  style?: React.CSSProperties;
};

export default ({ children, overlayProps, style }: P) => {
  return (
    <View className="pop" style={style}>
      <View className="pop-overlay" {...overlayProps} />
      <Flex direction="column" justify="center" className="pop-container">
        {children}
      </Flex>
    </View>
  );
};
