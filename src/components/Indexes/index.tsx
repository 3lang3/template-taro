import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { ITouchEvent, ScrollView, View } from '@tarojs/components';
import Taro, { showToast } from '@tarojs/taro';
import { AtIndexesProps, Item } from 'taro-ui/types/indexes';

import { AtList, AtListItem } from 'taro-ui';

/**
 * taro-ui的Indexes存在比较多的场景bug
 * @see https://github.com/NervJS/taro-ui/issues?q=is%3Aissue+Indexes+is%3Aopen
 */
const Indexes: React.FC<AtIndexesProps> = (props) => {
  const startTop = useRef<any>(null);
  const itemHeight = useRef<any>(null);
  const currentIndex = useRef<any>(null);
  const [scrollIntoView, setScrollIntoView] = useState('');

  const handleClick = (item: Item): void => {
    props.onClick?.(item);
  };

  const handleTouchMove = (event: ITouchEvent): void => {
    event.stopPropagation();
    event.preventDefault();

    const { list } = props;
    const pageY = event.touches[0].pageY;
    const index = Math.floor((pageY - startTop.current) / itemHeight.current);

    if (index >= 0 && index <= list.length && currentIndex.current !== index) {
      currentIndex.current = index;
      const key = index > 0 ? list[index - 1].key : 'top';
      const touchView = `at-indexes__list-${key}`;
      jumpTarget(touchView, index);
    }
  };

  const handleTouchEnd = (): void => {
    currentIndex.current = -1;
  };

  const jumpTarget = (_scrollIntoView: string, idx: number): void => {
    const { isShowToast, isVibrate, topKey = 'Top', list } = props;
    setScrollIntoView(_scrollIntoView);
    if (isShowToast) {
      const _tipText = idx === 0 ? topKey : list[idx - 1].key;
      showToast({ title: _tipText, icon: 'none' });
    }
    if (isVibrate) {
      Taro.vibrateShort();
    }
  };

  const { className, customStyle, animation, topKey, list } = props;

  const renderMenuList = () => {
    return list.map((dataList, i) => {
      const { key } = dataList;
      const targetView = `at-indexes__list-${key}`;
      return (
        <View
          className="at-indexes__menu-item"
          key={key}
          onClick={() => jumpTarget(targetView, i + 1)}
        >
          {key}
        </View>
      );
    });
  };

  const renderIndexesList = () => {
    return list.map((dataList) => (
      <View id={`at-indexes__list-${dataList.key}`} className="at-indexes__list" key={dataList.key}>
        <View className="at-indexes__list-title">{dataList.title}</View>
        <AtList>
          {dataList.items &&
            dataList.items.map((item) => (
              <AtListItem key={item.name} title={item.name} onClick={() => handleClick(item)} />
            ))}
        </AtList>
      </View>
    ));
  };

  const rootCls = classNames('at-indexes', className);

  return (
    <View className={rootCls} style={customStyle}>
      <View className="at-indexes__menu" onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <View className="at-indexes__menu-item" onClick={() => jumpTarget('at-indexes__top', 0)}>
          {topKey}
        </View>
        {renderMenuList()}
      </View>
      <ScrollView
        className="at-indexes__body"
        scrollY
        scrollWithAnimation={animation}
        scrollIntoView={scrollIntoView}
        enhanced
      >
        <View className="at-indexes__content" id="at-indexes__top">
          {props.children}
        </View>
        {renderIndexesList()}
      </ScrollView>
    </View>
  );
};

Indexes.defaultProps = {
  customStyle: '',
  className: '',
  animation: false,
  topKey: 'Top',
  isVibrate: false,
  isShowToast: true,
  list: [],
};

export default Indexes;
