import { useEffect } from 'react';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import CustomNavigation from '@/components/CustomNavigation';
import Image from '@/components/Image';
import { navigateTo, useRouter, useShareAppMessage } from '@tarojs/taro';
import { View } from '@tarojs/components';
import Icon from '@/components/Icon';
import { getHttpPath } from '@/utils/utils';
import { Empty, FullPageError, FullPageLoader } from '@/components/Chore';
import { useDispatch, useSelector } from 'react-redux';
import { getAlbumDetail } from '@/state/album';
import './index.less';

export default () => {
  const { params } = useRouter();

  const dispatch = useDispatch();
  const { albumEunm } = useSelector((state) => state.album);
  const { data, loading = true, error, done } = albumEunm[params.ids as string] || {};

  useEffect(() => {
    if (!data || !done) {
      dispatch(getAlbumDetail({ album_ids: params.ids as string }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <FullPageLoader />;
  if (error)
    return (
      <FullPageError
        refresh={() => dispatch(getAlbumDetail({ album_ids: params.ids as string }))}
      />
    );
  return <PageContent data={data} params={params} />;
};

function PageContent({ data, params }) {
  useShareAppMessage(() => {
    return {
      title: `${data.album_name}-${data.singer_name}`,
      imageUrl: getHttpPath(data.album_image),
    };
  });

  return (
    <>
      <CustomNavigation home={false} title="专辑" titleColor="#fff" />

      <View style={{ backgroundImage: `url(${data.album_image})` }} className="album-header__bg">
        <Flex className="album-header" align="start">
          <Image className="album-header__cover" src={data.album_image} />
          <Flex
            direction="column"
            align="start"
            justify="between"
            className="album-header__content"
          >
            <Icon
              openType="share"
              icon="icon-shouye_zhaunji_fenxiang"
              className="album-header__share"
            />
            <View>
              <Typography.Text className="mb15" strong size="lg" type="light">
                {data.album_name}
              </Typography.Text>
              <Typography.Text type="light">{data.singer_name}</Typography.Text>
            </View>
            <View style={{ width: '100%', overflow: 'hidden' }}>
              <Typography.Text className="mb15" size="sm" type="light">
                发行时间:{data.issue_date}
              </Typography.Text>
              <Flex
                onClick={() => navigateTo({ url: `/pages/album-detail/index?ids=${params.ids}` })}
                style={{ width: '100%', overflow: 'hidden' }}
                justify="between"
              >
                <Typography.Text size="sm" type="light" ellipsis>
                  {data.desc}
                </Typography.Text>
                <Icon icon="icon-icon_jinru" className="album-header__right" />
              </Flex>
            </View>
          </Flex>
        </Flex>
      </View>
      <View className="album-body">
        {Array.isArray(data.song) && data.song.length ? (
          data.song.map((item, i) => (
            <Flex
              key={i}
              className="album-body__item"
              onClick={() => navigateTo({ url: `/pages/play-detail/index?ids=${item.ids}` })}
            >
              <View className="album-body__item-index">{i + 1}</View>
              <View className="album-body__item-content">
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
}
