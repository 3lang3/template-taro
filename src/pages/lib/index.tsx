import { useState } from 'react';
import { Image, Text, View } from '@tarojs/components';
import cls from 'classnames';
import CustomTabBar from '@/components/CustomTabBar';
import { TabNavigationBar } from '@/components/CustomNavigation';
import { navigateTo } from '@tarojs/taro';
import Typography from '@/components/Typography';
import Tag from '@/components/Tag';
import './index.less';

const tabsData = [
  {
    key: 'q1',
    title: '流派',
    children: [
      { text: '流行1', value: 'v1' },
      { text: '轻音乐1', value: 'v2' },
    ],
  },
  {
    key: 'q2',
    title: '语种',
    children: [
      { text: '流行2', value: 'v1' },
      { text: '轻音乐2', value: 'v2' },
    ],
  },
  {
    key: 'q3',
    title: '曲谱',
    children: [
      { text: '有曲谱3', value: 'v1' },
      { text: '无曲谱3', value: 'v2' },
    ],
  },
];

// 顶部筛选器子项
const TabsItem = ({ active, text, ...props }) => {
  return (
    <View
      className={cls('lib-tabs-item', {
        'lib-tabs-item--active': active,
      })}
      {...props}
    >
      <Text className="lib-tabs-item__text">{text}</Text>
      <Image
        mode="aspectFit"
        className="lib-tabs-item__arrow"
        src={require('@/assets/icon/arrow_down_fill.svg')}
      />
    </View>
  );
};

// 顶部筛选器
const LibTabs = ({
  onChange,
  data = tabsData,
}: {
  onChange?: (v: Record<string, any>) => void;
  data?: any[];
}) => {
  const [current, setCurrent] = useState<any>(undefined);
  const [params, setParams] = useState({});
  // tab点击事件
  const onShow = (tab) => {
    if ((current && current.key) === tab.key) {
      setCurrent(undefined);
      return;
    }
    setCurrent(tab);
  };
  // 关闭mask
  const onClose = () => {
    setCurrent(undefined);
  };
  // filter选中事件
  const onChoose = (fil, tab) => {
    setParams((v) => ({
      ...v,
      [tab.key]: params[tab.key] && fil.value === params[tab.key].value ? undefined : fil,
    }));
    onClose();
    if (onChange) onChange(params);
  };

  return (
    <View className="lib-tabs">
      {data.map((tab) => (
        <TabsItem
          key={tab.key}
          active={current && current.key === tab.key}
          text={(params[tab.key] && params[tab.key].text) || tab.title}
          onClick={() => onShow(tab)}
        />
      ))}
      {current && current.key ? (
        <>
          <View className="lib-tabs__filter">
            {current.children.map((fil) => (
              <Typography.Text
                key={fil.value}
                className={cls('lib-tabs__filter__item', {
                  'lib-tabs__filter__item--active':
                    params[current.key] && params[current.key].value === fil.value,
                })}
                onClick={() => onChoose(fil, current)}
              >
                {fil.text}
              </Typography.Text>
            ))}
            <View className="lib-tabs__filter__fake" />
            <View className="lib-tabs__filter__fake" />
            <View className="lib-tabs__filter__fake" />
          </View>
          <View className="lib-tabs__mask" onClick={onClose} />
        </>
      ) : null}
    </View>
  );
};

const songsData = [
  { title: '最好的都给你', tags: ['摇滚', '国语'], lyric: 1 },
  { title: '下辈子不一定还能遇见不下辈子不一定还能遇见不', tags: ['摇滚', '国语'], lyric: 0 },
];
// 歌曲项
const SongItem = (props) => {
  return (
    <View className="lib-song-item">
      <View className="lib-song-item__content">
        <Typography.Title className="lib-song-item__title" level={3} ellipsis>
          {props.title}
        </Typography.Title>
        {Array.isArray(props.tags) && (
          <View className="lib-song-item__tag">
            {props.tags.map((el, i) => (
              <Tag key={i}>{el}</Tag>
            ))}
          </View>
        )}
      </View>
      <View className="lib-song-item__icon">
        {+props.lyric ? (
          <Image
            mode="aspectFit"
            className="lib-song-item__icon-item"
            src={require('@/assets/icon/playlist_outline.svg')}
          />
        ) : null}
        <Image
          onClick={() => navigateTo({ url: '/pages/play-detail/index' })}
          mode="aspectFit"
          className="lib-song-item__icon-item"
          src={require('@/assets/icon/play_outline.svg')}
        />
      </View>
    </View>
  );
};

export default () => {
  return (
    <>
      <TabNavigationBar />
      <LibTabs />
      {songsData.map((song, i) => (
        <SongItem key={i} {...song} />
      ))}
      <CustomTabBar />
    </>
  );
};