import { ScrollView } from '@tarojs/components';
import { ScrollViewProps } from '@tarojs/components/types/ScrollView';
import { forwardRef, useState, useImperativeHandle } from 'react';

export type ProScrollViewAction = {
  refresh: () => void;
};

export type ProScrollViewProps = {
  children?: React.ReactNode;
} & ScrollViewProps;

export default forwardRef<unknown, ProScrollViewProps>((props, ref) => {
  const [refresherTriggered, setRefresherTriggered] = useState(false);
  const { onRefresherPulling, onRefresherRefresh, onRefresherRestore, ...restProps } = props;
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

  useImperativeHandle(ref, () => ({
    refresh: _onRefresherRefresh,
  }));

  return (
    <ScrollView
      refresherEnabled
      scrollY
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
