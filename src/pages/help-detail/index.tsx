import { View, Text } from '@tarojs/components';
import { getCategoryList, Node } from '@/services/help';
import { FullPageLoader, FullPageError } from '@/components/Chore';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import './index.less';

export default () => {
  const [list, setList] = useState<Node[]>([]);
  const { loading, error, refresh } = useRequest(getCategoryList, {
    onSuccess: ({ data, type, msg }) => {
      if (type === 1) throw Error(msg);
      console.log(data);
      setList(data);
    },
  });
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  return (
    <View className="help-detail">
      <View className="title">
        <Text>问：怎么修改作品信息</Text>
      </View>
      <Text className="before">答：</Text>
      <Text>
        信息，再打开，你就可以看到作者的话了。直接按修改然后写入你要写的话就再点击修改就好了。
      </Text>
    </View>
  );
};
