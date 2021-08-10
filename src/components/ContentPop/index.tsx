import cls from 'classnames';
import { View, Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Flex from '../Flex';
import Pop from '../Pop';
import './index.less';

export type ContentPopAction = {
  show: (c: P['content']) => void;
};

export type P = {
  title: string;
  content?: string | React.ReactNode;
  children?: React.ReactElement; // 是否显示
  /**
   * 是否显示底部按钮
   * @todo 支持自定义按钮
   */
  footer?: boolean;
  /** 文本居中 */
  center?: boolean;
  /** 点击蒙层是否允许关闭	 */
  maskClosable?: boolean;
  /** 强制渲染pop */
  forceRender?: boolean;
};

export default forwardRef<unknown, P>(
  ({ title, content, children, footer = true, maskClosable = true, forceRender, center }, ref) => {
    const contentRef = useRef(content);
    const [visible, setVisible] = useState(false);

    const show = (c) => {
      contentRef.current = c;
      setVisible(true);
    };

    const renderContent = () => {
      return (
        <View className="select-pop">
          <Flex className="content" direction="column" justify="between">
            <Text className="select-pop-title">{title}</Text>
            <View
              className={cls('select-pop-content', {
                'select-pop-content--center': center,
              })}
            >
              {contentRef.current}
            </View>
            {footer && (
              <AtButton onClick={() => setVisible(false)} className="select-pop-btn">
                知道了
              </AtButton>
            )}
          </Flex>
        </View>
      );
    };

    const renderPop = () => {
      if (forceRender)
        return (
          <Pop
            style={{ display: visible ? 'block' : 'none' }}
            overlayProps={{ onClick: () => (maskClosable ? setVisible(false) : null) }}
          >
            {renderContent()}
          </Pop>
        );
      if (!visible) return null;
      return (
        <Pop overlayProps={{ onClick: () => (maskClosable ? setVisible(false) : null) }}>
          {renderContent()}
        </Pop>
      );
    };

    useImperativeHandle(ref, () => ({
      show,
    }));

    return (
      <>
        {!!children &&
          React.cloneElement(children, {
            onClick: () => {
              if (children.props.onClick) {
                // 设置显示内容
                children.props.onClick();
              }
              setVisible(true);
            },
          })}
        {renderPop()}
      </>
    );
  },
);
