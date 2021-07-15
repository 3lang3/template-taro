import { View } from '@tarojs/components';
import SortList from '@/components/SortList';
import { getCategoryList, Node } from '@/services/help';
import { FullPageLoader, FullPageError, Empty } from '@/components/Chore';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import './index.less';

export default () => {
  const [list, setList] = useState<Node[]>([]);
  const { loading, error, refresh } = useRequest(getCategoryList, {
    onSuccess: ({ data, type, msg }) => {
      if (type === 1) throw Error(msg);
      setList(data);
    },
  });
  function onLeft(node) {
    console.log(node);
  }
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  if (!list.length) return <Empty className="mt50" />;
  return (
    <View className="help">
      {list.map((item: Node) => (
        <SortList onLeft={onLeft} data={item} />
      ))}
    </View>
  );
};
