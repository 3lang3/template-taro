import { View } from '@tarojs/components';
import { getCategoryList, Node } from '@/services/help';
import { FullPageLoader, FullPageError } from '@/components/Chore';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import { AtList, AtListItem } from 'taro-ui';
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
    <View className="help-list">
      <AtList>
        <AtListItem title="标题文字" arrow="right" />
      </AtList>
    </View>
  );
};
