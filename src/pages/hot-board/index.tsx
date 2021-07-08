import { useRequest } from 'ahooks';
import { getHotSongList } from '@/services/song';
import { navigateTo } from '@tarojs/taro';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { TabNavigationBar } from '@/components/CustomNavigation';
import { FullPageError, FullPageLoader, Empty } from '@/components/Chore';
import { View, Image as TaroImage } from '@tarojs/components';
import { useDispatch, useSelector } from 'react-redux';
import { set } from '@/state/hot-board';
import './index.less';

export default () => {
  const dispatch = useDispatch();
  const hotBoardData = useSelector((state) => state.hotBoard);
  const { loading, error, refresh } = useRequest(getHotSongList, {
    manual: !!hotBoardData.list.length,
    onSuccess: ({ data, type }) => {
      if (type !== 1) dispatch(set(data));
    },
  });

  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;

  return (
    <>
      <TabNavigationBar />

      <Flex className="hot-board-header" align="end" justify="between">
        <TaroImage
          src={require('@/assets/hot-board/hot_board_title.svg')}
          className="hot-board-header__title"
        />
        {hotBoardData.publish_time ? (
          <Typography.Text type="light" size="sm">
            {hotBoardData.publish_time}更新
          </Typography.Text>
        ) : null}
      </Flex>
      <View className="hot-board-body">
        {hotBoardData.list.length > 0 ? (
          hotBoardData.list.map((item, i) => (
            <Flex
              key={i}
              className="hot-board-body__item"
              onClick={() => navigateTo({ url: `/pages/play-detail/index?ids=${item.song_ids}` })}
            >
              <View className="hot-board-body__item-index">{i + 1}</View>
              <View className="hot-board-body__item-content">
                <Typography.Title level={3}>{item.song_name}</Typography.Title>
                <Typography.Text size="sm" type="secondary">
                  {item.singer}
                </Typography.Text>
              </View>
            </Flex>
          ))
        ) : (
          <Empty />
        )}
      </View>
    </>
  );
};
