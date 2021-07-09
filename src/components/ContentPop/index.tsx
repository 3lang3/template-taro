import { View, Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import React, { useState } from 'react';
import Flex from '../Flex';
import Pop from '../Pop';
import './index.less';

export type P = {
  title: string;
  content: string | React.ReactNode;
  children: React.ReactElement; // 是否显示
};

export default ({ title, content, children }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          if (children.props.onClick) {
            // 设置显示内容
            children.props.onClick();
          }
          setVisible(true);
        },
      })}
      {visible && (
        <Pop>
          <View className="select-pop">
            <Flex className="content" direction="column" justify="between">
              <Text className="select-pop-title">{title}</Text>
              <Flex align="start" justify="start" className="select-pop-content">
                <Text>{content}</Text>
              </Flex>
              <AtButton onClick={() => setVisible(false)} className="select-pop-btn">
                知道了
              </AtButton>
            </Flex>
          </View>
        </Pop>
      )}
    </>
  );
};
