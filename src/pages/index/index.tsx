import { View, Image as TaroImage } from '@tarojs/components';
import CustomTabBar from '@/components/CustomTabBar';
import {TabNavigationBar} from '@/components/CustomNavigation';
import CustomSwiper from '@/components/CustomSwiper';

import Typography from '@/components/Typography';
import Image from '@/components/Image';
import './index.less';


const rcAlbumData = [
  { title: '拜托了世界好拜托了世界好', author: '蔡徐坤' },
  { title: '拜托了世界好拜托了世界好', author: '蔡徐坤' },
  { title: '拜托了世界好拜托了世界好', author: '蔡徐坤' },
  { title: '拜托了世界好拜托了世界好', author: '蔡徐坤' },
  { title: '拜托了世界好拜托了世界好', author: '蔡徐坤' },
  { title: '拜托了世界好拜托了世界好', author: '蔡徐坤' },
];

const RcAlbumItem = (props) => {
  return (
    <View className="rc-album-item">
      <Image className="rc-album-item__img" src="" />
      <Typography.Text className="rc-album-item__title" ellipsis>
        {props.title}
      </Typography.Text>
      <Typography.Text className="rc-album-item__author" size="sm" type="secondary" ellipsis>
        {props.author}
      </Typography.Text>
    </View>
  );
};

const RcAlbum = () => {
  return (
    <View className="rc-album">
      {rcAlbumData.map((item, i) => (
        <RcAlbumItem key={i} {...item} />
      ))}
    </View>
  );
};

const hotSongData = Array.from({ length: 10 }, (_, i) => ({
  rank: i + 1,
  title: '拜托了世界好拜托了世界好',
  author: '蔡徐坤',
}));

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

const HotSong = () => {
  return (
    <View className="hot-song">
      {hotSongData.map((item, i) => (
        <HotSongItem key={i} {...item} />
      ))}
    </View>
  );
};

const latestNewsData = [
  {
    title: '有台时光机,开往快乐星球,请尽快入座,一起追忆那些儿时让我们痴迷的音乐吧~',
    view: '6665',
    timestamp: '2020.05.20 16:00',
    img: '',
  },
  {
    sole: 1,
    title: '有台时光机,开往快乐星球,请尽快入座,一起追忆那些儿时让我们痴迷的音乐吧~',
    view: '6665',
    timestamp: '2020.05.20 16:00',
    img: '',
  },
];

const LatestNewsItem = (props) => {
  return (
    <View className="latest-news-item">
      <Image className="latest-news-item__img" src={props.img} />
      <Typography.Text className="latest-news-item__title" ellipsis={2}>
        {props.title}
      </Typography.Text>
      <View className="latest-news-item__footer">
        <View className="latest-news-item__footer-item">
          <TaroImage mode="aspectFit" className="latest-news-item__icon" src={require('@/assets/icon/clock_outline.svg')} />
          <Typography.Text size="sm" type="secondary">
            {props.timestamp}
          </Typography.Text>
        </View>
        <View className="latest-news-item__footer-item">
          <TaroImage mode="aspectFit" className="latest-news-item__icon" src={require('@/assets/icon/eye_outline.svg')} />
          <Typography.Text size="sm" type="secondary">
            {props.view}
          </Typography.Text>
        </View>
      </View>
    </View>
  );
};

const LatestNews = () => {
  return (
    <View className="latest-news">
      {latestNewsData.map((item, i) => (
        <LatestNewsItem key={i} {...item} />
      ))}
    </View>
  );
};

export default () => {
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
            data={[1, 2, 3]}
            itemRender={(item) => <View>{item}</View>}
          />
        </View>
        <View className="index-rc-album">
          <Typography.Title level={2}>推荐专辑</Typography.Title>
          <RcAlbum />
        </View>
        <View className="index-hot-song">
          <View className="index-hot-song__title">
            <Typography.Title style={{ marginBottom: 0 }} level={2}>
              热门歌曲
            </Typography.Title>
            <Typography.Text type="secondary" size="sm">
              更多
            </Typography.Text>
          </View>
          <HotSong />
        </View>
        <View className="index-latest-news">
          <Typography.Title level={2}>最新动态</Typography.Title>
          <LatestNews />
        </View>
      </View>
      <CustomTabBar />
    </>
  );
};
