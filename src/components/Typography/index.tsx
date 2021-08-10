import cls from 'classnames';
import { ITouchEvent, View } from '@tarojs/components';
import './index.less';

type TypographyProps = {
  center?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: ITouchEvent) => void;
  ellipsis?: boolean | number;
};

type TextProps = {
  type?: 'default' | 'danger' | 'secondary' | 'light' | 'primary' | 'success';
  size?: 'md' | 'sm' | 'xs' | 'lg' | 'xl' | 'xxl';
  strong?: boolean;
  children?: React.ReactNode | string;
} & TypographyProps;

const Text = ({
  type = 'default',
  size = 'md',
  center,
  ellipsis,
  className,
  children,
  strong,
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
          'text-strong': strong,
          'text-center': center,
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
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode | string;
  type?: 'default' | 'danger' | 'secondary' | 'light' | 'primary';
} & TypographyProps;
const Title = ({
  level = 4,
  center,
  className,
  type,
  ellipsis,
  children,
  ...props
}: TitleProps) => {
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
          'text-center': center,
        },
      )}
      {...props}
    >
      {children}
    </View>
  );
};

type LinkProps = {
  size?: 'md' | 'sm' | 'xs' | 'lg' | 'xl' | 'xxl';
  children: React.ReactNode | string;
} & TypographyProps;
const Link = ({ className, center, size = 'md', ellipsis, children, ...props }: LinkProps) => {
  const elli = ellipsis === true ? 1 : ellipsis;
  return (
    <View
      className={cls('typography__link', `typography__link--${size}`, className, {
        [`ellipsis--l${elli}`]: ellipsis,
        'text-center': center,
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
