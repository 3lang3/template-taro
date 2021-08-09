import { PAGINATION } from '@/config/constant';
import { useReachBottom } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AtActivityIndicator } from 'taro-ui';
import { Empty } from '../Chore';
import Flex from '../Flex';
import ProScrollView, { ProScrollViewProps } from '../ProScrollView';
import Typography from '../Typography';

export type ActionType<T = {}> = {
  reload: () => void;
  pulldown: () => void;
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
  headerRender?: () => React.ReactNode;
  /** 空状态ui */
  emptyRender?: () => React.ReactNode;
  /** 初始化的参数，可以操作 list */
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  /** 下拉刷新 */
  refresh?: boolean | Omit<ProScrollViewProps, 'refresherEnabled' | 'onRefresherRefresh'>;
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
) => JSX.Element = ({
  params = {},
  emptyRender = () => <Empty />,
  actionRef,
  refresh,
  ...props
}) => {
  const [list, setList] = useState<any[]>([]);
  const listDataRef = useRef<any[]>([]);
  const paginationRef = useRef(PAGINATION);
  const nomoreRef = useRef(false);

  listDataRef.current = list;

  const { loading, error, ...req } = useRequest(props.request, {
    manual: true,
    onSuccess: ({ data: { _list, _page }, type, msg }) => {
      if (type === 1 || !_list) throw Error(msg);
      paginationRef.current = _page;
      nomoreRef.current = _page.page >= _page.totalPage;
      setList(_page.page === 1 ? _list : [...list, ..._list]);
    },
    onError: () => {
      paginationRef.current = PAGINATION;
    },
  });

  const run = (p) => {
    const { pageSize } = paginationRef.current;
    req.run({ pageSize, ...p });
  };

  const reload = () => {
    setList([]);
    paginationRef.current = PAGINATION;
    run(params);
  };

  const pulldown = async () => {
    paginationRef.current = PAGINATION;
    await run(params);
  };

  const rowMutate = ({ index, data }) => {
    const newList = JSON.parse(JSON.stringify(listDataRef.current));
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
        pulldown,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionRef]);

  const loadmore = async () => {
    if (error) return;
    // 请求中或者没有更多数据 return
    if (loading || nomoreRef.current) return;
    const { page } = paginationRef.current;
    await run({ ...params, page: page + 1 });
  };

  const renderLoaderAndDone = useCallback(() => {
    return (
      <>
        {loading && (
          <Flex className="p-default" justify="center">
            <AtActivityIndicator />
          </Flex>
        )}
        {/* 请求页数大于1才展示加载完文案 */}
        {nomoreRef.current && paginationRef.current.page > 1 && (
          <Flex justify="center" className="p-lg">
            <Typography.Text style={{ color: '#aaa' }}>全部加载完拉~</Typography.Text>
          </Flex>
        )}
      </>
    );
  }, [loading]);
  // 滚动加载
  useReachBottom(async () => {
    if (refresh) return;
    await loadmore();
  });

  return (
    <>
      {refresh ? null : props.headerRender?.()}
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
        return refresh ? (
          <ProScrollView
            {...(refresh as any)}
            lowerThreshold={20}
            onScrollToLower={loadmore}
            onRefresherRefresh={pulldown}
          >
            {props.headerRender?.()}
            {list.map(props.row)}
            {renderLoaderAndDone()}
          </ProScrollView>
        ) : (
          list.map(props.row)
        );
      })()}
      {refresh ? null : renderLoaderAndDone()}
    </>
  );
};

export default ScrollLoadList;
