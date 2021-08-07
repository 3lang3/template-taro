import Button from '@/components/Button';
import { Empty, FullPageError, FullPageLoader, ManageSongItem } from '@/components/Chore';
import Flex from '@/components/Flex';
import Image from '@/components/Image';
import Typography from '@/components/Typography';
import { getMechanismInfo } from '@/services/me';
import { View } from '@tarojs/components';
import {
  navigateTo,
  requestSubscribeMessage,
  usePullDownRefresh,
  stopPullDownRefresh,
} from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { useSelector } from 'react-redux';
import './company.less';

export default () => {
  const userData = useSelector((state) => state.common.data);
  const { data: { data } = { data: {} }, loading, error, refresh } = useRequest(getMechanismInfo);
  if (loading && !data.song) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;

  usePullDownRefresh(async () => {
    await refresh();
    stopPullDownRefresh();
  });

  const handleClick = async () => {
    // 消息通知订阅
    try {
      const tmplIds = userData.template.map((el) => el.template_id);
      if (!tmplIds.length) throw new Error('no tmplIds... ignore action: requestSubscribeMessage');
      const { errMsg } = await requestSubscribeMessage({
        tmplIds,
      });
      if (errMsg !== 'requestSubscribeMessage:ok')
        throw new Error('requestSubscribeMessage: failed.');
    } catch (err) {
      // requestSubscribeMessage error
      console.log(error);
    }
    navigateTo({ url: '/pages/company-bought/index' });
  };

  return (
    <View className="page-company">
      <Flex className="company-header" justify="between">
        <Image
          className="company-header__avatar"
          src={data.avatar ? data.avatar : require('@/assets/icon/avatar_default.svg')}
        />
        <Typography.Text className="company-header__name" type="light" size="xl" ellipsis>
          {data.company}
        </Typography.Text>
        <Button circle type="light" onClick={handleClick}>
          已购词曲
        </Button>
      </Flex>
      <View className="company-body">
        {Array.isArray(data.song) && data.song.length > 0 ? (
          data.song.map((song, i) => (
            <ManageSongItem
              key={i}
              title={song.song_name}
              price1={song.composer_final_price}
              price2={song.lyricist_final_price}
              onClick={() =>
                navigateTo({ url: `/pages/play-detail/index?type=score&ids=${song.ids}` })
              }
              actionRender={() => (
                <Button circle size="xs" type="primary">
                  查看
                </Button>
              )}
            />
          ))
        ) : (
          <Empty className="mt50" />
        )}
      </View>
    </View>
  );
};
