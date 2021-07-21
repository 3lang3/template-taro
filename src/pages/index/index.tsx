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
import Icon from '@/components/Icon';

import './index.less';

const RcAlbumItem = (props) => {
  return (
    <View
      className="rc-album-item"
      onClick={() => navigateTo({ url: `/pages/album/index?ids=${props.album_ids}` })}
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
    <View
      className="hot-song-item"
      onClick={() => navigateTo({ url: `/pages/play-detail/index?ids=${props.song_ids}` })}
    >
      <View className="hot-song-item__rank">{rankRender(props.sort + 1)}</View>
      <View className="hot-song-item__content">
        <Typography.Text className="hot-song-item__title" ellipsis>
          {props.song_name}
        </Typography.Text>
        <Typography.Text className="hot-song-item__author" size="sm" type="secondary" ellipsis>
          {props.singer}
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
          <Icon icon="icon-shouye_shijian" className="latest-news-item__icon" />
          <Typography.Text size="sm" type="secondary">
            {props.publish_time}
          </Typography.Text>
        </View>
        <View className="latest-news-item__footer-item">
          <Icon icon="icon-shouye_chakan" className="latest-news-item__icon" />
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
  const { data: res, loading, error, refresh } = useRequest(getHomeData);
  if (loading) return <FullPageLoader />;
  if (error || !res?.data) return <FullPageError refresh={refresh} />;
  const data = res.data;
  return (
    <>
      <TabNavigationBar />
      <View className="page-index">
        <View className="index-header__placeholder" />
        <View className="index-header__bg" />
        {/* 首页轮播图 */}
        {Array.isArray(data.banner) && data.banner.length > 0 && (
          <CustomSwiper
            className="index-swiper__wrapper"
            swiperClassName="index-swiper__main"
            data={data.banner}
            itemRender={(item) => (
              <View className="index-swiper__main-item">
                <Image className="index-swiper__main-img" src={item.image} />
              </View>
            )}
          />
        )}
        {Array.isArray(data.album) && data.album.length > 0 && (
          <View className="index-rc-album">
            <Typography.Title level={2}>推荐专辑</Typography.Title>
            <RcAlbum data={data.album} />
          </View>
        )}

        {Array.isArray(data.hotSongList) && data.hotSongList.length > 0 && (
          <>
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
                  <Icon icon="icon-icon_jinru" size="24" />
                </Typography.Text>
              </View>
              <HotSong data={data.hotSongList} />
            </View>
          </>
        )}
        {Array.isArray(data.trends) && data.trends.length > 0 && (
          <View className="index-latest-news">
            <Typography.Title level={2}>最新动态</Typography.Title>
            <LatestNews data={data.trends} />
          </View>
        )}
      </View>
    </>
  );
};

/**
 * @summary tab类页面不能阻塞底部导航条渲染, 页面内容请求和默认页面渲染分离
 */
export default () => {
  return (
    <>
      <IndexPageContent />
      <CustomTabBar />
    </>
  );
};
