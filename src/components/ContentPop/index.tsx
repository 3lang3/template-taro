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
  /**
   * 是否显示底部按钮
   * @todo 支持自定义按钮
   */
  footer?: boolean;
  /** 点击蒙层是否允许关闭	 */
  maskClosable?: boolean;
};

export default ({ title, content, children, footer = true, maskClosable = true }) => {
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
        <Pop overlayProps={{ onClick: () => (maskClosable ? setVisible(false) : null) }}>
          <View className="select-pop">
            <Flex className="content" direction="column" justify="between">
              <Text className="select-pop-title">{title}</Text>
              <View className="select-pop-content">{content}</View>
              {footer && (
                <AtButton onClick={() => setVisible(false)} className="select-pop-btn">
                  知道了
                </AtButton>
              )}
            </Flex>
          </View>
        </Pop>
      )}
    </>
  );
};
