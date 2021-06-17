import cls from 'classnames';
import { TabNavigationBar } from '@/components/CustomNavigation';
import Image from '@/components/Image';
import Tag from '@/components/Tag';
import Typography from '@/components/Typography';
import { View, Image as TaroImage, ScrollView, MovableArea, MovableView } from '@tarojs/components';
import { useCustomAudio } from './helper';
import './index.less';

const AUDIO_DEMO_URL = 'http://music.163.com/song/media/outer/url?id=1847422867.mp3';

export default () => {
  const { paused, state, movableViewProps, audioInstance } = useCustomAudio({
    src: AUDIO_DEMO_URL,
    movableAreaId: '#dot-movable-view',
  });

  return (
    <>
      <TabNavigationBar title="白月光与朱砂痣" />

      <View className="play-detail">
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

        <ScrollView scrollY enhanced showScrollbar={false} className="play-detail__lyric">
          <View className="play-detail__lyric-item">如果山水有尽头</View>
          <View className="play-detail__lyric-item">就算时光难逗留</View>
          <View className="play-detail__lyric-item play-detail__lyric-item--active">
            牵着你的手
          </View>
          <View className="play-detail__lyric-item">到一夜白头</View>
          <View className="play-detail__lyric-item">我已是最富有</View>
        </ScrollView>

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
    </>
  );
};
