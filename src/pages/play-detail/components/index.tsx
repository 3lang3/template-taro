import cls from 'classnames';
import Image from '@/components/Image';
import { View, Image as TaroImage, MovableArea, MovableView } from '@tarojs/components';
import { getHttpPath } from '@/utils/utils';
import Flex from '@/components/Flex';
import { useCustomAudio } from './helper';
import type { UseCustomAudioParams } from './helper';

import './index.less';

type PlayCoreProps = {
  /** 封面 */
  cover?: string;
  /** 歌曲标题 */
  title: Taro.BackgroundAudioManager['title'];
  epname?: Taro.BackgroundAudioManager['epname'];
  singer?: string | string[];
  /**
   * 服务端歌词数据
   */
  lyricData: { time: number; text: string }[];
  /**
   * 歌词是否自动滚动
   * @default true
   */
  lyricAutoScroll?: boolean;
} & Omit<UseCustomAudioParams, 'lyric' | 'info'>;

// 歌曲播放
export const PlayCore = ({
  cover = '',
  src,
  lyricData,
  lyricAutoScroll = true,
  ...props
}: PlayCoreProps) => {
  const { paused, state, movableViewProps, audioInstance } = useCustomAudio({
    src,
    info: {
      title: props.title,
      coverImgUrl: getHttpPath(cover),
      epname: props.epname,
      singer: Array.isArray(props.singer) ? props.singer.join(',') : props.singer,
    },
    lyric: lyricData.length
      ? {
          autoScroll: lyricAutoScroll,
          data: lyricData,
          nodeClassName: '.play-core__lyric-item',
        }
      : undefined,
  });

  return (
    <Flex className="play-core" direction="column" justify="between">
      <View
        className={cls('play-core__record', {
          'play-core__record--play': !paused,
        })}
      >
        <Image mode="aspectFit" className="play-core__record-cover" src={cover} />
        <TaroImage
          mode="aspectFit"
          className="play-core__record-play"
          src={require('@/assets/icon/play_double.svg')}
          onClick={() => audioInstance.play()}
        />
        <TaroImage
          mode="aspectFit"
          className="play-core__record-pause"
          src={require('@/assets/icon/pause_double.svg')}
          onClick={() => audioInstance.pause()}
        />
      </View>

      <View
        className={cls('play-core__lyric', {
          'play-core__lyric--static': !lyricAutoScroll,
        })}
      >
        <View
          id="lyric-wrapper"
          className="play-core__lyric-wrapper"
          style={
            lyricAutoScroll
              ? {
                  transform: `translateY(-${state.lyricTranslateY}px)`,
                }
              : undefined
          }
        >
          {lyricData.map((el, i) => (
            <View
              key={i}
              className={cls('play-core__lyric-item', {
                'play-core__lyric-item--active': state.lyricIndex === i,
              })}
            >
              {el.text}
            </View>
          ))}
        </View>
      </View>

      <View className="play-core__ctrl">
        <View className="play-core__ctrl-time">{state.currentFtm}</View>
        <MovableArea onClick={(e) => console.log(e)} className="play-core__ctrl-bar">
          <View className="play-core__ctrl-bar__line">
            <View
              className="play-core__ctrl-bar__progress"
              style={{ width: `${state.progress * 100}%` }}
            />
          </View>
          <MovableView
            animation={false}
            direction="horizontal"
            className="play-core__ctrl-bar__dot"
            {...movableViewProps}
          />
        </MovableArea>
        <View className="play-core__ctrl-time">{state.durationFtm}</View>
      </View>
    </Flex>
  );
};
