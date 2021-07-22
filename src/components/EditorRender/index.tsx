/**
 * 富文本渲染
 */

import { View } from '@tarojs/components';
import { useEffect } from 'react';

import './index.less';

export default ({ content }) => {
  useEffect(() => {
    // @hack
    // process image mode
    (Taro as any).options.html.transformElement = (el) => {
      if (el.nodeName === 'image') {
        el.setAttribute('mode', 'widthFix');
      }
      return el;
    };
  }, []);
  return <View className="braft-editor" dangerouslySetInnerHTML={{ __html: content }} />;
};
