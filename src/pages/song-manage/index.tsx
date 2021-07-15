import { useSelector } from 'react-redux';
import Button from '@/components/Button';
import Flex from '@/components/Flex';
import { CounterOfferInput, ManageSongItem } from '@/components/Chore';
import Typography from '@/components/Typography';
import Radio from '@/components/Radio';
import { MP_E_SIGN_APPID } from '@/config/constant';
import { View } from '@tarojs/components';
import { operationMusicSongPrice } from '@/services/song';
import { delMusicSong, getMusicSongManageList, createSchemeUrl } from '@/services/song-manage';
import {
  hideLoading,
  navigateTo,
  navigateToMiniProgram,
  showLoading,
  showModal,
  showToast,
  useDidShow,
} from '@tarojs/taro';
import ScrollLoadList, { ActionType } from '@/components/ScrollLoadList';
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import { useRef, useState } from 'react';
import './index.less';

export default () => {
  const userData = useSelector((state) => state.common.data);
  const actionRef = useRef<ActionType>();
  const selectRecordRef = useRef<any>(null);
  const firstRenderRef = useRef(false);

  useDidShow(() => {
    if (!firstRenderRef.current) {
      firstRenderRef.current = true;
      return;
    }
    // 签署回来刷新页面
    actionRef.current?.reload();
  });

  // 删除
  const onDeleteClick = async (record) => {
    const { confirm } = await showModal({
      title: '提示',
      content: '这是一个模态弹窗',
    });
    if (!confirm) return;
    showToast({ icon: 'loading', title: '删除中' });
    const { msg } = await delMusicSong({ ids: record.ids });
    showToast({ icon: 'success', title: msg });
  };
  // 签约
  const onSignClick = async (record) => {
    selectRecordRef.current = record;
    try {
      showLoading({ title: '请稍后...' });
      const { data } = await createSchemeUrl({ ids: record.ids });
      hideLoading();
      navigateToMiniProgram({
        appId: MP_E_SIGN_APPID,
        path: `pages/guide?from=miniprogram&id=${data.flow_id}`,
        extraData: { name: userData.real_name, phone: userData.mobile },
      });
    } catch (error) {
      hideLoading();
    }
  };

  return (
    <>
      <ScrollLoadList
        actionRef={actionRef}
        request={getMusicSongManageList}
        row={(song) => (
          <ManageSongItem
            key={song.ids}
            title={song.song_name}
            price1={song.composer_price}
            price2={song.lyricist_price}
            actionRender={() => {
              if (+song.status === 0)
                return (
                  <Button
                    onClick={() =>
                      navigateTo({ url: `/pages/sell/next?pageType=claim&ids=${song.ids}` })
                    }
                    circle
                    size="xs"
                    type="primary"
                  >
                    待认领
                  </Button>
                );
              if (+song.status === 2)
                return (
                  <Button
                    onClick={() =>
                      navigateTo({ url: `/pages/sell/next?pageType=claim&ids=${song.ids}` })
                    }
                    circle
                    size="xs"
                    type="primary"
                    outline
                  >
                    词曲认领中
                  </Button>
                );
              if (+song.status === 3)
                return (
                  <Button circle size="xs" type="secondary" outline>
                    审核中
                  </Button>
                );
              if (+song.status === 4)
                return (
                  <>
                    <Button circle size="xs" type="secondary" outline>
                      已通过
                    </Button>
                    <CounterOfferButton current={song} refresh={actionRef.current?.reload} />
                  </>
                );
              if (+song.status === 5)
                return (
                  <>
                    <Button circle size="xs" type="danger" outline>
                      已驳回
                    </Button>
                    <Typography.Text
                      onClick={() => onDeleteClick(song)}
                      className="ml20"
                      type="danger"
                    >
                      删除
                    </Typography.Text>
                  </>
                );
              if (+song.status === 6)
                return (
                  <Button onClick={() => onSignClick(song)} circle size="xs" type="primary">
                    签署协议
                  </Button>
                );
              if (+song.status === 8)
                return (
                  <Button circle size="xs" type="secondary" outline>
                    签署完成
                  </Button>
                );

              if (+song.status === 9)
                return (
                  <Button circle size="xs" type="secondary" outline>
                    交易完成
                  </Button>
                );

              return null;
            }}
          />
        )}
      />
    </>
  );
};

function CounterOfferButton({ current, refresh }) {
  const [payload, setPayload] = useState<any>({
    composer_price: '',
    lyricist_price: '',
    is_change_price: false,
  });
  const [visible, set] = useState(false);

  const closeModal = () => set(false);

  const onConfirm = async () => {
    const { is_change_price, ...rest } = payload;
    if (!rest.composer_price || !rest.lyricist_price) {
      showToast({ icon: 'none', title: '请输入词曲价格' });
      return;
    }
    showToast({ icon: 'loading', title: '提交中' });
    const { msg } = await operationMusicSongPrice({
      ids: current.ids,
      ...rest,
      is_change_price: Number(is_change_price),
    });
    showToast({ icon: 'success', title: msg });
    refresh();
    closeModal();
  };
  return (
    <>
      <Typography.Text onClick={() => set(true)} className="ml20" type="primary">
        改价
      </Typography.Text>
      <AtModal isOpened={visible} onClose={closeModal}>
        <AtModalHeader>改价</AtModalHeader>
        <AtModalContent>
          <CounterOfferInput
            title="曲"
            price={current.composer_price}
            name="composer_price"
            value={payload.composer_price}
            placeholder="修改后曲价格"
            onChange={(value) => {
              setPayload((v) => ({ ...v, composer_price: value }));
              return value;
            }}
          />
          <CounterOfferInput
            title="词"
            price={current.lyricist_price}
            placeholder="修改后词价格"
            name="lyricist_price"
            value={payload.lyricist_price}
            onChange={(value) => setPayload((v) => ({ ...v, lyricist_price: value }))}
          />
          <View className="ml30">
            <Radio
              label="接受还价"
              value={payload.is_change_price}
              onChange={(value) => setPayload((v) => ({ ...v, is_change_price: value }))}
            />
          </View>
        </AtModalContent>
        <AtModalAction>
          <Flex justify="between" className="p-default pb40">
            <Button onClick={closeModal} outline circle>
              取消
            </Button>
            <Button onClick={onConfirm} type="primary" circle>
              确定
            </Button>
          </Flex>
        </AtModalAction>
      </AtModal>
    </>
  );
}
