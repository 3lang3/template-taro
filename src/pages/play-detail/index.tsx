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
import { useRouter } from '@tarojs/taro';
import Icon from '@/components/Icon';
import PlayCore from '@/components/PlayCore';
import { useRequest } from 'ahooks';
import { getSongDetail, getSaleSongDetail } from '@/services/song';
import type { UserIdentityType } from '@/services/common';
import Tag from '@/components/Tag';

import './index.less';

const AUDIO_DEMO_URL = 'http://music.163.com/song/media/outer/url?id=1847422867.mp3';

type PageContentProps = {
  detail: Record<string, any>;
  routerParams: PlayDetailParams;
  identity: UserIdentityType;
};

const PageContent = ({ detail, identity, routerParams }: PageContentProps) => {
  const isScorePage = routerParams.type === 'score';
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
              <Typography.Text>曲2000元 | 词3000元</Typography.Text>
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
          lyrics={detail.lrc_lyric}
          lyricAutoScroll={routerParams.type === 'music'}
        />
      </View>
      {isScorePage && (
        <>
          <View className="play-detail-desc">
            <Flex justify="between" className="play-detail-desc__title">
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                词曲说明
              </Typography.Title>
              <ScoreButton />
            </Flex>
            <View className="play-detail-desc__content">
              <View className="play-detail-desc__content-item">
                <Text className="play-detail-desc__content-title">作者简介:</Text>
                <Text>民国和电子结合的曲风</Text>
              </View>
              <View className="play-detail-desc__content-item">
                <Text className="play-detail-desc__content-title">创作目的:</Text>
                <Text>提高自己知名度,售卖版权去的利益</Text>
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
                <GiveUpButton />
                <CounterOfferButton />
              </>
            ) : (
              <Button circle full size="lg" type="primary">
                申请唱歌
              </Button>
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
  type: 'music' | 'score';
  ids: string;
};

export default () => {
  const { params } = useRouter<PlayDetailParams>();
  const { done, loading: commonLoading, data: commonData } = useSelector((state) => state.common);

  const {
    loading,
    error,
    refresh,
    data: { data } = { data: {} },
  } = useRequest(params.type === 'music' ? getSongDetail : getSaleSongDetail, {
    defaultParams: [{ ids: 514767089 }],
  });
  if (loading || commonLoading) return <FullPageLoader />;
  if (error || !done) return <FullPageError refresh={refresh} />;
  const identity = commonData.identity;
  return <PageContent detail={data} routerParams={params} identity={identity} />;
};

// 曲谱按钮 modal
function ScoreButton() {
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
          <Image className="modal-score__img" src="" />
          <Typography.Text type="secondary" size="sm">
            长按保存图片
          </Typography.Text>
        </AtModalContent>
      </AtModal>
    </>
  );
}

// 放弃按钮 modal
function GiveUpButton() {
  const [visible, set] = useState(false);
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
            <Button outline circle>
              取消
            </Button>
            <Button type="primary" circle>
              确定
            </Button>
          </Flex>
        </AtModalAction>
      </AtModal>
    </>
  );
}

// 还价按钮 modal
function CounterOfferButton() {
  const [visible, set] = useState(false);
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
          <CounterOfferInput title="曲" price={2000} name="n1" value="" onChange={() => null} />
          <CounterOfferInput title="词" price={3000} name="n1" value="" onChange={() => null} />
        </AtModalContent>
        <AtModalAction>
          <Flex justify="between" className="p-default pb40">
            <Button onClick={() => set(false)} outline circle>
              取消
            </Button>
            <Button type="primary" circle>
              确定
            </Button>
          </Flex>
        </AtModalAction>
      </AtModal>
    </>
  );
}
