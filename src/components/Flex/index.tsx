import { View } from '@tarojs/components';
import type { ViewProps } from '@tarojs/components/types/View';
import cls from 'classnames';
import React from 'react';
import './index.less';

export type FlexProps = {
  align?: 'center' | 'baseline' | 'start' | 'end' | 'stretch';
  justify?: 'center' | 'start' | 'end' | 'between' | 'around' | 'evenly' | 'stretch';
  wrap?: 'wrap' | 'nowrap';
  direction?: 'column' | 'row';
  children?: React.ReactNode;
  flex?: Omit<React.CSSProperties, 'flex'>;
} & ViewProps;

export default ({
  align = 'center',
  justify = 'start',
  wrap = 'nowrap',
  direction = 'row',
  flex,
  children,
  className,
  ...props
}: FlexProps) => {
  return (
    <View
      className={cls(
        'flex',
        `flex-align-${align}`,
        `flex-justify-${justify}`,
        {
          'flex-wrap': wrap === 'wrap',
          'flex-column': direction === 'column',
        },
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
};
