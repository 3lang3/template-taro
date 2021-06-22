import Button from '@/components/Button';
import Flex from '@/components/Flex';
import Typography from '@/components/Typography';
import { View } from '@tarojs/components';
import { AtInput, AtModal, AtModalContent } from 'taro-ui';
import { useState } from 'react';
import './index.less';

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
      <Flex className="bought__item">
        <View className="bought__item-content">
          <Typography.Text className="mb20" size="lg">
            告白气球
          </Typography.Text>
          <Flex>
            <Typography.Text className="mr20" type="secondary">
              曲2000元
            </Typography.Text>
            <Typography.Text type="secondary">词3000元</Typography.Text>
          </Flex>
        </View>
        <Button onClick={onSingerClick} circle size="xs" type="primary">
          指定歌手
        </Button>
      </Flex>
      <Flex className="bought__item">
        <View className="bought__item-content">
          <Typography.Text className="mb20" size="lg">
            告白气球
          </Typography.Text>
          <Flex>
            <Typography.Text className="mr20" type="secondary">
              曲2000元
            </Typography.Text>
            <Typography.Text type="secondary">词3000元</Typography.Text>
          </Flex>
        </View>
        <Typography.Text type="primary">林俊杰</Typography.Text>
      </Flex>
      <AtModal isOpened={visible} onClose={closeModal} className="bought-modal">
        <AtModalContent>
          <Typography.Title center level={3}>
            指定歌手
          </Typography.Title>
          <Flex className="bought-modal__input">
            <AtInput
              placeholder="请选择歌手"
              value={singer}
              name="singer"
              onChange={(v) => setSinger(v)}
            />
            <Typography.Text>林俊杰</Typography.Text>
          </Flex>
          <Flex justify="between">
            <Button onClick={closeModal} className="bought-modal__btn" outline circle>
              取消
            </Button>
            <Button onClick={onModalConfirm} className="bought-modal__btn" type="primary" circle>
              确认
            </Button>
          </Flex>
        </AtModalContent>
      </AtModal>
    </>
  );
};
