import cls from 'classnames';
import { View } from '@tarojs/components';
import { navigateBack, navigateTo, showModal, switchTab, useDidShow } from '@tarojs/taro';
import { useDispatch, useSelector } from 'react-redux';
import { setIsReadAll } from '@/state/message';
import './index.less';
import Icon from '../Icon';

type CustomTabBarProps = {
  /**
   * 是否显示占位高度
   */
  fixedHeight?: boolean;
  /**
   * 背景色
   */
  isRead?: boolean; // 是否显示圆点
  bgColor?: string;
  children?: React.ReactNode;
  title?: React.ReactNode | string;
  titleColor?: string;
  className?: string;
  onIcon?: () => void; // 单击图标
  icon?: string; // 左边按钮图标
  /**
   * 是否展示主页按钮
   * @default true
   */
  home?: boolean;
  /**
   * 返回的页面深度
   * @default 1
   */
  delta?: number;
  /**
   * 主题模式
   *  - light 白色背景
   *  - dark 黑色背景 @todo
   */
  mode?: 'light' | 'default';
  /** 小字号标题 */
  smallTitle?: boolean;
};

const CustomNavigation = ({
  children,
  fixedHeight,
  title,
  titleColor,
  home = true,
  delta = 1,
  mode,
  smallTitle,
  ...props
}: CustomTabBarProps) => {
  const navigation = useSelector((state: any) => state.navigation);
  const goBack = () => {
    navigateBack({ delta });
  };
  const goHome = () => {
    switchTab({ url: '/pages/index/index' });
  };

  return (
    <>
      <View
        className={cls('custom-navi', {
          [`custom-navi--${mode}`]: mode,
        })}
        style={{ height: navigation.navBarHeight }}
      >
        <View
          className="custom-navi__box"
          style={{
            height: navigation.menuHeight,
            minHeight: navigation.menuHeight,
            lineHeight: navigation.menuHeight,
            bottom: navigation.menuBotton,
            left: navigation.menuLeft,
            right: navigation.menuLeft,
            backgroundColor: props.bgColor,
          }}
        >
          {(() => {
            // 自定义模式
            if (children) return children;
            // 只有返回按钮
            if (!home)
              return (
                <Icon
                  className="custom-navi__btn"
                  onClick={() => goBack()}
                  icon="icon-nav_icon_fanhui"
                />
              );
            // 带返回按钮和主页按钮
            return (
              <View className="custom-navi__capsule">
                <Icon
                  className="custom-navi__btn"
                  onClick={() => goBack()}
                  icon="icon-nav_icon_fanhui"
                />
                <View className="custom-navi__capsule--border" />
                <Icon
                  className="custom-navi__btn"
                  onClick={() => goHome()}
                  icon="icon-nav_shouye"
                />
              </View>
            );
          })()}
          {title ? (
            <View
              style={{ color: titleColor }}
              className={cls('custom-navi__title', { 'custom-navi__title-sm': smallTitle })}
            >
              {title}
            </View>
          ) : null}
        </View>
      </View>
      {fixedHeight && <View style={{ height: navigation.navBarHeight }} />}
    </>
  );
};

export const TabNavigationBar = ({
  title = '娱当家',
  icon = 'icon-nav_xiaoxi',
  isRead = true,
  ...props
}: CustomTabBarProps) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.common.data);
  const messageReducer = useSelector(({ message }) => message);

  useDidShow(() => {
    // 用户登录且无未读消息时
    if (userData.ids && !messageReducer.isReadAll) {
      dispatch(setIsReadAll());
    }
  });

  const handleClick = () => {
    if (!userData.ids) {
      showModal({
        title: '提示',
        content: '请先登录娱当家',
        confirmText: '去登录',
        confirmColor: '#6236ff',
        success: ({ confirm }) => {
          if (confirm) switchTab({ url: '/pages/me/index' });
        },
      });
      return;
    }
    navigateTo({ url: '/pages/message/index' });
  };

  return (
    <CustomNavigation title={title} {...props}>
      <View className="message-box">
        <Icon
          icon={icon}
          className="message-box__icon"
          onClick={props.onIcon ? props.onIcon : handleClick}
        />
        {messageReducer.isReadAll && isRead ? <View className="message-box__dot" /> : ''}
      </View>
    </CustomNavigation>
  );
};

export default CustomNavigation;
