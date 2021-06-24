import cls from 'classnames';
import { AtButton } from 'taro-ui';
import type { AtButtonProps } from 'taro-ui/types/button';
import './index.less';

type ButtonProps = {
  outline?: boolean;
  inline?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  type?: 'default' | 'danger' | 'primary' | 'secondary' | 'light';
  children?: React.ReactNode;
} & Omit<AtButtonProps, 'size' | 'type'>;

export default ({ className, inline, outline, size = 'md', type = 'default', ...props }: ButtonProps) => {
  return (
    <AtButton
      className={cls(className, 'custom-button', `button-size--${size}`, `button-type--${type}`, {
        'button--outline': outline,
        'button--inline': inline,
      })}
      {...props}
    ></AtButton>
  );
};
