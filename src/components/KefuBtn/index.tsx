import { View, Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import Icon from '../Icon';
import Flex from '../Flex';
import './index.less';

export default () => {
  return (
    <>
      <View className="container-visible" />
      <AtButton full className="kefu-btn" type="primary" size="small">
        <Flex align="center" justify="center">
          <Icon icon="icon-kefu" />
          <Text>联系客服</Text>
        </Flex>
      </AtButton>
    </>
  );
};
