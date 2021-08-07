import { View, Text } from '@tarojs/components';
import React, { useState, ReactElement, useEffect } from 'react';
import { showToast } from '@tarojs/taro';
import { AtButton } from 'taro-ui';
import { useBoolean } from 'ahooks';
import Flex from '../Flex';
import './index.less';

export type Node = {
  name: string;
  value: string | number;
  children: Node[];
};

export type P = {
  data: Node[]; // 数据
  value?: any[]; // 默认值
  max?: number; // 最大可选数
  title?: string; // 主标题
  toastMsg?: string; // 是否显示弹窗
  contentTitle?: string; // 内容标题
  onSubmit?: (values: Node[][]) => void; // 确定
  onCancel?: () => void; // 取消
  children?: ReactElement;
};

export default ({
  data,
  title,
  contentTitle,
  max,
  onSubmit,
  onCancel,
  children,
  toastMsg,
  value,
}: P) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [active, setActive] = useState(0);
  const [contentActive, setContentActive] = useState<Node[][]>([[], [], []]); // 返回数据
  useEffect(() => {
    if (
      value?.length &&
      !contentActive[0].length &&
      !contentActive[1].length &&
      !contentActive[2].length
    ) {
      value.forEach((item, i) => {
        contentActive[i] = item.value;
      });
    }
  }, [value]);
  function onContent(node: Node) {
    const index = contentActive[active].findIndex((item) => item.value === node.value);
    if (index >= 0) {
      contentActive[active].splice(index, 1);
    } else if (!max || max > contentActive[active].length) {
      contentActive[active].push(node);
    } else {
      if (toastMsg) {
        showToast({ icon: 'none', title: toastMsg });
      }
    }
    setContentActive([...contentActive]);
    setTrue();
  }
  return (
    <>
      {children &&
        React.cloneElement(children, {
          onClick: () => {
            if (children.props.onClick) {
              // 设置显示内容
              children.props.onClick();
            }
            setTrue();
          },
        })}
      {visible && (
        <View className="more-select">
          <View className="more-select-overlay" />
          <View className="more-select-container">
            <Text className="title">{title}</Text>
            <Flex justify="between" className="head">
              {data.map(({ name }, idx) => (
                <AtButton
                  onClick={() => setActive(idx)}
                  type="primary"
                  size="small"
                  className={`btn ${active === idx && 'active'}`}
                >
                  {name}
                </AtButton>
              ))}
            </Flex>
            <Text className="title">{contentTitle}</Text>
            <Flex wrap="wrap" justify="start" className="content">
              {data[active].children.map((item) => (
                <AtButton
                  onClick={() => onContent(item)}
                  size="small"
                  className={`btn ${
                    contentActive[active].find((v) => v.value === item.value) && 'active'
                  }`}
                >
                  {item.name}
                </AtButton>
              ))}
            </Flex>
            <Flex className="footer">
              <AtButton
                className="btn"
                onClick={() => {
                  setFalse();
                  onCancel && onCancel();
                }}
                size="small"
              >
                取消
              </AtButton>
              <AtButton
                className="btn"
                onClick={() => {
                  setFalse();
                  onSubmit && onSubmit(contentActive);
                }}
                size="small"
              >
                确定
              </AtButton>
            </Flex>
          </View>
        </View>
      )}
    </>
  );
};
