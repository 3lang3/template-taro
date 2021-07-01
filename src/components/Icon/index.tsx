/**
 * 基于iconfont的Icon封装
 *
 * icon项目地址
 * @see https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=2629008&keyword=&project_type=&page=
 */

import cls from 'classnames';
import { Text } from '@tarojs/components';

type CustomIconProps = {
  className?: string;
  color?: string;
  size?: string | number;
  icon: string;
  onClick?: () => void;
};

export default ({ icon, color, size, className, ...props }: CustomIconProps) => {
  return (
    <Text
      className={cls(className, 'iconfont', 'icon--center', icon)}
      style={{ color, fontSize: `${size}rpx` }}
      {...props}
    />
  );
};
