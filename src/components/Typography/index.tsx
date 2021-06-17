import cls from 'classnames';
import { View } from '@tarojs/components';
import './index.less';

type TypographyProps = {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  ellipsis?: boolean | number;
};

type TextProps = {
  type?: 'default' | 'danger' | 'secondary' | 'light';
  size?: 'md' | 'sm' | 'xs' | 'lg';
  children?: React.ReactNode | string;
} & TypographyProps;

const Text = ({
  type = 'default',
  size = 'md',
  ellipsis,
  className,
  children,
  ...props
}: TextProps) => {
  const elli = ellipsis === true ? 1 : ellipsis;
  return (
    <View
      className={cls(
        'typography__text',
        `typography__text--${type}`,
        `typography__text--${size}`,
        className,
        {
          [`ellipsis--l${elli}`]: ellipsis,
        },
      )}
      {...props}
    >
      {children}
    </View>
  );
};

type TitleProps = {
  /**
   *
   */
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode | string;
  type?: 'default' | 'danger' | 'secondary' | 'light';
} & TypographyProps;
const Title = ({ level = 4, className, type, ellipsis, children, ...props }: TitleProps) => {
  const elli = ellipsis === true ? 1 : ellipsis;
  return (
    <View
      className={cls(
        'typography__title',
        `typography__title--${type}`,
        `typography__title--h${level}`,
        className,
        {
          [`ellipsis--l${elli}`]: ellipsis,
        },
      )}
      {...props}
    >
      {children}
    </View>
  );
};

type LinkProps = {
  children: React.ReactNode | string;
} & TypographyProps;
const Link = ({ className, ellipsis, children, ...props }: LinkProps) => {
  const elli = ellipsis === true ? 1 : ellipsis;
  return (
    <View
      className={cls('typography__link', className, {
        [`ellipsis--l${elli}`]: ellipsis,
      })}
      {...props}
    >
      {children}
    </View>
  );
};

const Typography = {
  Text,
  Title,
  Link,
};

export default Typography;
