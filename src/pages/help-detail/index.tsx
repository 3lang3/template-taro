import { View, Text } from '@tarojs/components';
import { getDetail, ListNode } from '@/services/help';
import { FullPageLoader, FullPageError } from '@/components/Chore';
import { getCurrentInstance } from '@tarojs/taro';
import Flex from '@/components/Flex';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import './index.less';

export default () => {
  const { router } = getCurrentInstance();
  const { ids } = (router as any).params;
  const [data, setData] = useState<ListNode>({} as ListNode);
  const { loading, error, refresh } = useRequest(getDetail, {
    defaultParams: [{ ids }],
    onSuccess: ({ data: node, type, msg }) => {
      if (type === 1) throw Error(msg);
      setData(node);
    },
  });
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  return (
    <View className="help-detail">
      <View className="title">
        <Text>问：{data.question}</Text>
      </View>
      <Flex align="start">
        <Text className="before">答：</Text>
        <View dangerouslySetInnerHTML={{ __html: data.answer }} />
      </Flex>
    </View>
  );
};
