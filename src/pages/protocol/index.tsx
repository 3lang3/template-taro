import { View, Text, Button } from '@tarojs/components';
import Flex from '@/components/Flex';
import { navigateBack } from '@tarojs/taro';
import './index.less';

export default () => {
  return (
    <Flex className="protocol" justify="center" wrap="wrap">
      <View className="content">
        <Text className="title">协议内容</Text>
        <Text>1.协议，网络协议的简称，网络协议是通信</Text>
      </View>
      <Button onClick={() => navigateBack()}>知道了</Button>
    </Flex>
  );
};
