/* eslint-disable @typescript-eslint/no-unused-vars */
import cls from 'classnames';
import { useSelector } from 'react-redux';
import { CoverImage, CoverView, View } from '@tarojs/components';
import { getCurrentInstance, useRouter, switchTab } from '@tarojs/taro';
import './index.less';

type TabbarListItem = {
  iconPath: string;
  selectedIconPath: string;
  pagePath: string;
  text: string;
};

interface AppInstance extends Taro.AppInstance {
  config: {
    tabBar: {
      color: string;
      selectedColor: string;
      backgroundColor: string;
      borderStyle: string;
      list: TabbarListItem[];
    };
  };
}

const {
  app: {
    config: { tabBar },
  },
} = getCurrentInstance() as unknown as { app: AppInstance };

export default () => {
  // 登录状态切身份为歌手的才有查看曲库页面的权限
  const { done, data } = useSelector((state) => state.common);
  // 为方便开发 暂时隐藏此逻辑
  // @ts-ignore;
  const showLib = done && data.identity === 2;

  const router = useRouter();

  const handleClick = (item: TabbarListItem) => {
    switchTab({ url: '/' + item.pagePath });
  };
  const idx = getInitialTabIdx(router.path);

  return (
    <>
      <CoverView
        className={cls('custom-tabbar', {
          'custom-tabbar--nologin': !done,
        })}
      >
        {tabBar.list.map((item, i) => (
          <CoverView
            key={item.pagePath}
            className={cls('custom-tabbar__item', {
              'custom-tabbar__item-ac': idx === i,
            })}
            onClick={() => handleClick(item)}
          >
            <CoverImage
              className="custom-tabbar__img"
              src={`../../${idx === i ? item.selectedIconPath : item.iconPath}`}
            />
            <CoverView>{item.text}</CoverView>
          </CoverView>
        ))}
      </CoverView>
      <View className="custom-tabbar-placeholder" />
    </>
  );
};

function getInitialTabIdx(path) {
  if (path.startsWith('/pages/index')) return 0;
  if (path.startsWith('/pages/lib')) return 1;
  if (path.startsWith('/pages/me')) return 2;
  return 0;
}
