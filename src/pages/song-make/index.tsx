import Button from '@/components/Button';
import { LibSongItem } from '@/components/Chore';
import Flex from '@/components/Flex';
import { View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import './index.less';

const songsData = [
  { title: '最好的都给你', tags: ['摇滚', '国语'], status: 1 },
  { title: '下辈子不一定还能遇见不下辈子不一定还能遇见不', tags: ['摇滚', '国语'], status: 0 },
];

export default () => {
  return (
    <View className="mt20">
      {songsData.map((song, i) => (
        <LibSongItem
          onClick={() => navigateTo({ url: '/pages/song-detail/index' })}
          key={i}
          title={song.title}
          tags={song.tags}
          actionRender={() => {
            return (
              <Flex justify="end">
                <Button type="primary" outline={song.status === 0} circle size="xs" inline>
                  进行中
                </Button>
              </Flex>
            );
          }}
        />
      ))}
    </View>
  );
};
