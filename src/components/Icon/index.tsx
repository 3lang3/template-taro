/**
 * 基于iconfont的Icon封装
 *
 * icon项目地址
 * @see https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=2629008&keyword=&project_type=&page=
 */

import cls from 'classnames';
import { Text } from '@tarojs/components';
import { AtButtonProps } from 'taro-ui/types/button';
import Button from '../Button';

type CustomIconProps = {
  className?: string;
  color?: string;
  size?: string | number;
  icon: string;
  onClick?: () => void;
  openType?: AtButtonProps['openType'];
};

export default ({ icon, color, size, className, openType, ...props }: CustomIconProps) => {
  return openType ? (
    <Button
      openType={openType}
      className={cls(className, 'iconfont--button', 'iconfont', 'icon--center', icon)}
      style={{ color, fontSize: size ? `${size}rpx` : undefined }}
      {...props}
    />
  ) : (
    <Text
      className={cls(className, 'iconfont', 'icon--center', icon)}
      style={{ color, fontSize: size ? `${size}rpx` : undefined }}
      {...props}
    />
  );
};
