import { View } from '@tarojs/components';
import { navigateBack, navigateTo, switchTab, useDidShow, getStorageSync } from '@tarojs/taro';
import { useDispatch, useSelector } from 'react-redux';
import { setIsReadAll } from '@/state/message';
import config from '@/config';
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
  bgColor?: string;
  children?: React.ReactNode;
  title?: React.ReactNode | string;
  titleColor?: string;
  className?: string;
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
};

const CustomNavigation = ({
  children,
  fixedHeight,
  title,
  titleColor,
  home = true,
  delta = 1,
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
      <View className="custom-navi" style={{ height: navigation.navBarHeight }}>
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
            <View style={{ color: titleColor }} className="custom-navi__title">
              {title}
            </View>
          ) : null}
        </View>
      </View>
      {fixedHeight && <View style={{ height: navigation.navBarHeight }} />}
    </>
  );
};

export const TabNavigationBar = ({ title = '娱当家' }: Record<string, any>) => {
  const dispatch = useDispatch();
  const messageReducer = useSelector(({ message }) => message);

  useDidShow(() => {
    // 用户登录且无未读消息时
    if (getStorageSync(config.storage.tokenKey) && !messageReducer.isReadAll) {
      dispatch(setIsReadAll());
    }
  });

  return (
    <CustomNavigation title={title} titleColor="#fff">
      <View className="message-box">
        <Icon
          icon="icon-nav_xiaoxi"
          className="message-box__icon"
          onClick={() => navigateTo({ url: '/pages/message/index' })}
        />
        {messageReducer.isReadAll ? <View className="message-box__dot" /> : ''}
      </View>
    </CustomNavigation>
  );
};

export default CustomNavigation;
