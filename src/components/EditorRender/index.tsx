/**
 * 富文本渲染
 */

import cls from 'classnames';
import { View } from '@tarojs/components';

import './index.less';

type EditorRenderProps = {
  content: string;
  /** 纯文本展示 */
  text?: boolean;
  /** 是否居中 */
  center?: boolean;
};

export default ({ content, text, center }: EditorRenderProps) => {
  return (
    <View
      className={cls('braft-editor', {
        'braft-editor--text': text,
        'braft-editor--center': center,
      })}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
