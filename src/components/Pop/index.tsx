import { View } from '@tarojs/components';
import './index.less';

export type P = {
  children: React.ReactElement; // 是否显示
};

export default ({ children }: P) => {
  return (
    <View className="pop">
      <View className="pop-overlay" />
      <View className="pop-container">{children}</View>
    </View>
  );
};
