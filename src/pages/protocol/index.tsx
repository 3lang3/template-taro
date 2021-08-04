import { View, Text, Button } from '@tarojs/components';
import Flex from '@/components/Flex';
import { navigateBack } from '@tarojs/taro';
import { getProtocol } from '@/services/protocol';
import EditorRender from '@/components/EditorRender';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import './index.less';

export default () => {
  const [detail, setDetail] = useState({ content: '', title: '' });
  useRequest(getProtocol, {
    onSuccess: ({ data }) => {
      setDetail(data);
    },
  });
  return (
    <Flex className="protocol" justify="center" wrap="wrap">
      <View className="content">
        <Text className="title">{detail.title}</Text>
        <EditorRender content={detail.content} />
      </View>
      <Button onClick={() => navigateBack()}>知道了</Button>
    </Flex>
  );
};
