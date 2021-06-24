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
      className={cls(className, 'iconfont', icon)}
      style={{ color, fontSize: size }}
      {...props}
    />
  );
};
