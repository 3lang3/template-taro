import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { View } from '@tarojs/components';
import { getCurrentInstance } from '@tarojs/taro';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import './index.less';

export default () => {
  const { router } = getCurrentInstance();
  const { id } = (router as any).params;
  const [data, setData] = useState<any>(null);
  const { list } = useSelector((state) => {
    return state.message;
  });
  useEffect(() => {
    setData(list.find((item) => String(item.id) === id));
  }, []);
  if (!data) return <></>;
  return (
    <>
      <View className="message-container mt20">
        <View className="message-item">
          <Flex justify="between" className="mb20">
            <Typography.Title style={{ margin: 0 }} level={3}>
              {data.content.title}
            </Typography.Title>
            <Typography.Text size="sm" type="secondary">
              {data.created_at}
            </Typography.Text>
          </Flex>
          <Typography.Text className="mb20">{data.content.message}</Typography.Text>
          {/* <Typography.Text type="secondary">
            原因: <Text className="text-danger">您所提交的手机号为空号!</Text>
          </Typography.Text> */}
        </View>
      </View>
    </>
  );
};
