import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import './index.less'

export default () => {
  return (
    <>
      <View className="p-default text-right">
        <Typography.Text type="secondary">全部已读</Typography.Text>
      </View>
      <View className="message-container">
        <View onClick={() => navigateTo({ url: '/pages/message/detail' })} className="message-item message-item--dot">
          <Flex justify="between" className="mb20">
            <Typography.Title level={3} style={{ margin: 0 }}>词曲审核:未通过</Typography.Title>
            <Typography.Text size="sm" type="secondary">
              5-14
            </Typography.Text>
          </Flex>
          <Typography.Text type="secondary" ellipsis>
            您的词曲信息不符合,请仔细阅读查看未您的词曲信息不符合,请仔细阅读查
          </Typography.Text>
        </View>
      </View>
    </>
  );
};
