import { PAGINATION } from '@/config/constant';
import { useReachBottom } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { AtActivityIndicator } from 'taro-ui';
import { Empty } from '../Chore';
import Flex from '../Flex';
import Typography from '../Typography';

export type ActionType<T = {}> = {
  reload: () => void;
  /** 更改行数据 */
  rowMutate: ({ index, data }: { index: number; data: any }) => void;
} & T;

type ScrollLoadListProps<T = {}> = {
  /** 列表请求的service */
  request: (params?: any) => Promise<any>;
  /** 行渲染方法 */
  row: (row: T, idx: number) => React.ReactNode;
  /** 额外参数 */
  params?: Record<string, any>;
  /** 空状态ui */
  emptyRender?: () => React.ReactNode;
  /** 初始化的参数，可以操作 list */
  actionRef?: React.MutableRefObject<ActionType | undefined>;
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
) => JSX.Element = ({ params = {}, emptyRender = () => <Empty />, actionRef, ...props }) => {
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
    onError: () => {
      paginationRef.current = PAGINATION;
    },
  });

  const reload = () => {
    setList([]);
    paginationRef.current = PAGINATION;
    run(params);
  };

  const rowMutate = ({ index, data }) => {
    const newList = JSON.parse(JSON.stringify(list));
    newList.splice(index, 1, data);
    setList(newList);
  };

  // params变动 列表刷新
  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    if (actionRef && !actionRef.current) {
      actionRef.current = {
        reload,
        rowMutate,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionRef]);

  // 滚动加载
  useReachBottom(() => {
    if (error) return;
    // 请求中或者没有更多数据 return
    if (loading || nomoreRef.current) return;
    const { page, pageSize } = paginationRef.current;
    run({ ...params, pageSize, page: page + 1 });
  });

  return (
    <>
      {(() => {
        if (error && !loading)
          return (
            <Flex className="mt50" justify="center" direction="column">
              <Empty message="加载失败" />
            </Flex>
          );
        if (nomoreRef.current && !list.length && !loading)
          return (
            <Flex className="mt50" justify="center" direction="column">
              {emptyRender()}
            </Flex>
          );
        return list.map(props.row);
      })()}
      {loading && (
        <Flex justify="center">
          <AtActivityIndicator />
        </Flex>
      )}
      {/* 请求页数大于1才展示加载完文案 */}
      {nomoreRef.current && paginationRef.current.page > 1 && (
        <Flex justify="center">
          <Typography.Text style={{ color: '#aaa' }}>全部加载完拉~</Typography.Text>
        </Flex>
      )}
    </>
  );
};

export default ScrollLoadList;
