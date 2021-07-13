import { View, Swiper, SwiperItem } from '@tarojs/components';
import type { SwiperProps } from '@tarojs/components/types/Swiper';
import { useCallback, useState } from 'react';
import cls from 'classnames';
import './index.less';

type CustomSwiperProps = {
  /**
   * swiper的数据
   */
  data?: any[];
  onChange?: (current: number) => void;
  dotRender?: (dots: any[], current: number) => React.ReactNode;
  itemRender: (item: any, idx: number) => React.ReactNode;
  className?: string;
  swiperClassName?: string;
  style?: React.CSSProperties;
};

export default ({
  autoplay = true,
  circular = true,
  current = 0,
  data = [],
  itemRender,
  dotRender = defaultDotRender,
  onChange,
  style,
  className,
  swiperClassName,
  indicatorDots = true,
  ...props
}: Omit<SwiperProps, 'onChange'> & CustomSwiperProps) => {
  const [idx, set] = useState(current);

  const onSwiperChange = useCallback(({ detail }) => {
    if (detail.source === 'touch' || detail.source === 'autoplay') {
      set(detail.current);
      if (onChange) onChange(detail.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className={cls('custom-swiper', className)} style={style}>
      <Swiper
        className={cls('custom-swiper__main', swiperClassName)}
        circular={circular}
        autoplay={autoplay}
        onChange={onSwiperChange}
        current={idx}
        indicatorDots={false}
        {...props}
      >
        {data.map((item, i) => (
          <SwiperItem key={i}>{itemRender(item, i)}</SwiperItem>
        ))}
      </Swiper>
      {indicatorDots && dotRender(data, idx)}
    </View>
  );
};

function defaultDotRender(dots, current) {
  return (
    <View className={cls('custom-swiper__dots')}>
      {dots.map((_, i) => (
        <View
          key={i}
          style={{ opacity: current === i ? 1 : 0.7 }}
          className="custom-swiper__dots-item"
        />
      ))}
    </View>
  );
}
