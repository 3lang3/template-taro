import { ScrollView } from '@tarojs/components';
import { ScrollViewProps } from '@tarojs/components/types/ScrollView';
import { forwardRef, useState, useImperativeHandle, useMemo } from 'react';
import { useSelector } from 'react-redux';

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
  const navigation = useSelector((state: any) => state.navigation);
  const [refresherTriggered, setRefresherTriggered] = useState(false);
  const {
    onRefresherPulling,
    onRefresherRefresh,
    onRefresherRestore,
    withExtraPadding,
    style,
    ...restProps
  } = props;
  const _onRefresherPulling = async (event) => {
    setRefresherTriggered(true);
    onRefresherPulling?.(event);
  };
  const _onRefresherRefresh = async (event) => {
    setRefresherTriggered(true);
    await onRefresherRefresh?.(event);
    if (!onRefresherRestore) setRefresherTriggered(false);
  };

  const _onRefresherRestore = async (event) => {
    onRefresherRestore?.(event);
    setRefresherTriggered(false);
  };

  const computeStyle = useMemo(() => {
    let paddingBottom = 0;
    if (withExtraPadding) {
      paddingBottom += navigation.navBarHeight;
    }
    return { paddingBottom };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation.navBarHeight]);

  useImperativeHandle(ref, () => ({
    refresh: _onRefresherRefresh,
  }));

  return (
    <ScrollView
      scrollY
      style={Object.assign({}, computeStyle, style)}
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
