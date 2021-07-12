import { PAGINATION } from '@/config/constant';
import { useReachBottom } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { AtActivityIndicator } from 'taro-ui';
import { Empty } from '../Chore';
import Flex from '../Flex';
import Typography from '../Typography';

type ScrollLoadListProps<T = {}> = {
  /** 列表请求的service */
  request: (params?: any) => Promise<any>;
  /** 行渲染方法 */
  row: (row: T, idx: number) => React.ReactNode;
  /** 额外参数 */
  params?: Record<string, any>;
  /** 空状态ui */
  emptyRender?: () => React.ReactNode;
};

/**
 * 🎮滚动加载列表
 *
 * @todo integrate redux feature
 *
 * @param props
 * @returns
 */
const ScrollLoadList: <T extends Record<string, any>>(
  props: ScrollLoadListProps<T>,
) => JSX.Element = ({ params = {}, emptyRender = () => <Empty />, ...props }) => {
  const [list, setList] = useState<any[]>([]);
  const paginationRef = useRef(PAGINATION);
  const nomoreRef = useRef(false);

  const { loading, error, run } = useRequest(props.request, {
    manual: true,
    onSuccess: ({ data: { _list, _page }, type, msg }) => {
      if (type === 1) throw Error(msg);
      paginationRef.current = _page;
      nomoreRef.current = _page.page >= _page.totalPage;
      setList([...list, ..._list]);
    },
  });

  // params变动 列表刷新
  useEffect(() => {
    if (list.length) setList([]);
    paginationRef.current = PAGINATION;
    run(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  // 滚动加载
  useReachBottom(() => {
    // 请求中或者没有更多数据 return
    if (loading || nomoreRef.current) return;
    const { page, pageSize } = paginationRef.current;
    run({ ...params, pageSize, page: page + 1 });
  });

  return (
    <>
      {(() => {
        if (error && !loading) return <Flex justify="center">加载失败</Flex>;
        if (nomoreRef.current && !list.length && !loading) return emptyRender();
        return list.map(props.row);
      })()}
      {loading && (
        <Flex justify="center">
          <AtActivityIndicator />
        </Flex>
      )}
      {nomoreRef.current && !!list.length && (
        <Flex justify="center">
          <Typography.Text type="secondary">全部加载完拉~</Typography.Text>
        </Flex>
      )}
    </>
  );
};

export default ScrollLoadList;
