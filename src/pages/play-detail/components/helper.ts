import { getBackgroundAudioManager, createSelectorQuery } from '@tarojs/taro';
import type { MovableViewProps } from '@tarojs/components/types/MovableView';
import { useEffect, useRef, useState } from 'react';

const backgroundAudioManager = getBackgroundAudioManager();

type AudioStateProps = {
  current: number;
  currentFtm: string;
  duration: number;
  durationFtm: string;
  progress: number;
  dotProgress: number;
  lyricIndex?: number;
  lyricTranslateY?: number;
};

type MovableStateProps = {
  width: number;
  x: number;
};

const audioInitialState: AudioStateProps = {
  duration: 0,
  durationFtm: '00:00',
  current: 0,
  currentFtm: '00:00',
  progress: 0,
  dotProgress: 0,
};

// @todo 拓展audio属性设置
export type UseCustomAudioParams = {
  /**
   * 音频地址
   */
  src: string;
  /** 音频信息 `BackgroundAudioManager`需要*/
  info: {
    title: Taro.BackgroundAudioManager['title'];
    coverImgUrl?: Taro.BackgroundAudioManager['coverImgUrl'];
    epname?: Taro.BackgroundAudioManager['epname'];
    singer?: Taro.BackgroundAudioManager['singer'];
  };
  /**
   * 歌词功能
   */
  lyric?: {
    // 歌词自动滚动
    autoScroll: boolean;
    data: any[];
    nodeClassName: string;
  };
};
type UseCustomAudioReturn = {
  /**
   * 视频暂停状态
   */
  paused: boolean;
  /**
   * 音频动态数据
   */
  state: AudioStateProps;
  /**
   * InnerAudioContext实例
   */
  audioInstance: Taro.BackgroundAudioManager;
  /**
   * 组装好的movable-view属性
   */
  movableViewProps: Pick<MovableViewProps, 'x' | 'onChange' | 'onTouchStart' | 'onTouchEnd'>;
};

/**
 * @name 定制audio-hook
 */
export function useCustomAudio({ src, lyric, info }: UseCustomAudioParams): UseCustomAudioReturn {
  // 音频是否暂停
  const [paused, setPaused] = useState(true);
  const [state, set] = useState<AudioStateProps>(audioInitialState);
  // 是否正在拖动进度条
  const dragging = useRef(false);
  // 拖拽区域信息
  const movable = useRef<MovableStateProps>({ width: 0, x: 0 });
  const audio = useRef<Taro.BackgroundAudioManager>(backgroundAudioManager);
  // 歌词相关
  const lyricRef = useRef<any>({
    lyricNodesHeight: [],
    reverseData: lyric?.data.slice().reverse(),
  });

  useEffect(() => {
    audio.current.title = info.title;
    Object.entries(info).forEach(([k, v]) => {
      console.log(k, v);
      if (v) audio.current[k] = v;
    });
    audio.current.src = src;
    audio.current.onPlay(() => setPaused(false));
    audio.current.onPause(() => setPaused(true));
    // @hack
    // seek完onTimeUpdate失效...
    audio.current.onSeeked(() => {
      audio.current.pause();
      audio.current.play();
    });
    /**
     * @todo
     * - 截流优化
     */
    audio.current.onTimeUpdate(() => {
      let payload = {
        currentFtm: formatSecToHm(audio.current.currentTime),
        current: audio.current.currentTime,
      } as AudioStateProps;
      // 获取音频总时长
      if (audio.current.duration && state.duration === audioInitialState.duration) {
        payload.durationFtm = formatSecToHm(audio.current.duration);
        payload.duration = audio.current.duration;
      }
      // 进度条百分比
      payload.progress = +(audio.current.currentTime / audio.current.duration).toFixed(2);
      // 拖动中 dot的x偏移不再更新
      if (!dragging.current) {
        // @todo dot本身宽度未计算
        payload.dotProgress = payload.progress * movable.current.width;
      }

      // 歌词功能
      if (lyric && lyric.autoScroll) {
        const lyricReverseIdx = lyricRef.current.reverseData.findIndex(
          (el) => el.time <= payload.current,
        );
        payload.lyricIndex = lyricRef.current.reverseData?.length - 1 - lyricReverseIdx;
        payload.lyricTranslateY = getLyicTranslateY(
          payload.lyricIndex,
          lyricRef?.current?.lyricNodesHeight,
        );
      }
      // 状态更新
      set((v) => ({ ...v, ...payload }));
    });

    // useReady在自定义hook中不执行
    // useLayoutEffect中获取不到dom实例真实属性
    // @hack
    setImmediate(() => {
      // 获取movable-view宽度
      createSelectorQuery()
        .select('.play-core__ctrl-bar')
        .boundingClientRect((rect) => {
          movable.current.width = rect.width;
        })
        .exec();

      // 初始化歌词相关dom信息
      if (lyric) {
        createSelectorQuery()
          .selectAll(lyric.nodeClassName)
          .boundingClientRect((rects: any) => {
            lyricRef.current.lyricNodesHeight = rects.map((el) => el.height);
            lyricRef.current.lyricNodesHeight[0] = 0;
          })
          .exec();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 进度条开始拖动
  const onTouchStart = () => {
    dragging.current = true;
  };
  // 进度条拖动结束
  const onTouchEnd = () => {
    // seek时间点
    const seek = ((movable.current.x / movable.current.width) * state.duration).toFixed(2);
    audio.current.seek(+seek);
    dragging.current = false;
  };
  // 进度条拖动中
  const onDotDrag = ({ detail }) => {
    const { x, source } = detail;
    if (source === 'touch') {
      movable.current.x = x;
    }
  };

  const movableViewProps = {
    x: state.dotProgress,
    onTouchStart,
    onChange: onDotDrag,
    onTouchEnd,
  };

  return { paused, state, movableViewProps, audioInstance: audio.current };
}

/**
 * 秒数转HH:mm:ss格式
 * @param {number} s
 */
function formatSecToHm(s: number, includeHour = false): string {
  let hour: any = Math.floor(s / 3600);
  let minu: any = Math.floor(s / 60) % 60;
  let sec: any = Math.floor(s % 60);
  if (hour < 10) hour = '0' + hour;
  if (minu < 10) minu = '0' + minu;
  if (sec < 10) sec = '0' + sec;
  return includeHour ? `${hour}:${minu}:${sec}` : `${minu}:${sec}`;
}

function formatMsToSec(t: string): number {
  const [minu, sec] = t.split(':');
  return parseInt(minu, 10) * 60 + parseInt(sec, 10);
}

export type ScrollLyricItem = {
  time: number;
  text: string;
};
/**
 * 处理滚动歌词
 * @param lyrics 服务端返回的歌词数据
 */
export function processLyricData(lyrics: string[] | string): ScrollLyricItem[] {
  if (typeof lyrics === 'string') {
    return lyrics.split('\n').map((el) => ({ time: 0, text: el }));
  }
  return (lyrics as string[])
    .map((lyric, i) => {
      const lyricStr = lyric.substr(1);
      const splitIdx = lyricStr.search(/\]/);
      if (splitIdx === -1) {
        console.warn(`原歌词第${i}条格式不正确，无法解析，已忽略`);
        return false;
      }
      const splitChar = lyricStr[splitIdx];
      const [timeStr, lyricFtm] = lyricStr.split(splitChar);

      return { time: formatMsToSec(timeStr), text: lyricFtm };
    })
    .filter(Boolean) as ScrollLyricItem[];
}

/**
 * @name 获取translateY的值
 * @param {number} index
 * @param {number[]} lyricHeightArr
 * @returns {number} 返回translateY的值
 */
function getLyicTranslateY(index: number, lyricHeightArr: number[]): number {
  let y = 0;
  // 初始位置不计算
  if (index < 2) return y;
  lyricHeightArr.some((h, i) => {
    if (i >= index) {
      // 计算超过一行的余量
      y += (h - lyricHeightArr[i - 1]) / 2;
      return true;
    }
    y += h;
  });
  return y;
}
