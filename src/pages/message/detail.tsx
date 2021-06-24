import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { Text, View } from '@tarojs/components';
import './index.less';

export default () => {
  return (
    <>
      <View className="message-container mt20">
        <View className="message-item">
          <Flex justify="between" className="mb20">
            <Typography.Title style={{ margin: 0 }} level={3}>词曲审核:未通过</Typography.Title>
            <Typography.Text size="sm" type="secondary">
              5-14
            </Typography.Text>
          </Flex>
          <Typography.Text className="mb20">
            您的词曲信息不符合,请仔细阅读查看未通过的原因,修改信息后重新提交!
            您的词曲信息不符合,请仔细阅读查看未通过的原因,修改信息后重新提交!
          </Typography.Text>
          <Typography.Text type="secondary">
            原因: <Text className="text-danger">您所提交的手机号为空号!</Text>
          </Typography.Text>
        </View>
      </View>
    </>
  );
};
