import cls from 'classnames';
import { AtButton } from 'taro-ui';
import type { AtButtonProps } from 'taro-ui/types/button';
import './index.less';

type ButtonProps = {
  marginAuto?: boolean;
  outline?: boolean;
  inline?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  type?: 'default' | 'danger' | 'primary' | 'secondary' | 'light' | 'disabled';
  children?: React.ReactNode;
  style?: React.CSSProperties;
} & Omit<AtButtonProps, 'size' | 'type'>;

export default ({
  className,
  inline,
  outline,
  size = 'md',
  type = 'default',
  marginAuto = true,
  style,
  ...props
}: ButtonProps) => {
  return (
    <AtButton
      customStyle={style}
      className={cls(className, 'custom-button', `button-size--${size}`, `button-type--${type}`, {
        'button--outline': outline,
        'button--inline': inline,
        m0: !marginAuto,
      })}
      {...props}
    ></AtButton>
  );
};
