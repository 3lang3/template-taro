import { useState, useMemo } from 'react';
import { Text, View } from '@tarojs/components';
import cls from 'classnames';
import CustomTabBar from '@/components/CustomTabBar';
import { TabNavigationBar } from '@/components/CustomNavigation';
import Flex from '@/components/Flex';
import Icon from '@/components/Icon';
import { navigateTo } from '@tarojs/taro';
import Typography from '@/components/Typography';
import { useSelector } from 'react-redux';
import ScrollLoadList from '@/components/ScrollLoadList';
import { getMusicSongList, Node } from '@/services/lib';
import { LibSongItem } from '@/components/Chore';
import ContentPop from '@/components/ContentPop';
import './index.less';

export type P = {
  onChange?: (v: Record<string, any>) => void;
  data?: any[];
  params?: Object;
};

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
      <Icon className="lib-tabs-item__arrow" icon="icon-quku_arrow_down" />
    </View>
  );
};

// 顶部筛选器
const LibTabs = ({ onChange, data = [], params = {} }: P) => {
  const [current, setCurrent] = useState<any>(undefined);
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
    const result = {
      [tab.key]: params[tab.key] && fil.value === params[tab.key].value ? undefined : fil,
    };
    onClose();
    if (onChange) onChange(result);
  };

  return (
    <View className="lib-tabs">
      {data &&
        data.map((tab) => (
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

const LibPageContent = () => {
  const { songStyle, languageVersion } = useSelector((state) => state.common);
  const tabsData = useMemo(() => {
    return () => [
      {
        key: 'sect',
        title: '曲风',
        children: songStyle.map((item) => ({ text: item.name, value: item.song_style })),
      },
      {
        key: 'language',
        title: '语种',
        children: languageVersion.map((item) => ({ text: item.name, value: item.language })),
      },
      {
        key: 'is_music_score',
        title: '曲谱',
        children: [
          { text: '有曲谱', value: 1 },
          { text: '无曲谱', value: 0 },
        ],
      },
    ];
  }, [songStyle, languageVersion]);

  const [params, setParams] = useState({});

  // 获取查询参数
  const getParams = (p) => {
    const result = {};
    Object.keys(p).forEach((item) => {
      if (p[item]) result[item] = p[item].value;
    });
    return result;
  };
  function onTabChange(values) {
    setParams((v) => ({
      ...v,
      ...values,
    }));
  }

  return (
    <>
      <TabNavigationBar />
      <LibTabs onChange={onTabChange} params={params} data={tabsData()} />
      <View className="lib-song-wrapper">
        <ScrollLoadList<Node>
          params={getParams(params)}
          request={getMusicSongList}
          row={(song, i) => (
            <LibSongItem
              key={i}
              isRead={song.is_read === 1}
              title={song.song_name}
              tags={[song.sect, song.language]}
              actionRender={() => {
                return (
                  <Flex justify="end">
                    {song.lyricist_content && (
                      <ContentPop
                        title="歌词查看"
                        content={<Typography.Text center>{song.lyricist_content}</Typography.Text>}
                      >
                        <Icon icon="icon-quku-geci" className="lib-song-action__item" />
                      </ContentPop>
                    )}
                    <Icon
                      onClick={() =>
                        navigateTo({
                          url: `/pages/play-detail/index?type=score&ids=${song.ids}`,
                        })
                      }
                      icon="icon-quku_bofang"
                      className="lib-song-action__item"
                    />
                  </Flex>
                );
              }}
            />
          )}
        />
      </View>
    </>
  );
};

/**
 * @summary tab类页面不能阻塞底部导航条渲染, 页面内容请求和默认页面渲染分离
 */
export default () => {
  return (
    <>
      <LibPageContent />
      <CustomTabBar />
    </>
  );
};
