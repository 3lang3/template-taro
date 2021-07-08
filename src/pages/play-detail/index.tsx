import cls from 'classnames';
import { useSelector } from 'react-redux';
import Flex from '@/components/Flex';
import Button from '@/components/Button';
import Image from '@/components/Image';
import { useState } from 'react';
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import { TabNavigationBar } from '@/components/CustomNavigation';
import Typography from '@/components/Typography';
import { View, Text } from '@tarojs/components';
import { CounterOfferInput, FullPageError, FullPageLoader } from '@/components/Chore';
import { hideToast, navigateBack, showModal, showToast, useRouter } from '@tarojs/taro';
import Icon from '@/components/Icon';
import PlayCore from '@/components/PlayCore';
import { useRequest } from 'ahooks';
import {
  getSongDetail,
  getSaleSongDetail,
  abandonMusicSong,
  operationMusicSongPrice,
  applyWantSong,
  delWantSong,
} from '@/services/song';
import CustomSwiper from '@/components/CustomSwiper';
import type { UserIdentityType } from '@/services/common';
import Tag from '@/components/Tag';
import { processLyricData } from '@/components/PlayCore/helper';

import './index.less';

const AUDIO_DEMO_URL = 'http://music.163.com/song/media/outer/url?id=1847422867.mp3';

type PageContentProps = {
  detail: Record<string, any>;
  routerParams: PlayDetailParams;
  identity: UserIdentityType;
};

const PageContent = ({ detail, identity, routerParams }: PageContentProps) => {
  /** 词曲制作详情页面 */
  const isScorePage = routerParams.type === 'score';
  /** 是否机构身份 */
  const isCompanyIdentity = +identity === 3;
  return (
    <>
      <TabNavigationBar title={detail.song_name} />

      <View
        className={cls('play-detail', {
          'play-detail--score': isScorePage,
        })}
      >
        <View
          className={cls('play-detail__header', {
            'play-detail__header--music': isCompanyIdentity || !isScorePage,
            'play-detail__header--score': isScorePage && !isCompanyIdentity,
          })}
        >
          {isCompanyIdentity && isScorePage && (
            <Flex className="p-default bg-white mb30" justify="center">
              <Typography.Text>
                曲{detail.composer_final_price}元 | 词{detail.lyricist_final_price}元
              </Typography.Text>
            </Flex>
          )}
          {isScorePage ? (
            <>
              <View className="play-detail__tags">
                <Tag type="light">摇滚</Tag>
                <Tag type="light">国语</Tag>
                <Tag type="light">古风</Tag>
                <Tag type="light">西域风</Tag>
              </View>
            </>
          ) : (
            <>
              <Typography.Text type="light" className="play-detail__author">
                {detail.singer}
              </Typography.Text>
              <Icon icon="icon-shouye_zhaunji_fenxiang" className="play-detail__share" />
            </>
          )}
        </View>
        <PlayCore
          src={AUDIO_DEMO_URL}
          lyricData={processLyricData(isScorePage ? detail.lyricist_content : detail.lrc_lyric)}
          lyricAutoScroll={routerParams.type !== 'score'}
        />
      </View>
      {isScorePage && (
        <>
          <View className="play-detail-desc">
            <Flex justify="between" className="play-detail-desc__title">
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                词曲说明
              </Typography.Title>
              <ScoreButton detail={detail} />
            </Flex>
            <View className="play-detail-desc__content">
              <View className="play-detail-desc__content-item">
                <Text className="play-detail-desc__content-title">作者简介:</Text>
                <Text>{detail.introduce}</Text>
              </View>
              <View className="play-detail-desc__content-item">
                <Text className="play-detail-desc__content-title">创作目的:</Text>
                <Text>{detail.explain}</Text>
              </View>
              <View className="play-detail-desc__content-item">
                <Text className="play-detail-desc__content-title">创作完成时间:</Text>
                <Text>{detail.created_at}</Text>
              </View>
              <View className="play-detail-desc__content-item">
                <Text className="play-detail-desc__content-title">作品灵感:</Text>
                <Text>
                  人们难辩过去何时成为过去,却能牢记过去的样子——从北二环到昌平近40公里,10年后的他,将这个印象深刻的儿时交付,又从斑斓浩瀚的音乐光谱中,精选与自我共振频率最高的6首经单作品~
                </Text>
              </View>
            </View>
          </View>
          <Flex justify="center" className="play-detail-action">
            {isCompanyIdentity ? (
              <>
                <GiveUpButton routerParams={routerParams} />
                {+detail.is_change_price ? (
                  <CounterOfferButton routerParams={routerParams} />
                ) : null}
              </>
            ) : (
              <ApplySingButton detail={detail} />
            )}
          </Flex>
          <View className="play-detail-action--placeholder" />
        </>
      )}
    </>
  );
};

type PlayDetailParams = {
  /**
   * 页面类型
   * - music 已制作完成歌曲播放页面(自动滚动歌词)
   * - score 词曲制作页面(根据身份展示不同视图)
   */
  type: 'score';
  ids: string;
};

export default () => {
  const { params } = useRouter<PlayDetailParams>();
  const { loading: commonLoading, data: commonData } = useSelector((state) => state.common);

  const {
    loading,
    error,
    refresh,
    data: { data } = { data: {} },
  } = useRequest(params.type === 'score' ? getSaleSongDetail : getSongDetail, {
    defaultParams: [{ ids: 527875806 }],
  });
  if (loading || commonLoading) return <FullPageLoader />;
  if (error || !data) return <FullPageError refresh={refresh} />;
  const identity = commonData.identity;
  return <PageContent detail={data} routerParams={params} identity={identity} />;
};

// 曲谱按钮 modal
function ScoreButton({ detail }) {
  const [visible, set] = useState(false);
  return (
    <>
      <Button marginAuto={false} circle outline type="primary" size="xs" onClick={() => set(true)}>
        <Icon icon="icon-icon_qupu" />
        曲谱
      </Button>
      <AtModal isOpened={visible} onClose={() => set(false)} className="modal-score">
        <AtModalHeader>曲谱</AtModalHeader>
        <AtModalContent>
          <CustomSwiper
            className="modal-score__swiper__wrapper"
            swiperClassName="modal-score__swiper"
            data={detail.composer_content || []}
            itemRender={(img) => <Image className="modal-score__img" src={img} />}
          />
          <Typography.Text type="secondary" size="sm">
            长按保存图片
          </Typography.Text>
        </AtModalContent>
      </AtModal>
    </>
  );
}

// 申请唱歌按钮
function ApplySingButton({ detail }) {
  const [status, setStatus] = useState<number>(() => +detail.status);
  // 申请唱歌
  const onSongApply = async () => {
    showToast({ icon: 'loading', title: '申请中...', mask: true });
    const { msg } = await applyWantSong({ ids: detail.ids });
    setStatus(1);
    showToast({ icon: 'success', title: msg });
  };
  // 取消申请
  const onCancelApplay = async () => {
    showToast({ icon: 'loading', title: '取消中...', mask: true });
    const { msg } = await delWantSong({ ids: detail.ids });
    setStatus(0);
    showToast({ icon: 'success', title: msg });
  };
  const onButtonClick = async () => {
    if (status === 2) return;
    if (status === 1) {
      const modalRes = await showModal({ title: '注意', content: '确定要取消申请吗？' });
      if (modalRes.confirm) {
        onCancelApplay();
      }
      return;
    }
    onSongApply();
  };
  return (
    <>
      <Button onClick={onButtonClick} circle full size="lg" type="primary">
        {(() => {
          if (+status === 1) return '已申请';
          if (+status === 2) return '已有歌手唱';
          return '申请唱歌';
        })()}
      </Button>
    </>
  );
}

// 放弃按钮 modal
function GiveUpButton({ routerParams }) {
  const [visible, set] = useState(false);
  const onConfirm = async () => {
    showToast({ icon: 'loading', title: '确认中...', mask: true });
    const { msg } = await abandonMusicSong({ ids: routerParams.ids });
    showToast({ icon: 'success', title: msg });
    setTimeout(() => navigateBack(), 1500);
  };
  return (
    <>
      <Button
        onClick={() => set(true)}
        className="play-detail-action__btn"
        full
        type="secondary"
        size="lg"
        circle
      >
        放弃收购
      </Button>
      <AtModal isOpened={visible} onClose={() => set(false)}>
        <AtModalHeader>确定放弃收购该词曲嘛?</AtModalHeader>
        <AtModalAction>
          <Flex justify="between" className="p-default pb40">
            <Button outline circle onClick={() => set(false)}>
              取消
            </Button>
            <Button type="primary" circle onClick={() => onConfirm()}>
              确定
            </Button>
          </Flex>
        </AtModalAction>
      </AtModal>
    </>
  );
}

// 还价按钮 modal
function CounterOfferButton({ routerParams }) {
  const [state, change] = useState({
    lyricist_price: '',
    composer_price: '',
  });
  const [visible, set] = useState(false);
  const onConfirm = async () => {
    const payload = {
      ...state,
      ids: routerParams.ids,
      operation_type: 2,
    };
    try {
      showToast({ icon: 'loading', title: '确认中...', mask: true });
      const { msg } = await operationMusicSongPrice(payload);
      showToast({ icon: 'success', title: msg });
    } catch (error) {
      hideToast();
    }
  };
  return (
    <>
      <Button
        onClick={() => set(true)}
        className="play-detail-action__btn"
        full
        type="primary"
        size="lg"
        circle
      >
        还价
      </Button>
      <AtModal isOpened={visible} onClose={() => set(false)}>
        <AtModalHeader>还价</AtModalHeader>
        <AtModalContent>
          <CounterOfferInput
            title="曲"
            price={2000}
            name="n1"
            value={state.composer_price}
            placeholder="还价价格"
            onChange={(value) => change((v) => ({ ...v, composer_price: value }))}
          />
          <CounterOfferInput
            title="词"
            price={3000}
            name="n2"
            placeholder="还价价格"
            value={state.lyricist_price}
            onChange={(value) => change((v) => ({ ...v, lyricist_price: value }))}
          />
        </AtModalContent>
        <AtModalAction>
          <Flex justify="between" className="p-default pb40">
            <Button onClick={() => set(false)} outline circle>
              取消
            </Button>
            <Button onClick={() => onConfirm()} type="primary" circle>
              确定
            </Button>
          </Flex>
        </AtModalAction>
      </AtModal>
    </>
  );
}
