import { View } from '@tarojs/components';
import SortList from '@/components/SortList';
import { getCategoryList, Node, ListNode, getList } from '@/services/help';
import { FullPageLoader, FullPageError, Empty } from '@/components/Chore';
import Search from '@/components/Search';
import KefuBtn from '@/components/KefuBtn';
import { AtList, AtListItem } from 'taro-ui';
import { navigateTo } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import './index.less';

export default () => {
  const [sortList, setSortList] = useState<Node[]>([]);
  const [searchList, setSearchList] = useState<ListNode[]>([]);
  const [isSearchList, setIsSearchList] = useState<boolean>(false);

  const { loading, error, refresh } = useRequest(getCategoryList, {
    onSuccess: ({ data, type, msg }) => {
      if (type === 1) throw Error(msg);
      setSortList(data);
    },
  });
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  if (!sortList.length || (!searchList.length && isSearchList))
    return (
      <View className="help">
        <Search onSearch={onSearch} />
        <Empty className="mt50" />
      </View>
    );
  function onSearch(value) {
    setIsSearchList(!!value);
    getList({ question: value }).then(({ data: { _list } }) => {
      setSearchList(_list);
    });
  }
  return (
    <View className="help">
      <Search onSearch={onSearch} />
      {isSearchList
        ? searchList.map((item) => (
            <AtList key={item.ids}>
              <AtListItem
                onClick={() => navigateTo({ url: `/pages/help-detail/index?ids=${item.ids}` })}
                title={item.question}
                arrow="right"
              />
            </AtList>
          ))
        : sortList.map((item: Node) => (
            <SortList
              key={item.ids}
              onLeft={(node) => navigateTo({ url: `/pages/help-list/index?ids=${node.ids}` })}
              onRight={(node) => navigateTo({ url: `/pages/help-detail/index?ids=${node.ids}` })}
              data={item}
            />
          ))}

      <KefuBtn />
    </View>
  );
};
