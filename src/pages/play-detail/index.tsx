import { useState } from 'react';
import cls from 'classnames';
import { TabNavigationBar } from '@/components/CustomNavigation';
import Image from '@/components/Image';
import Tag from '@/components/Tag';
import Typography from '@/components/Typography';
import { View, Text, Image as TaroImage, MovableArea, MovableView } from '@tarojs/components';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import Flex from '@/components/Flex';
import { AtInput, AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import { useCustomAudio } from './helper';

import './index.less';

const AUDIO_DEMO_URL = 'http://music.163.com/song/media/outer/url?id=1847422867.mp3';

const lyricData = [
  { time: 0, text: '0' },
  { time: 2, text: '2' },
  { time: 4, text: '4' },
  { time: 6, text: 'http://music.163.com/song/media/outer/url?id=1847422867.mp3' },
  { time: 8, text: '8' },
  { time: 10, text: '就算时光难逗留就算时光难逗留就算时光难逗留' },
];

export default () => {
  const { paused, state, movableViewProps, audioInstance } = useCustomAudio({
    src: AUDIO_DEMO_URL,
    movableAreaId: '#dot-movable-view',
    lyric: {
      data: lyricData,
      class: '.play-detail__lyric-item',
    },
  });

  return (
    <>
      <TabNavigationBar title="白月光与朱砂痣" />

      <View className="play-detail">
        <Flex className="p-default bg-white" justify="center">
          <Typography.Text>曲2000元 | 词3000元</Typography.Text>
        </Flex>
        <View className="play-detail__header">
          <Typography.Text type="light" className="play-detail__author">
            张杰
          </Typography.Text>
          <View className="play-detail__tags">
            <Tag type="light">摇滚</Tag>
            <Tag type="light">国语</Tag>
            <Tag type="light">古风</Tag>
            <Tag type="light">西域风</Tag>
          </View>
        </View>

        <View
          className={cls('play-detail__record', {
            'play-detail__record--play': !paused,
          })}
        >
          <Image mode="aspectFit" className="play-detail__record-cover" src="" />
          <TaroImage
            mode="aspectFit"
            className="play-detail__record-play"
            src={require('@/assets/icon/play_double.svg')}
            onClick={() => audioInstance.play()}
          />
          <TaroImage
            mode="aspectFit"
            className="play-detail__record-pause"
            src={require('@/assets/icon/pause_double.svg')}
            onClick={() => audioInstance.pause()}
          />
        </View>

        <View className="play-detail__lyric">
          <View
            id="lyric-wrapper"
            className="play-detail__lyric-wrapper"
            style={{
              transform: `translateY(-${state.lyricTranslateY}px)`,
            }}
          >
            {lyricData.map((el, i) => (
              <View
                key={el.time}
                className={cls('play-detail__lyric-item', {
                  'play-detail__lyric-item--active': state.lyricIndex === i,
                })}
              >
                {el.text}
              </View>
            ))}
          </View>
        </View>

        <View className="play-detail__ctrl">
          <View className="play-detail__ctrl-time">{state.currentFtm}</View>
          <MovableArea id="dot-movable-view" className="play-detail__ctrl-bar">
            <View className="play-detail__ctrl-bar__line">
              <View
                className="play-detail__ctrl-bar__progress"
                style={{ width: `${state.progress * 100}%` }}
              />
            </View>
            <MovableView
              animation={false}
              direction="horizontal"
              className="play-detail__ctrl-bar__dot"
              {...movableViewProps}
            />
          </MovableArea>
          <View className="play-detail__ctrl-time">{state.durationFtm}</View>
        </View>
      </View>
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
        <GiveUpButton />
        <CounterOfferButton />
      </Flex>
      <View className="play-detail-action--placeholder" />
    </>
  );
};

// 曲谱按钮 modal
function ScoreButton() {
  const [visible, set] = useState(false);
  return (
    <>
      <Button marginAuto={false} circle outline type="primary" size="xs" onClick={() => set(true)}>
        <Icon icon="icon-quku_qupu" />
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
          <Flex className="offer-modal-item" justify="between">
            <Typography.Text size="lg">曲</Typography.Text>
            <Typography.Text size="lg" type="secondary" className="mr20">
              当前: 2000元
            </Typography.Text>
            <Flex className="input--border">
              <AtInput name="n1" value="" onChange={() => null} />
            </Flex>
          </Flex>
          <Flex className="offer-modal-item" justify="between">
            <Typography.Text size="lg">词</Typography.Text>
            <Typography.Text size="lg" type="secondary" className="mr20">
              当前: 3000元
            </Typography.Text>
            <Flex className="input--border">
              <AtInput name="n2" value="" onChange={() => null} />
            </Flex>
          </Flex>
        </AtModalContent>
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
