import { View } from '@tarojs/components';
import { getList, ListNode } from '@/services/help';
import ScrollLoadList from '@/components/ScrollLoadList';
import { getCurrentInstance, navigateTo } from '@tarojs/taro';
import { AtList, AtListItem } from 'taro-ui';
import './index.less';

export default () => {
  const { router } = getCurrentInstance();
  const { ids } = (router as any).params;
  return (
    <View className="help-list">
      <ScrollLoadList<ListNode>
        request={getList}
        params={{ helpCategoryIds: ids }}
        row={(item, i) => (
          <AtList key={'at-list-' + i}>
            <AtListItem
              onClick={() => navigateTo({ url: `/pages/help-detail/index?ids=${item.ids}` })}
              title={item.question}
              arrow="right"
            />
          </AtList>
        )}
      />
    </View>
  );
};
