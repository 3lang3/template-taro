import Flex from '@/components/Flex';
import Icon from '@/components/Icon';
import { navigateTo } from '@tarojs/taro';
import { FullPageLoader, FullPageError, LibSongItem, Empty } from '@/components/Chore';
import { Text } from '@tarojs/components';
import { getWantSongList } from '@/services/my-song';
import { setList } from '@/state/my-song';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRequest } from 'ahooks';
import ContentPop, { ContentPopAction } from '@/components/ContentPop';
import './index.less';

export default () => {
  const popRef = useRef<ContentPopAction>(null);
  const dispatch = useDispatch();
  const { list } = useSelector((state) => {
    return state.mySong;
  });
  const { loading, error, refresh } = useRequest(getWantSongList, {
    onSuccess: ({ data, type, msg }) => {
      if (type === 1) throw Error(msg);
      if (data.length) {
        dispatch(setList(data as any));
      }
    },
  });
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;

  return (
    <>
      <ContentPop title="歌词查看" center ref={popRef} />
      {list.length ? (
        list.map((song, i) => (
          <LibSongItem
            key={i}
            title={song.song_name}
            tags={[song.language, song.sect]}
            actionRender={() => {
              return (
                <Flex justify="end">
                  <>
                    <Icon
                      onClick={() => popRef.current?.show(<Text>{song.lyricist_content}</Text>)}
                      icon="icon-quku-geci"
                      className="lib-song-action__item"
                    />
                    <Icon
                      onClick={() =>
                        navigateTo({
                          url: `/pages/play-detail/index?ids=${song.ids}&type=score`,
                        })
                      }
                      icon="icon-quku_bofang"
                      className="lib-song-action__item"
                    />
                  </>
                </Flex>
              );
            }}
          />
        ))
      ) : (
        <Empty className="mt50" />
      )}
    </>
  );
};
