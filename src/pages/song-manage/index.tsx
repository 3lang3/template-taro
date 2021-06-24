import Button from '@/components/Button';
import Flex from '@/components/Flex';
import { CounterOfferInput, ManageSongItem } from '@/components/Chore';
import Radio from '@/components/Radio';
import { View } from '@tarojs/components';
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import { useState } from 'react';
import './index.less';

const songsData = [
  { title: '告白气球', price1: 2000, price2: 3000, status: 0 },
  { title: '手心里的蔷薇', price1: 2000, price2: 3000, status: 1 },
  { title: '原来如此', price1: 2000, price2: 3000, status: 2 },
  { title: '我们都一样', price1: 2000, price2: 3000, status: 3 },
];

export default () => {
  const [payload, setPayload] = useState<any>({
    price1: '',
    price2: '',
    agree: false,
  });
  const [visible, setVisible] = useState(false);

  const onSingerClick = () => {
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
    setPayload({
      price1: '',
      price2: '',
      agree: false,
    });
  };
  const onModalConfirm = () => {
    console.log(payload);
    closeModal();
  };

  return (
    <>
      {songsData.map((song, i) => (
        <ManageSongItem
          key={i}
          {...song}
          actionRender={() => {
            if (song.status === 0)
              return (
                <Button onClick={onSingerClick} circle size="xs" type="primary">
                  待认领
                </Button>
              );
            return (
              <Button circle size="xs" outline>
                已认领
              </Button>
            );
          }}
        />
      ))}
      <AtModal isOpened={visible} onClose={closeModal}>
        <AtModalHeader>改价</AtModalHeader>
        <AtModalContent>
          <CounterOfferInput
            title="曲"
            price={2000}
            name="n1aasd"
            value={payload.value1}
            onChange={(value) => {
              setPayload((v) => ({ ...v, price1: value }));
              return value
            }}
          />
          <CounterOfferInput
            title="词"
            price={3000}
            name="n2123"
            value={payload.value2}
            onChange={(value) => setPayload((v) => ({ ...v, price2: value }))}
          />
          <View className="ml30">
            <Radio
              label="接受还价"
              value={payload.agree}
              onChange={(value) => setPayload((v) => ({ ...v, agree: value }))}
            />
          </View>
        </AtModalContent>
        <AtModalAction>
          <Flex justify="between" className="p-default pb40">
            <Button onClick={closeModal} outline circle>
              取消
            </Button>
            <Button onClick={onModalConfirm} type="primary" circle>
              确定
            </Button>
          </Flex>
        </AtModalAction>
      </AtModal>
    </>
  );
};
