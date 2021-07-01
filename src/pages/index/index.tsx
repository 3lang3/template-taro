import { View, Image as TaroImage } from '@tarojs/components';
import CustomTabBar from '@/components/CustomTabBar';
import { TabNavigationBar } from '@/components/CustomNavigation';
import CustomSwiper from '@/components/CustomSwiper';
import { navigateTo } from '@tarojs/taro';
import Typography from '@/components/Typography';
import Image from '@/components/Image';
import { useRequest } from 'ahooks';
import { getHomeData } from '@/services/home';
import { FullPageLoader, FullPageError } from '@/components/Chore';
import { useDispatch, useSelector } from 'react-redux';
import { set } from '@/state/home';

import './index.less';

const RcAlbumItem = (props) => {
  return (
    <View
      className="rc-album-item"
      onClick={() => navigateTo({ url: `/pages/album/index?ids=${props.ids}` })}
    >
      <Image className="rc-album-item__img" src={props.album_image} />
      <Typography.Text className="rc-album-item__title" ellipsis>
        {props.album_name}
      </Typography.Text>
      <Typography.Text className="rc-album-item__author" size="sm" type="secondary" ellipsis>
        {props.singer_name}
      </Typography.Text>
    </View>
  );
};

const RcAlbum = ({ data = [] }: { data: any[] }) => {
  return (
    <View className="rc-album">
      {data.map((item, i) => (
        <RcAlbumItem key={i} {...item} />
      ))}
    </View>
  );
};

const HotSongItem = (props) => {
  const rankRender = (rank) => {
    if (+rank > 3) return <Typography.Text type="secondary">{rank}</Typography.Text>;
    return (
      <TaroImage
        mode="aspectFit"
        className="hot-song-item__img"
        src={require(`@/assets/home/rank_${rank}.png`)}
      />
    );
  };
  return (
    <View className="hot-song-item">
      <View className="hot-song-item__rank">{rankRender(props.rank)}</View>
      <View className="hot-song-item__content">
        <Typography.Text className="hot-song-item__title" ellipsis>
          {props.title}
        </Typography.Text>
        <Typography.Text className="hot-song-item__author" size="sm" type="secondary" ellipsis>
          {props.author}
        </Typography.Text>
      </View>
    </View>
  );
};

const HotSong = ({ data = [] }: { data: any[] }) => {
  return (
    <View className="hot-song">
      {data.map((item, i) => (
        <HotSongItem key={i} {...item} />
      ))}
    </View>
  );
};

const LatestNewsItem = (props) => {
  return (
    <View
      className="latest-news-item"
      onClick={() => navigateTo({ url: `/pages/news-detail/index?id=${props.id}` })}
    >
      <Image className="latest-news-item__img" src={props.image} />
      <Typography.Text className="latest-news-item__title" ellipsis={2}>
        {props.title}
      </Typography.Text>
      <View className="latest-news-item__footer">
        <View className="latest-news-item__footer-item">
          <TaroImage
            mode="aspectFit"
            className="latest-news-item__icon"
            src={require('@/assets/icon/clock_outline.svg')}
          />
          <Typography.Text size="sm" type="secondary">
            {props.publish_time}
          </Typography.Text>
        </View>
        <View className="latest-news-item__footer-item">
          <TaroImage
            mode="aspectFit"
            className="latest-news-item__icon"
            src={require('@/assets/icon/eye_outline.svg')}
          />
          <Typography.Text size="sm" type="secondary">
            {props.read_number}
          </Typography.Text>
        </View>
      </View>
    </View>
  );
};

const LatestNews = ({ data = [] }: { data: any[] }) => {
  return (
    <View className="latest-news">
      {data.map((item, i) => (
        <LatestNewsItem key={i} {...item} />
      ))}
    </View>
  );
};

const IndexPageContent = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.home);
  const { loading, error, refresh } = useRequest(getHomeData, {
    manual: !!data.album,
    onSuccess: ({ data: res, type, msg }) => {
      if (type === 1) throw Error(msg);
      dispatch(set(res));
    },
  });

  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  return (
    <>
      <TabNavigationBar />
      <View className="page-index">
        {/* 首页轮播图 */}
        <View className="index-swiper">
          <View className="index-swiper__bg" />
          <CustomSwiper
            className="index-swiper__wrapper"
            swiperClassName="index-swiper__main"
            data={data.banner}
            itemRender={(item) => (
              <View className="index-swiper__main-item">
                <Image className="index-swiper__main-img" src={item.url} />
              </View>
            )}
          />
        </View>
        <View className="index-rc-album">
          <Typography.Title level={2}>推荐专辑</Typography.Title>
          <RcAlbum data={data.album} />
        </View>
        <View className="index-hot-song">
          <View className="index-hot-song__title">
            <Typography.Title style={{ marginBottom: 0 }} level={2}>
              热门歌曲
            </Typography.Title>
            <Typography.Text
              onClick={() => navigateTo({ url: '/pages/hot-board/index' })}
              type="secondary"
              size="sm"
            >
              更多
            </Typography.Text>
          </View>
          <HotSong data={data.hotSongList} />
        </View>
        <View className="index-latest-news">
          <Typography.Title level={2}>最新动态</Typography.Title>
          <LatestNews data={data.trends} />
        </View>
      </View>
    </>
  );
};

export default () => {
  return (
    <>
      <IndexPageContent />
      <CustomTabBar />
    </>
  );
};
