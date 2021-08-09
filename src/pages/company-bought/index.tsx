import Button from '@/components/Button';
import { showToast, stopPullDownRefresh, usePullDownRefresh } from '@tarojs/taro';
import Typography from '@/components/Typography';
import InputSelect from '@/components/InputSelect';
import { useRequest } from 'ahooks';
import ScrollLoadList, { ActionType } from '@/components/ScrollLoadList';
import { useRef } from 'react';
import { getBuySongList, getSingerByName, appointMusicSong } from '@/services/company-bought';
import { ManageSongItem } from '@/components/Chore';
import './index.less';

export default () => {
  const actionRef = useRef<ActionType>();
  const { run } = useRequest(getSingerByName, {
    manual: true,
  });
  function onSubmit(node, members, index) {
    if (!members.length) {
      showToast({
        title: '请输入指定歌手',
        icon: 'none',
        duration: 1500,
      });
      return;
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
    const newNode = { ...node, singer: members.map((item) => item.nickname) };
    actionRef.current?.rowMutate({ index, data: newNode });
  }

  usePullDownRefresh(async () => {
    await actionRef.current?.pulldown();
    stopPullDownRefresh();
  });

  return (
    <>
      <ScrollLoadList
        actionRef={actionRef}
        request={getBuySongList}
        row={(song, i) => (
          <ManageSongItem
            key={i}
            {...song}
            title={song.song_name}
            price1={song.composer_final_price}
            price2={song.lyricist_final_price}
            actionRender={() =>
              song.singer.length === 0 ? (
                <InputSelect
                  title="指定歌手"
                  request={run}
                  onSubmit={(members) => onSubmit(song, members, i)}
                >
                  <Button circle size="xs" type="primary">
                    指定歌手
                  </Button>
                </InputSelect>
              ) : (
                <InputSelect
                  title="指定歌手"
                  request={run}
                  onSubmit={(members) => onSubmit(song, members, i)}
                >
                  <Typography.Text type="primary">{song.singer[0]}</Typography.Text>
                </InputSelect>
              )
            }
          />
        )}
      />
    </>
  );
};
