import { createInnerAudioContext, createSelectorQuery, useReady } from '@tarojs/taro';
import type { MovableViewProps } from '@tarojs/components/types/MovableView';
import { useEffect, useRef, useState } from 'react';
import './index.less';

type AudioStateProps = {
  current: number;
  currentFtm: string;
  duration: number;
  durationFtm: string;
  progress: number;
  dotProgress: number;
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

type UseCustomAudioParams = {
  /**
   * 音频地址
   */
  src: string;
  /**
   * 定制进度条
   * movable-view组件的id
   */
  movableAreaId: string;
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
  audioInstance: Taro.InnerAudioContext;
  /**
   * 组装好的movable-view属性
   */
  movableViewProps: Pick<MovableViewProps, 'x' | 'onChange' | 'onTouchStart' | 'onTouchEnd'>;
};

/**
 * @name 定制audio-hook
 */
export function useCustomAudio({ src, movableAreaId }: UseCustomAudioParams): UseCustomAudioReturn {
  // 音频是否暂停
  const [paused, setPaused] = useState(true);
  const [state, set] = useState<AudioStateProps>(audioInitialState);
  // 是否正在拖动进度条
  const dragging = useRef(false);
  // 拖拽区域信息
  const movable = useRef<MovableStateProps>({ width: 0, x: 0 });
  const audio = useRef<Taro.InnerAudioContext>({} as any);

  useEffect(() => {
    audio.current = createInnerAudioContext();
    audio.current.src = src;
    audio.current.autoplay = true;
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
        currentFtm: formatSecToHmm(audio.current.currentTime),
        current: audio.current.currentTime,
      } as AudioStateProps;
      // 获取音频总时长
      if (audio.current.duration && state.duration === audioInitialState.duration) {
        payload.durationFtm = formatSecToHmm(audio.current.duration);
        payload.duration = audio.current.duration;
      }
      // 进度条百分比
      payload.progress = +(audio.current.currentTime / audio.current.duration).toFixed(2);
      // 拖动中 dot的x偏移不再更新
      if (!dragging.current) {
        // @todo dot本身宽度未计算
        payload.dotProgress = payload.progress * movable.current.width;
      }
      set((v) => ({ ...v, ...payload }));
    });

    return () => audio.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取movable-view宽度
  useReady(() => {
    createSelectorQuery()
      .select(movableAreaId)
      .boundingClientRect((rect) => {
        movable.current.width = rect.width;
      })
      .exec();
  });
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
function formatSecToHmm(s: number, includeHour = false): string {
  let hour: any = Math.floor(s / 3600);
  let minu: any = Math.floor(s / 60) % 60;
  let sec: any = Math.floor(s % 60);
  if (hour < 10) hour = '0' + hour;
  if (minu < 10) minu = '0' + minu;
  if (sec < 10) sec = '0' + sec;
  return includeHour ? `${hour}:${minu}:${sec}` : `${minu}:${sec}`;
}
