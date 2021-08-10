/* eslint-disable react-hooks/exhaustive-deps */
import { ScrollView } from '@tarojs/components';
import { ScrollViewProps } from '@tarojs/components/types/ScrollView';
import { forwardRef, useState, useImperativeHandle, useCallback } from 'react';

export type ProScrollViewAction = {
  refresh: () => void;
};

export type ProScrollViewProps = {
  children?: React.ReactNode;
  withExtraPadding?: boolean;
} & ScrollViewProps;

/**
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html
 * 组件需要设置height
 */
export default forwardRef<unknown, ProScrollViewProps>((props, ref) => {
  const [refresherTriggered, setRefresherTriggered] = useState(false);
  const {
    onRefresherPulling,
    onRefresherRefresh,
    onRefresherRestore,
    withExtraPadding,
    style,
    ...restProps
  } = props;
  const _onRefresherPulling = useCallback(async (event) => {
    setRefresherTriggered(true);
    onRefresherPulling?.(event);
  }, []);
  const _onRefresherRefresh = useCallback(async (event) => {
    setRefresherTriggered(true);
    await onRefresherRefresh?.(event);
    if (!onRefresherRestore) setRefresherTriggered(false);
  }, []);

  const _onRefresherRestore = useCallback(async (event) => {
    onRefresherRestore?.(event);
    setRefresherTriggered(false);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      refresh: _onRefresherRefresh,
    }),
    [],
  );

  return (
    <ScrollView
      scrollY
      style={style}
      refresherEnabled
      refresherBackground="transparent"
      refresherTriggered={refresherTriggered}
      onRefresherPulling={props.onRefresherPulling ? _onRefresherPulling : undefined}
      onRefresherRefresh={props.onRefresherRefresh ? _onRefresherRefresh : undefined}
      onRefresherRestore={props.onRefresherRestore ? _onRefresherRestore : undefined}
      {...restProps}
    >
      {props.children}
    </ScrollView>
  );
});
