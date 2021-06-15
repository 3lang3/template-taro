import cls from 'classnames';
import { CoverImage, CoverView } from '@tarojs/components';
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
  const router = useRouter();

  const handleClick = (item: TabbarListItem) => {
    switchTab({ url: '/' + item.pagePath });
  };
  const idx = getInitialTabIdx(router.path);
  return (
    <CoverView className="custom-tabbar">
      {tabBar.list.map((item, i) => (
        <CoverView
          key={item.pagePath}
          className={cls('custom-tabbar--item', {
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
  );
};

function getInitialTabIdx(path) {
  if (path.startsWith('/pages/index')) return 0;
  if (path.startsWith('/pages/lib')) return 1;
  if (path.startsWith('/pages/me')) return 2;
  return 0;
}
