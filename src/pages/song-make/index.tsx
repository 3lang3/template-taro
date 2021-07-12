import Button from '@/components/Button';
import Flex from '@/components/Flex';
import { View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { getMakeSongList, Node } from '@/services/song-make';
import { FullPageLoader, FullPageError, LibSongItem, Empty } from '@/components/Chore';
import { useState } from 'react';
import { useRequest } from 'ahooks';
import './index.less';

export default () => {
  const [list, setList] = useState<Node[]>([]);
  const { loading, error, refresh, run } = useRequest(getMakeSongList, {
    onSuccess: ({ data, type, msg }) => {
      if (type === 1) throw Error(msg);
      setList(data);
    },
  });
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  if (!list.length) return <Empty />;
  return (
    <View className="mt20">
      {list.map((song, i) => (
        <LibSongItem
          onClick={() => navigateTo({ url: '/pages/song-detail/index' })}
          key={i}
          title={song.song_name}
          tags={[song.sect, song.language]}
          actionRender={() => {
            return (
              <Flex justify="end">
                <Button type="primary" outline={song.make_status === 2} circle size="xs" inline>
                  {song.make_status === 0 ? '未开始' : song.make_status === 1 ? '进行中' : '已完成'}
                </Button>
              </Flex>
            );
          }}
        />
      ))}
    </View>
  );
};
