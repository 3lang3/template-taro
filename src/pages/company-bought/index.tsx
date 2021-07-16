import Button from '@/components/Button';
import { showToast } from '@tarojs/taro';
import Typography from '@/components/Typography';
import InputSelect from '@/components/InputSelect';
import { useState } from 'react';
import { useRequest } from 'ahooks';
import { getBuySongList, getSingerByName, appointMusicSong } from '@/services/company-bought';
import { FullPageLoader, FullPageError, ManageSongItem } from '@/components/Chore';
import './index.less';

export default () => {
  const [songsData, setSongsData] = useState([] as any);
  const { loading, error, refresh } = useRequest(getBuySongList, {
    defaultParams: [{ page: 1, pageSize: 10 }],
    debounceInterval: 500,
    onSuccess: (res) => {
      setSongsData(
        res.data._list.map((item) => ({
          title: item.song_name,
          price1: item.composer_final_price,
          price2: item.lyricist_final_price,
          ...item,
        })),
      );
    },
  });
  const { run } = useRequest(getSingerByName, {
    manual: true,
  });
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  function onSubmit(node, members) {
    if (!members.length) {
      showToast({
        title: '请输入指定歌手',
        icon: 'none',
        duration: 1500,
      });
      return false;
    }
    appointMusicSong({ ids: node.ids, memberIds: members.map((item) => item.ids) }).then(
      ({ type, msg }) => {
        if (type === 1) throw Error(msg);
        showToast({
          title: '操作成功',
          icon: 'success',
          duration: 1500,
        });
      },
    );
    node.singer = members.map((item) => item.nickname);
    setSongsData([...songsData]);
    return true;
  }
  return (
    <>
      {songsData.map((song, i) => (
        <ManageSongItem
          key={i}
          {...song}
          actionRender={() =>
            song.singer.length === 0 ? (
              <InputSelect
                title="指定歌手"
                request={run}
                onSubmit={(members) => onSubmit(song, members)}
              >
                <Button circle size="xs" type="primary">
                  指定歌手
                </Button>
              </InputSelect>
            ) : (
              <InputSelect
                title="指定歌手"
                request={run}
                onSubmit={(members) => onSubmit(song, members)}
              >
                <Typography.Text type="primary">{song.singer[0]}</Typography.Text>
              </InputSelect>
            )
          }
        />
      ))}
    </>
  );
};
