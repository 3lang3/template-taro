/**
 * 富文本渲染
 */

import { View } from '@tarojs/components';

import './index.less';

export default ({ content }) => {
  return <View className="braft-editor" dangerouslySetInnerHTML={{ __html: content }} />;
};
