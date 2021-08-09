import Button from '@/components/Button';
import { ManageSongItem } from '@/components/Chore';
import Typography from '@/components/Typography';
import { operationMusicSongPrice } from '@/services/song';
import { delMusicSong, getMusicSongManageList } from '@/services/song-manage';
import {
  navigateTo,
  openDocument,
  showModal,
  showToast,
  downloadFile,
  hideToast,
  usePullDownRefresh,
  stopPullDownRefresh,
} from '@tarojs/taro';
import ChangePriceModal from '@/components/ChangePriceModal';
import type { ChangePriceModalType } from '@/components/ChangePriceModal';
import ScrollLoadList, { ActionType } from '@/components/ScrollLoadList';
import config from '@/config';
import Icon from '@/components/Icon';
import { useRef } from 'react';
import './index.less';

export default () => {
  const actionRef = useRef<ActionType>();
  const selectRecordRef = useRef<any>(null);
  const counterOfferRef = useRef<ChangePriceModalType>(null);

  // 删除
  const onDeleteClick = async (record, e) => {
    e.stopPropagation();
    const { confirm } = await showModal({
      title: '提示',
      content: '确认删除',
    });
    if (!confirm) return;
    showToast({ icon: 'loading', title: '删除中' });
    const { msg } = await delMusicSong({ ids: record.ids });
    showToast({ icon: 'success', title: msg });
    actionRef.current?.reload();
    counterOfferRef.current?.close();
  };

  const onCounterOfferClick = (record, e) => {
    e.stopPropagation();
    selectRecordRef.current = record;
    counterOfferRef.current?.show({
      composer_price: record.composer_price,
      lyricist_price: record.lyricist_price,
    });
  };

  // 认领
  const onClaimClick = (record, e, isInvited?) => {
    e.stopPropagation();
    let url = `/pages/sell/index?pageType=claim&ids=${record.ids}&status=${record.status}`;
    if (isInvited) url += '&invited=1';
    navigateTo({ url });
  };

  // 还价确认
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

  const onSignClick = (record, e) => {
    e.stopPropagation();
    navigateTo({ url: `/pages/account/index?ids=${record.ids}` });
  };

  // 预览已签署的协议
  const previewPdf = (url, e) => {
    e.stopPropagation();
    try {
      showToast({ icon: 'loading', title: '正在加载文件', mask: true });
      downloadFile({
        url,
        success: ({ tempFilePath }) => {
          hideToast();
          openDocument({ filePath: tempFilePath });
        },
      });
    } catch (error) {
      showToast({ icon: 'none', title: '预览失败！' });
    }
  };

  usePullDownRefresh(async () => {
    await actionRef.current?.pulldown();
    stopPullDownRefresh();
  });

  return (
    <>
      <ScrollLoadList
        actionRef={actionRef}
        request={getMusicSongManageList}
        row={(song) => {
          return (
            <ManageSongItem
              key={song.ids}
              title={song.song_name}
              price1={song.composer_price}
              price2={song.lyricist_price}
              onClick={() => {
                navigateTo({ url: `/pages/sell/index?ids=${song.ids}&status=${song.status}` });
              }}
              iconRender={() => <Icon className="icon-icon_xiangqing" icon="icon-icon_xiangqing" />}
              actionRender={() => {
                if (+song.status === 1)
                  return (
                    <Button
                      onClick={(e) => onClaimClick(song, e, true)}
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
                      onClick={(e) => onClaimClick(song, e)}
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
                    <Button className="audit" circle size="xs" type="secondary" outline>
                      审核中
                    </Button>
                  );
                if (+song.status === 4)
                  return (
                    <>
                      <Button circle size="xs" type="secondary" outline>
                        已通过
                      </Button>
                      <Typography.Text
                        onClick={(e) => onCounterOfferClick(song, e)}
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
                        onClick={(e) => onDeleteClick(song, e)}
                        className="ml20"
                        type="danger"
                      >
                        删除
                      </Typography.Text>
                    </>
                  );
                if (+song.status === 6)
                  return (
                    <Button onClick={(e) => onSignClick(song, e)} circle size="xs" type="primary">
                      签署协议
                    </Button>
                  );
                if (+song.status === 8)
                  return (
                    <Button
                      onClick={(e) => previewPdf(`${config.cdn}/${song.download_url}`, e)}
                      circle
                      size="xs"
                      type="secondary"
                      outline
                    >
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
          );
        }}
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
