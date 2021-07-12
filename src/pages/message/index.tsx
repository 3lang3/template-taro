import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { FullPageLoader, FullPageError, Empty } from '@/components/Chore';
import { View } from '@tarojs/components';
import Taro, { navigateTo, usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { useDispatch, useSelector } from 'react-redux';
import { useRequest, useUpdate } from 'ahooks';
import { getMessageList, readMessageRemind, clearMessageRemind } from '@/services/message';
import { setList, msgRefresh, setTotalPage } from '@/state/message';
import './index.less';

export default function Index() {
  const dispatch = useDispatch();
  const update = useUpdate();
  const { list, page, pageSize, totalPage } = useSelector((state) => {
    return state.message;
  });
  const { loading, error, refresh, run } = useRequest(getMessageList, {
    defaultParams: [{ page, pageSize }],
    onSuccess: ({ data: { _list, _page }, type, msg }) => {
      if (type === 1) throw Error(msg);
      dispatch(setTotalPage(_page.totalPage));
      if (_list.length) {
        dispatch(setList([...list, ..._list]));
      }
    },
  });
  usePullDownRefresh(() => {
    run({ page: 1, pageSize: 10 }).then(({ data: res, type, msg }) => {
      if (type === 1) throw Error(msg);
      dispatch(msgRefresh(res._list));
      Taro.stopPullDownRefresh();
    });
  });
  useReachBottom(() => {
    if (list.length < totalPage) {
      run({ page, pageSize });
    }
  });
  const onReadAll = () => {
    clearMessageRemind().then(({ type, msg }) => {
      if (type === 1) throw Error(msg);
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
      </View>
    </>
  );
}
