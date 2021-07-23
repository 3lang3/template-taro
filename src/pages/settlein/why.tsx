// 为什么入驻娱当家

import { FullPageError, FullPageLoader } from '@/components/Chore';
import EditorRender from '@/components/EditorRender';
import { getCopyWriting } from '@/services/common';
import { View } from '@tarojs/components';
import { useRequest } from 'ahooks';

export default () => {
  const { data: { data } = { data: {} }, loading, error, refresh } = useRequest(getCopyWriting);
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  return (
    <View className="bg-white p-default">
      <EditorRender content={data.content} />;
    </View>
  );
};
