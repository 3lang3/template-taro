import cls from 'classnames';
import { Text } from '@tarojs/components';
import type { ViewProps } from '@tarojs/components/types/View';
import './index.less';

type TagBaseProps = {
  children: React.ReactNode;
  type?: 'primary' | 'secondary' | 'light';
} & ViewProps;

export default ({ children, className,  type = 'primary', ...props }: TagBaseProps) => {
  return (
    <Text className={cls('tag', `tag--${type}`, className)} {...props}>
      {children}
    </Text>
  );
};
