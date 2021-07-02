import CustomTabBar from '@/components/CustomTabBar';
import Flex from '@/components/Flex';
import Icon from '@/components/Icon';
import { navigateTo } from '@tarojs/taro';
import { LibSongItem } from '@/components/Chore';
import './index.less';

const songsData = [
  { title: '最好的都给你', tags: ['摇滚', '国语'], lyric: 1 },
  { title: '下辈子不一定还能遇见不下辈子不一定还能遇见不', tags: ['摇滚', '国语'], lyric: 0 },
];

export default () => {
  return (
    <>
      {songsData.map((song, i) => (
        <LibSongItem
          key={i}
          title={song.title}
          tags={song.tags}
          actionRender={() => {
            return (
              <Flex justify="end">
                {+song.lyric ? (
                  <Icon icon="icon-quku_qupu" className="lib-song-action__item" />
                ) : null}
                <Icon
                  onClick={() => navigateTo({ url: '/pages/play-detail/index' })}
                  icon="icon-quku_bofang"
                  className="lib-song-action__item"
                />
              </Flex>
            );
          }}
        />
      ))}
      <CustomTabBar />
    </>
  );
};
