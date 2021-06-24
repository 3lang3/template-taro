import { View, Image } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { useSelector } from 'react-redux';
import messageSrc from '@/assets/icon/index_message.svg';
import './index.less';

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
};

const CustomNavigation = ({
  children,
  fixedHeight,
  title,
  titleColor,
  ...props
}: CustomTabBarProps) => {
  const navigation = useSelector((state: any) => state.navigation);
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
          {children}
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
  return (
    <CustomNavigation title={title} titleColor="#fff">
      <View className="message-box">
        <Image
          className="message-box__img"
          onClick={() => navigateTo({ url: '/pages/message/index' })}
          src={messageSrc}
        />
        <View className="message-box__dot" />
      </View>
    </CustomNavigation>
  );
};

export default CustomNavigation;
