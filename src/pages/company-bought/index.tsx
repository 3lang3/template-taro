import Button from '@/components/Button';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { AtInput, AtModal, AtModalContent, AtModalHeader } from 'taro-ui';
import { useState } from 'react';
import { useRequest } from 'ahooks';
import { getBuySongList, appointMusicSong } from '@/services/company-bought';
import { FullPageLoader, FullPageError, ManageSongItem } from '@/components/Chore';
import './index.less';

export default () => {
  const [singer, setSinger] = useState<string | number>('');
  const [songsData, setSongsData] = useState([] as any);
  const [localNode, setLocalNode] = useState({} as any);
  const [visible, setVisible] = useState(false);
  const { loading, error, refresh } = useRequest(getBuySongList, {
    defaultParams: [{ page: 1, pageSize: 10 }],
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
  const onSingerClick = (node) => {
    setLocalNode(node);
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
    setSinger('');
  };
  const onModalConfirm = () => {
    appointMusicSong({ ids: localNode.ids, memberIds: [singer as string] }).then(({ type }) => {
      if (type === 1) return;
      closeModal();
    });
  };
  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  return (
    <>
      {songsData.map((song, i) => (
        <ManageSongItem
          key={i}
          {...song}
          actionRender={() =>
            i === 0 ? (
              <Button onClick={() => onSingerClick(song)} circle size="xs" type="primary">
                指定歌手
              </Button>
            ) : (
              <Typography.Text type="primary">{song.singer[0]}</Typography.Text>
            )
          }
        />
      ))}
      <AtModal isOpened={visible} onClose={closeModal}>
        <AtModalHeader>指定歌手</AtModalHeader>
        <AtModalContent>
          <Flex className="input--border">
            <AtInput
              placeholder="请输入歌手"
              value={singer as any}
              name="singer"
              onChange={(v) => setSinger(v)}
            />
            <Typography.Text>{localNode.singer && localNode.singer[0]}</Typography.Text>
          </Flex>
          <Flex className="mt50" justify="between">
            <Button onClick={closeModal} outline circle>
              取消
            </Button>
            <Button onClick={onModalConfirm} type="primary" circle>
              确认
            </Button>
          </Flex>
        </AtModalContent>
      </AtModal>
    </>
  );
};
