import { View, Text } from '@tarojs/components';
import { useState } from 'react';
import { AtButton } from 'taro-ui';
import Flex from '../Flex';
import './index.less';

export type Node = {
  name: string;
  value: string | number;
  children: Node[];
};

export type P = {
  data: Node[]; // 数据
  visible: boolean; // 是否显示
  value?: (number | string)[]; // 默认值
  max?: number; // 最大可选数
  title?: string; // 主标题
  contentTitle?: string; // 内容标题
  onSubmit?: (values: Node[][]) => void; // 确定
  onCancel?: () => void; // 取消
};

export default ({ data, title, contentTitle, max, onSubmit, visible, onCancel }: P) => {
  const [active, setActive] = useState(0);
  const [contentActive, setContentActive] = useState<Node[][]>([[], [], []]); // 返回数据
  function onContent(node: Node) {
    const index = contentActive[active].findIndex((item) => item.value === node.value);
    if (index >= 0) {
      contentActive[active].splice(index, 1);
    } else if (!max || max > contentActive[active].length) {
      contentActive[active].push(node);
    }
    setContentActive([...contentActive]);
  }
  if (!visible) return <></>;
  return (
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
          <AtButton className="btn" onClick={onCancel} size="small">
            取消
          </AtButton>
          <AtButton
            className="btn"
            onClick={() => {
              onSubmit && onSubmit(contentActive);
            }}
            size="small"
          >
            确定
          </AtButton>
        </Flex>
      </View>
    </View>
  );
};
