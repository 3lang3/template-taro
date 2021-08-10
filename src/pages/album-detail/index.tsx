import { useEffect } from 'react';
import { getAlbumDetail } from '@/state/album';
import Flex from '@/components/Flex';
import CustomNavigation from '@/components/CustomNavigation';
import Image from '@/components/Image';
import config from '@/config';
import { useRouter } from '@tarojs/taro';
import { useDispatch, useSelector } from 'react-redux';
import { FullPageError, FullPageLoader } from '@/components/Chore';
import { Text, View } from '@tarojs/components';
import './index.less';

export default () => {
  const { params } = useRouter();
  const dispatch = useDispatch();
  const { albumEunm } = useSelector((state) => state.album);
  const configData = useSelector((state) => state.common.data.config);
  const { data, loading = true, error, done } = albumEunm[params.ids as string] || {};

  useEffect(() => {
    if (!data || !done) {
      dispatch(getAlbumDetail({ album_ids: params.ids as string }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error)
    return (
      <FullPageError
        refresh={() => dispatch(getAlbumDetail({ album_ids: params.ids as string }))}
      />
    );

  if (loading) return <FullPageLoader />;
  return (
    <>
      <CustomNavigation title="专辑" titleColor="#fff" />
      <View
        style={{
          backgroundImage: `url(${config.cdn}/${
            data.album_image || configData?.default_album_img
          })`,
        }}
        className="album-detail__bg"
      >
        <View className="album-detail">
          <Image className="album-detail__cover" src={data.album_image} />

          <View className="album-detail__wrapper">
            <Flex className="album-detail__p" align="baseline">
              <View className="album-detail__p-label">专辑:</View>
              <Text className="album-detail__p-text">{data.album_name}</Text>
            </Flex>
            <Flex className="album-detail__p">
              <View className="album-detail__p-label">语种:</View>
              <View className="album-detail__p-text">{data.language}</View>
            </Flex>
            <Flex className="album-detail__p">
              <View className="album-detail__p-label">发行时间:</View>
              <View className="album-detail__p-text">{data.issue_date}</View>
            </Flex>
            <Flex className="album-detail__p">
              <View className="album-detail__p-label">唱片公司:</View>
              <View className="album-detail__p-text">{data.company}</View>
            </Flex>
            <Flex className="album-detail__p">
              <View className="album-detail__p-label">流派:</View>
              <View className="album-detail__p-text">{data.sect}</View>
            </Flex>
            <View className="album-detail__desc">
              <Text>{data.desc}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
