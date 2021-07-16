import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { FullPageLoader, FullPageError, Empty } from '@/components/Chore';
import { View } from '@tarojs/components';
import { navigateTo, usePullDownRefresh, useReachBottom, stopPullDownRefresh } from '@tarojs/taro';
import { useDispatch, useSelector } from 'react-redux';
import { useRequest, useUpdate } from 'ahooks';
import { getMessageList, readMessageRemind, clearMessageRemind } from '@/services/message';
import { setList, msgRefresh, setTotalCount } from '@/state/message';
import { setIsReadAll } from '@/state/common';
import { useEffect, useState } from 'react';
import './index.less';

export default function Index() {
  const dispatch = useDispatch();
  const update = useUpdate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const { list, page, pageSize, totalCount } = useSelector((state) => {
    return state.message;
  });
  const { refresh, run } = useRequest(getMessageList, {
    defaultParams: [{ page, pageSize }],
    // ready: page <= 2, // 是否发起请求
    manual: true, // 手动触发
    onSuccess: ({ data: { _list, _page }, type, msg }) => {
      setLoading(false);
      if (type === 1) throw Error(msg);
      setError(false);
      dispatch(setTotalCount(_page.totalCount));
      if (_list.length) {
        dispatch(setList([...list, ..._list]));
      }
    },
    onError: () => setLoading(false),
  });
  useEffect(() => {
    if (!list.length) {
      run({ page: 1, pageSize: 10 });
    } else {
      setLoading(false);
      setError(false);
    }
  }, []);
  usePullDownRefresh(() => {
    run({ page: 1, pageSize: 10 }).then(({ data: res, type, msg }) => {
      if (type === 1) throw Error(msg);
      dispatch(msgRefresh(res._list));
      stopPullDownRefresh();
    });
  });
  useReachBottom(() => {
    if (list.length < totalCount) {
      run({ page, pageSize });
    }
  });
  const onReadAll = () => {
    clearMessageRemind().then(({ type, msg }) => {
      if (type === 1) throw Error(msg);
      dispatch(setIsReadAll());
      list.forEach((item) => {
        if (!item.is_read) {
          item.is_read = 1;
        }
      });
      update();
    });
  };
  const onRead = (id: number, isRead: number) => {
    navigateTo({ url: '/pages/message/detail' });
    if (!isRead) {
      // 未读
      readMessageRemind({ id }).then(({ type, msg }) => {
        if (type === 1) throw Error(msg);
        dispatch(setIsReadAll());
        list.find((item) => {
          if (item.id === id) {
            item.is_read = 1;
            return true;
          }
          return false;
        });
        update();
      });
    }
  };
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  if (!list.length) return <Empty className="mt60" message="暂无消息" />;
  return (
    <>
      <View className="p-default text-right">
        <Typography.Text onClick={onReadAll} type="secondary">
          全部已读
        </Typography.Text>
      </View>
      <View className="message-container">
        {list.map(({ content: { title, message }, is_read, created_at, id }, i) => (
          <View
            key={i}
            onClick={() => onRead(id, is_read)}
            className={`message-item ${!is_read && 'message-item--dot'}`}
          >
            <Flex justify="between" className="mb20">
              <Typography.Title level={3} style={{ margin: 0 }}>
                {title}
              </Typography.Title>
              <Typography.Text size="sm" type="secondary">
                {created_at}
              </Typography.Text>
            </Flex>
            <Typography.Text type="secondary" ellipsis>
              {message}
            </Typography.Text>
          </View>
        ))}
        {totalCount > 6 && totalCount === list.length && (
          <Flex justify="center">
            <Typography.Text style={{ color: '#aaa' }}>全部加载完拉~</Typography.Text>
          </Flex>
        )}
      </View>
    </>
  );
}
