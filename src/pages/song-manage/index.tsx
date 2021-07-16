import { useSelector } from 'react-redux';
import Button from '@/components/Button';
import { ManageSongItem } from '@/components/Chore';
import Typography from '@/components/Typography';
import { MP_E_SIGN_APPID } from '@/config/constant';
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
import ChangePriceModal from '@/components/ChangePriceModal';
import type { ChangePriceModalType } from '@/components/ChangePriceModal';
import ScrollLoadList, { ActionType } from '@/components/ScrollLoadList';
import { useRef } from 'react';
import './index.less';

export default () => {
  const userData = useSelector((state) => state.common.data);
  const actionRef = useRef<ActionType>();
  const selectRecordRef = useRef<any>(null);
  const counterOfferRef = useRef<ChangePriceModalType>(null);
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
      const { data } = await createSchemeUrl({ ids: record.ids } as any);
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

  const onCounterOfferClick = (record) => {
    selectRecordRef.current = record;
    counterOfferRef.current?.show({
      composer_price: record.composer_price,
      lyricist_price: record.lyricist_price,
    });
  };

  const onCounterOfferConfirm = async (values) => {
    showToast({ icon: 'loading', title: '提交中' });
    const { msg } = await operationMusicSongPrice({
      ids: selectRecordRef.current.ids,
      ...values,
      is_change_price: Number(values.is_change_price),
      operation_type: 1,
    });
    showToast({ icon: 'success', title: msg });
    actionRef.current?.reload();
    counterOfferRef.current?.close();
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
                    <Button
                      onClick={() =>
                        navigateTo({ url: `/pages/play-detail/index?ids=${song.ids}&type=score` })
                      }
                      circle
                      size="xs"
                      type="secondary"
                      outline
                    >
                      已通过
                    </Button>
                    <Typography.Text
                      onClick={() => onCounterOfferClick(song)}
                      className="ml20"
                      type="primary"
                    >
                      改价
                    </Typography.Text>
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
      <ChangePriceModal
        ref={counterOfferRef}
        title="改价"
        showChangePriceRadio
        onConfirm={onCounterOfferConfirm}
      />
    </>
  );
};
