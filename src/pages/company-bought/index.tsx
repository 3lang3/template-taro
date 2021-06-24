import Button from '@/components/Button';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { ManageSongItem } from '@/components/Chore';
import { AtInput, AtModal, AtModalContent, AtModalHeader } from 'taro-ui';
import { useState } from 'react';
import './index.less';

const songsData = [
  { title: '告白气球', price1: 2000, price2: 3000 },
  { title: '手心里的蔷薇', price1: 2000, price2: 3000 },
  { title: '原来如此', price1: 2000, price2: 3000 },
  { title: '我们都一样', price1: 2000, price2: 3000 },
];

export default () => {
  const [singer, setSinger] = useState<any>('');
  const [visible, setVisible] = useState(false);
  const onSingerClick = () => {
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
    setSinger('');
  };
  const onModalConfirm = () => {
    console.log(singer);
    closeModal();
  };
  return (
    <>
      {songsData.map((song, i) => (
        <ManageSongItem
          key={i}
          {...song}
          actionRender={() =>
            i === 0 ? (
              <Button onClick={onSingerClick} circle size="xs" type="primary">
                指定歌手
              </Button>
            ) : (
              <Typography.Text type="primary">林俊杰</Typography.Text>
            )
          }
        />
      ))}
      <AtModal isOpened={visible} onClose={closeModal}>
        <AtModalHeader>指定歌手</AtModalHeader>
        <AtModalContent>
          <Flex className="input--border">
            <AtInput
              placeholder="请选择歌手"
              value={singer}
              name="singer"
              onChange={(v) => setSinger(v)}
            />
            <Typography.Text>林俊杰</Typography.Text>
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
