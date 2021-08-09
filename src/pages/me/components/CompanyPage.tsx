import Button from '@/components/Button';
import { ManageSongItem } from '@/components/Chore';
import Flex from '@/components/Flex';
import Image from '@/components/Image';
import ScrollLoadList, { ActionType } from '@/components/ScrollLoadList';
import Typography from '@/components/Typography';
import { getMechanismInfo, getMechanismSongList, companyViewSong } from '@/services/me';
import { View } from '@tarojs/components';
import { navigateTo, requestSubscribeMessage } from '@tarojs/taro';
import { useRequest } from 'ahooks';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './company.less';

export default () => {
  const actionRef = useRef<ActionType>();
  const userData = useSelector((state) => state.common.data);
  const {
    data: { data } = { data: {} },
    error,
    run,
  } = useRequest(getMechanismInfo, {
    manual: true,
  });

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const onSongClick = async (song, index) => {
    navigateTo({
      url: `/pages/play-detail/index?type=score&ids=${song.ids}`,
      success: () => {
        companyViewSong({ ids: song.ids });
        const newNode = { ...song, is_read: 1 };
        actionRef.current?.rowMutate({ index, data: newNode });
      },
    });
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
      <ScrollLoadList
        actionRef={actionRef}
        request={getMechanismSongList}
        row={(song, i) => (
          <ManageSongItem
            key={i}
            title={song.song_name}
            price1={song.composer_final_price}
            price2={song.lyricist_final_price}
            onClick={() => onSongClick(song, i)}
            actionRender={() => (
              <Button circle size="xs" outline={!!song.is_read} type="primary">
                查看
              </Button>
            )}
          />
        )}
      />
    </View>
  );
};
